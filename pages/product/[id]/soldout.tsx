import type { NextPage } from "next";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ChatRoom, Messages, Product, User } from "@prisma/client";
import { timeForToday } from "@libs/client/utils";
import Button from "@components/button";
import Image from "next/image";
import messages from "pages/api/chatRoom/[id]/messages";

interface ChatRoomsWithProps extends ChatRoom {
  buyer: User;
  messages: Messages[];
}

interface ProductWithChatRooms extends Product {
  chatRooms: ChatRoomsWithProps[];
}

interface ProductResponse {
  ok: boolean;
  product: ProductWithChatRooms;
  isLiked: boolean;
}

const Soldout: NextPage = () => {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const productId = router.query.id;
  const { data } = useSWR<ProductResponse>(
    productId ? `/api/product/${productId}` : ``
  );
  const { data: userData } = useSWR(`/api/users/me`);
  console.log(data);

  const [key, setKey] = useState();
  const onClicked = async (e: any) => {
    await setKey(e);
  };
  const onSubmit = () => {
    if (key && productId) {
      router.push(`/product/${productId}/${key}/review`);
    }
  };
  useEffect(() => {
    if (data?.product?.userId !== userData?.profile?.id) {
      router.replace(`/product/${productId}`);
    }
  }, [router, data, userData, productId]);
  return (
    <Layout title="판매 상대를 고르세요" hasTabBar>
      <div className="mx-4 md:mx-auto md:max-w-2xl space-y-4 mt-4 ">
        {data?.product?.chatRooms?.map((chatRoom) => (
          <div onClick={() => onClicked(chatRoom.buyer.id)} key={chatRoom.id}>
            {chatRoom.messages[0] ? (
              <div
                className={`flex items-center justify-between py-2 ${
                  chatRoom.buyer.id === key
                    ? "rounded-md bg-gray-200 dark:bg-gray-600"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3 text-yellow-800 ml-3">
                  <Image
                    width={40}
                    height={40}
                    src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${chatRoom.buyer.avatar}/avatar`}
                    className="h-16 w-16 rounded-full bg-slate-500"
                    alt="프로필사진"
                  />
                  <span>{chatRoom.buyer.nickname}</span>
                </div>
                <span className="mr-3 text-xs text-gray-400 ">
                  {timeForToday(
                    Number(new Date(`${chatRoom.messages[0].updatedAt}`))
                  )}
                </span>
              </div>
            ) : null}
          </div>
        ))}
          <form onSubmit={handleSubmit(onSubmit)} className="fixed inset-x-0 bottom-24 w-full " >
        <div className="relative mx-auto flex w-full max-w-md items-center">
            <Button text="확정하기" />
        </div>
          </form>
      </div>
    </Layout>
  );
};

export default Soldout;

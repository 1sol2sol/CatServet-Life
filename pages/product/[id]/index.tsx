import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { ChatRoom, Product, User } from "@prisma/client";
import useUser from "@libs/client/hooks/useUser";
import useMutation from "@libs/client/hooks/useMutation";
import { cls, timeForToday } from "@libs/client/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface MessageResponse {
  ok: boolean;
  chatRoom: ChatRoom;
  isChatRoom?: ChatRoom;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const { handleSubmit } = useForm();
  const [state, setState] = useState<"판매중" | "판매완료">("판매중");
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    id ? `/api/product/${id}` : null
  );
  const [toggleFav] = useMutation(
    `/api/product/${id}/fav`,
    "POST"
  );
  const [deleteProduct] = useMutation(
    `/api/product/${id}`,
    "DELETE"
  );

  const onFavClick = () => {
    if (!data) return;
    boundMutate({ ...data, isLiked: !data.isLiked }, false);
    toggleFav({});
  };
  // 판매자에게 채팅하기
  const [send, { data: chatRoomData, loading }] = useMutation<MessageResponse>(
    "/api/chatRoom",
    "POST"
  );
  const onVaild = () => {
    send(id);
  };

  const handleChange = (e: any) => {
    setState(e.target.value);
  };

  useEffect(() => {
    if (state === "판매완료") {
      router.push(`/product/${id}/soldout`);
    }
  }, [state, router, id]);

  const onDelete = () => {
    deleteProduct("");
    router.push("/profile");
  };
  useEffect(() => {
    if (chatRoomData && chatRoomData?.chatRoom) {
      router.push(`/chats/${chatRoomData.chatRoom?.id}`);
    } else if (chatRoomData?.isChatRoom) {
      router.push(`/chats/${chatRoomData.isChatRoom?.id}`);
    }
  }, [chatRoomData, router]);

  return (
    <Layout title="" canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image
              src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${data?.product?.image}/public`}
              className=" bg-slate-300 object-center"
              layout="fill"
              alt="상품사진"
            />
          </div>
          <div className="flex justify-between border-b ">
            <div className="flex cursor-pointer items-center space-x-3 border-t py-3">
              <Image
                width={48}
                height={48}
                alt="프로필사진"
                src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${data?.product?.user?.avatar}/avatar`}
                className="h-12 w-12 rounded-full bg-slate-300"
              />
              <div >
                <p className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.nickname}
                </p>
                <Link href={`/users/profile/${data?.product?.user?.id}`}>
                  <a className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </a>
                </Link>
                
              </div>
            </div>
            <div>
              {user?.id === data?.product?.user?.id ? (
                <div className="mt-5 flex w-36 space-x-2">
                  <select onChange={handleChange} value={state} className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-yellow-800 focus:ring-yellow-800 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-yellow-800 dark:focus:ring-yellow-800">
                    <option value={"판매중"}>판매중</option>
                    <option value={"판매완료"}>판매완료</option>
                  </select>
                  <button
                    onClick={onDelete}
                    className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-yellow-800 focus:ring-yellow-800"
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900 inline-block mr-2">
              {data?.product?.name}
            </h1>
            <span className="text-xs font-medium text-gray-500">
                  {timeForToday(data?.product?.created)}
            </span>
            <span className="mt-3 block text-2xl text-gray-900">
              ₩{data?.product?.price}
            </span>
            <p className=" my-6 text-gray-700">{data?.product?.description}</p>
            {user?.id !== data?.product?.user?.id ? (
              <div className="flex items-center justify-between space-x-2">
                <form className="w-full" onSubmit={handleSubmit(onVaild)}>
                  <Button
                    text={loading ? "Loading..." : "판매자에게 채팅하기"}
                  />
                </form>
                <button
                  onClick={onFavClick}
                  className={cls(
                    "flex items-center justify-center rounded-md p-3 hover:bg-gray-100",
                    data?.isLiked
                      ? "text-yellow-700 hover:text-yellow-800"
                      : "text-gray-400  hover:text-gray-500"
                  )}
                >
                  {data?.isLiked ? (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            이런 상품은 어때요?
          </h2>
          <Link
            href={`/product/${data?.relatedProducts?.map(
              (product) => product.id
            )}`}
          >
            <div className=" mt-6 grid cursor-pointer grid-cols-2 gap-4">
              {data?.relatedProducts?.map((product) => (
                <div key={product.id}>
                  <div className="mb-4 h-56 w-full bg-slate-300" />
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ₩{product.price}
                  </span>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;

import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import Loading from '@components/loading';
import useSWR from "swr";
import { timeForToday } from "@libs/client/utils";
import { ChatRoom, Messages, User } from "@prisma/client";
import useUser from "@libs/client/hooks/useUser";
import Image from "next/image";

interface ChatRoomWith extends ChatRoom {
  messages: Messages[];
  buyer: User;
  seller: User;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRooms: ChatRoomWith[];
}


const Chats: NextPage = () => {
  const {data} = useSWR<ChatRoomResponse>(`/api/chatRoom`);
  console.log(data);
  const {user} = useUser();
  
  return (
    <Layout seoTitle="채팅목록" hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data ? data?.chatRooms?.map((chatroom: any) =>  ( 
          <Link href={`/chats/${chatroom.id}`} key={chatroom.id}>
          <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
          <Image
              width={48}
              height={48}
              src={chatroom.sellerId === user?.id ? `https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${chatroom.buyer.avatar}/avatar` : chatroom.buyerId === user?.id ? `https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${chatroom.seller.avatar}/avatar` : ""}
              className="h-16 w-16 rounded-full bg-slate-500"
              alt="프로필"
            />
            <div>
              <div className="flex items-center">
                <p className="text-gray-700">{chatroom.sellerId === user?.id ? chatroom.buyer.nickname : chatroom.buyerId === user?.id ? chatroom.seller.nickname : ""}</p>
                <span className="text-xs text-gray-400 ml-4">
                  {timeForToday(chatroom.messages[0]?.updatedAt)}
                </span>
              </div>
              <p className="text-sm  text-gray-500">
                {chatroom.messages[0]?.message}
              </p>
            </div>
          </a>
        </Link>
      )) : <Loading/>}
    </div>
  </Layout>
);
};
export default Chats;
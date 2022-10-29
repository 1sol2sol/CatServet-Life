import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/hooks/useMutation";
import useSWR from "swr";
import { ChatRoom, Messages, Product, User } from "@prisma/client";
import useUser from "@libs/client/hooks/useUser";
import product from "pages/api/product";

interface MessageForm {
  message: string;
}

interface MessageResponse {
  ok: boolean;
  message: string;
}

interface MessageWithUser extends Messages {
  user: User;
}

interface ChatRoomWith extends ChatRoom {
  messages: MessageWithUser[];
  buyer: User;
  seller: User;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWith;
  product: Product;
}
const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const chatRoomId = router.query.id;
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<ChatRoomResponse>(
    chatRoomId ? `/api/chatRoom/${chatRoomId}` : null,
    {
      refreshInterval: 300,
      revalidateOnFocus: true,
    }
  );
  const [send, { loading }] = useMutation(
    `/api/chatRoom/${chatRoomId}/messages`,
    "POST"
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            messages: [
              ...prev.chatRoom.messages,
              {
                id: Date.now(),
                message: form.message,
                user: { ...user },
              },
            ],
          },
        } as any),
      false
    );
    send(form);
  };
  return (
    <Layout seoTitle="채팅" canGoBack title={data?.chatRoom?.sellerId === user?.id ? data?.chatRoom.buyer.nickname : data?.chatRoom.seller.nickname}>
      <div className="space-y-4 py-10 px-4 pb-16">
        {data?.chatRoom?.messages.map((message) => (
          <Message
            avatarUrl={message.user.avatar}
            key={message.id}
            message={message.message}
            reversed={message.user.id === user?.id}
          />
        ))}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed inset-x-0 bottom-0  bg-white py-2"
        >
          <div className="relative mx-auto flex w-full  max-w-md items-center">
            <input
              {...register("message", { required: true })}
              type="text"
              className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-yellow-800 focus:outline-none focus:ring-yellow-800"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-yellow-800 px-3 text-sm text-white hover:bg-yellow-900 focus:ring-2 focus:ring-yellow-800 focus:ring-offset-2">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;

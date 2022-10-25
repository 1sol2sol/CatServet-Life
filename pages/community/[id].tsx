import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Category, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/hooks/useMutation";
import { cls, timeForToday } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";

interface AnswerWithUser extends Answer {
  user: User;
  categories: Category
}

interface PostWithUserAndCategory extends Post {
  user: User;
  categories: Category;
  _count: {
    answers: number;
    wonderings: number;
  };
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  isWondering: boolean;
  post: PostWithUserAndCategory;
}

interface  AnswerForm {
  answer: String;
}

interface AnswerResponse{
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data: userData } = useSWR(`/api/users/me`);
  const {register, handleSubmit, reset} = useForm<AnswerForm>();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );  
  const [wonder, {loading}] = useMutation(`/api/posts/${router.query.id}/wonder`, "POST");
  const [delPost] = useMutation(`/api/posts/${router.query.id}`, "DELETE")
  const [delAnswer, {data: delAnswerData}] = useMutation(`/api/posts/${router.query.id}/answers`, "DELETE")
  const [sendAnswer, {data: answerData, loading: answerLoading}] = useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`, "POST")
  const onWonderClick = () => {
    if(!data) return;
    mutate({
      ...data,
      post: {
        ...data?.post,
        _count: {
          ...data?.post._count,
          wonderings:data.isWondering ? data?.post._count.wonderings - 1 : data?.post._count.wonderings + 1,
        },
      },
      isWondering:!data.isWondering,
    }, false);
    if(!loading){
      wonder({})
    }
  };
  const onDelClick = () => {
    delPost({})
    router.replace("/community");
  }

  const onValid = (form: AnswerForm) => {
    if(answerLoading) return;
    sendAnswer(form);
  }
  useEffect(() => {
    if(answerData && answerData.ok){
      reset();
      mutate();
    }
  },[answerData,reset,mutate])

  useEffect(() => {
    if(delAnswerData && delAnswerData.ok){
      mutate();
    }
  },[delAnswerData, mutate])
  return (
    <Layout seoTitle="게시글 상세보기" canGoBack hasTabBar>
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-yellow-700 px-2.5 py-0.5 text-xs font-medium text-white">
          {data?.post?.categories.name}
        </span>
        <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
          <Image src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${data?.post?.user?.avatar}/avatar`} width={40} height={40} alt="프로필" className="h-10 w-10 rounded-full bg-slate-300" />
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700">
              {data?.post?.user?.nickname}
            </p>
            <div className="flex items-center justify-between ">
            <Link href={`/users/profiles/${data?.post?.user?.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile 
              </a>
            </Link>
            {userData?.profile?.id === data?.post?.userId ? (
            <button
             onClick={onDelClick}
              className="bg-gray-50 border border-gray-300  text-gray-900 text-xs rounded-lg focus:ring-yellow-800 focus:border-yellow-800 block px-2 h-7"
            >
              삭제
            </button>
          ) : null}
            </div>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="font-medium text-yellow-700">Q.</span>
            {data?.post?.question}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] px-4 py-2.5  text-gray-700">
            <button
              onClick={onWonderClick}
              className={cls("flex space-x-2 items-center text-sm", data?.isWondering ? "text-yellow-700" : "")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>관심 {data?.post?._count?.wonderings}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.post?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <Image src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${answer?.user?.avatar}/avatar`} width={35} height={35} alt="프로필" className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="w-full">
                <span className="block text-sm font-medium text-gray-700">
                  {answer.user.nickname}
                </span>
                <div className="flex items-center justify-between w-full">
                <span className="block text-xs text-gray-500 ">
                  {timeForToday(answer.created)}
                </span>
                <button onClick={() => {delAnswer(answer.id)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-yellow-800 focus:border-yellow-800 block px-2 h-7">삭제</button>
                </div>
                <p className="mt-2 text-gray-700">{answer.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="px-4" onSubmit={handleSubmit(onValid)} >
          <TextArea
            register={register("answer", {required: true, minLength: 5})}
            name="description"
            placeholder="이 글에 댓글을 달아보세요!"
            required
          />
          <button className="mt-2 w-full rounded-md border border-transparent bg-yellow-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-800 focus:ring-offset-2 ">
            {answerLoading ? "Loading..." : "확인"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;

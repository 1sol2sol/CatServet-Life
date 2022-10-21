import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useMutation from "@libs/client/hooks/useMutation";
import useUser from "@libs/client/hooks/useUser";
import useSWR from "swr";
import { Post, Product, Review, User } from "@prisma/client";
import { cls, timeForToday } from "@libs/client/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Item from "@components/item";

interface LogoutMutationResult {
  ok: boolean;
}

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewsResopnse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface ProductWithProps extends Product {
  _count: {
    favs: number;
    chatRooms: number;
  };
}

interface PostwithUser extends Post {
  user: User;
  _count: {
    wonderings: number;
    answers: number;
  };
}

interface MineResponse {
  ok: boolean;
  products: ProductWithProps[];
  posts: PostwithUser[];
}

const Profile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data } = useSWR<ReviewsResopnse>(`/api/reviews`);
  console.log(data);
  
  const { data: mineData } = useSWR<MineResponse>("/api/users/mine");
  const [logout, { loading, data: logoutData }] =
    useMutation<LogoutMutationResult>("/api/users/logout", "POST");
  const [state, setState] = useState<"post" | "product">();

  const onValid = () => {
    if (loading) return;
    logout("");
  };
  useEffect(() => {
    if (logoutData?.ok) {
      router.replace("/enter/login");
    }
  }, [logoutData, router]);

  return (
    <Layout hasTabBar title="나의 프로필">
      <div className="px-4">
        <div className="mt-4 flex items-center justify-between space-x-3">
          <div className="flex items-center">
            {user?.avatar ? (
              <Image
                width={64}
                height={64}
                src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${user?.avatar}/avatar`}
                className="h-16 w-16 rounded-full bg-slate-500"
                alt="프로필사진"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-500" />
            )}{" "}
            <div className="flex flex-col pl-3">
              <div className="flex space-x-2">
                <span className="font-medium text-gray-900">
                  {user?.nickname}
                </span>
              </div>
              <Link href="/profile/edit">
                <a className="text-sm text-gray-700">프로필수정 </a>
              </Link>
            </div>
          </div>
          <button onClick={onValid} className="cursor-pointer text-yellow-900">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        </div>
        <p className="mt-16 pl-2 text-lg font-semibold text-gray-800">
          나의 거래 💸
        </p>
        <div className=" flex  justify-between border-b px-2 pb-6 pt-3 ">
          <Link href="/profile/sold">
            <a className="flex items-center space-x-2">
              <div className="flex  items-center justify-center  text-yellow-800">
                <svg
                  className="h-5 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium text-gray-700">판매내역</span>
            </a>
          </Link>
          <Link href="/profile/bought">
            <a className="flex items-center space-x-2">
              <div className="flex  items-center justify-center   text-amber-800">
                <svg
                  className="h-5 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium text-gray-700">구매내역</span>
            </a>
          </Link>
          <Link href="/profile/loved">
            <a className="flex items-center space-x-2">
              <div className="flex items-center  text-amber-800">
                <svg
                  className="h-5 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="font-medium text-gray-700">관심목록</span>
            </a>
          </Link>
        </div>
        <div className="border-b pl-2 pt-6 pb-6">
          <span className="mb-3 text-lg font-semibold text-gray-800">
            활동 📝
          </span>
          <div
            onClick={() => {
              setState("product");
            }}
            className="flex cursor-pointer items-center space-x-2 pt-3 text-yellow-800"
          >
            <svg
              className="h-5 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
            <span className="font-medium text-gray-700">나의 상품</span>
          </div>
          <div>
            {state === "product"
              ? mineData?.products?.map((product: any) => (
                  <div key={product?.id}>
                    <Item
                      id={product?.id}
                      title={product?.name}
                      price={product?.price}
                      image={product?.image ? product.image : null}
                      hearts={product?._count.favs}
                      comments={product?._count.chatRooms}
                    />
                  </div>
                ))
              : null}
          </div>
          <div
            onClick={() => {
              setState("post");
            }}
            className="flex cursor-pointer items-center space-x-2 pt-3 text-yellow-800"
          >
            <svg
              className="h-5 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
            <span className="font-medium text-gray-700">나의 커뮤니티</span>
          </div>
          <div>
            {state === "post"
              ? mineData?.posts?.map((post: any) => (
                  <div key={post?.id}>
                    <Link  href={`/community/${post.id}`}>
                      <a className="flex cursor-pointer flex-col items-start pt-4 border-t mt-2">
                        <span className="ml-4 flex items-center rounded-full bg-yellow-700 px-2.5 py-0.5 text-xs font-medium text-white">
                          {post.categories.name}
                        </span>
                        <div className="mt-2 px-4 text-gray-700">
                          <span className="font-medium text-amber-800">Q.</span>
                          {post.question}
                        </div>
                        <div className="mt-5 flex w-full items-center justify-between px-4 text-xs font-medium text-gray-500">
                          {/* <span>{post.user.nickname}</span> */}
                          <span>{timeForToday(post.created)}</span>
                        </div>
                        <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5   text-gray-700">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span>관심{post._count.wonderings}</span>
                          </span>
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
                            <span>답변{post._count.answers}</span>
                          </span>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="pl-2 pt-6 pb-6">
          <span className="mb-3 text-lg font-semibold text-gray-800">
            받은 후기 💌
          </span>
        </div>
        {data?.reviews.length === 0 ? (
        <p className="text-md pl-2 text-yellow-900">아직 받은 후기가 없어요 😢 😢</p>
        ) : ""}
        {data?.reviews?.map((review) => (
          <div key={review.id}>
            <div className="flex items-center space-x-4 ">
              <Image width={50}
                height={50}
                alt="프로필사진"
                src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${review.createdBy.avatar}/avatar`} className="h-12 w-12 rounded-full bg-slate-500" />
              <div>
                <h4 className="text-sm font-bold text-gray-700">
                  {review.createdBy.nickname}
                </h4>
                <span className=" text-xs text-gray-700">{timeForToday((review.createdAt))}</span>
              </div>
            </div>
            <div className="mt-4 pl-2 text-sm text-yellow-900 pb-5">
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default Profile;

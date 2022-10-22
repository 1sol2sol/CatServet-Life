import Item from "@components/item";
import useMutation from "@libs/client/hooks/useMutation";
import useUser from "@libs/client/hooks/useUser";
import { timeForToday } from "@libs/client/utils";
import { Category, Post, Product, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProductWithProps extends Product {
  _count: {
    favs: number;
    chatRooms: number;
  };
}

interface PostWithProps extends Post {
  user: User;
  categories: Category;
  _count: {
    wonderings: number;
    answers: number;
  }
}
interface ProductResponse {
  ok: boolean;
  products: ProductWithProps[];
  posts: PostWithProps[];
}

const Search: NextPage = () => {
  const {user} = useUser();
  const router = useRouter();
  const [filter, setFilter] = useState("상품");
  const { register, handleSubmit, watch } = useForm();
  const [search, { data }] = useMutation<ProductResponse>(
    (user?.latitude && user?.longitude && user?.range ? `/api/product/search?latitude=${user?.latitude}&longitude=${user?.longitude}&range=${user?.range}` : ""),
    "POST"
  );

  console.log(data);
  
  console.log(watch("filter"));
  const filterChange = (e:any) => {
    setFilter(e.target.value)
  }

  const onClick = () => {
    router.back();
  };
  const onValid = (validForm: any) => {
    search(validForm);
  };

  return (
    <div className="px-4">
      <div className="top-0 flex items-center justify-between">
        <button onClick={onClick} className=" cursor-pointer">
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
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <div className=" w-full bg-white py-2">
          <form
            onSubmit={handleSubmit(onValid)}
            className="relative flex max-w-md items-center"
          >
            <input
              {...register("title")}
              type="text"
              className="w-full rounded-full border-gray-300 pl-28 pr-12 shadow-sm focus:border-yellow-800 focus:outline-none focus:ring-yellow-800"
            />
            <select onChange={filterChange} className="left-1 absolute rounded-2xl border-none focus:border-none focus: outline-none focus:ring-transparent" value={filter}>
              <option value="상품">상품</option>
              <option value="커뮤니티">커뮤니티</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-yellow-800 px-3 text-sm text-white hover:bg-yellow-900 focus:ring-2 focus:ring-yellow-800 focus:ring-offset-2">
                검색
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        {filter === "상품" ? data?.products?.map((result) => (
          <Item
            id={result.id}
            key={result.id}
            title={result.name}
            price={result.price}
            comments={result._count.chatRooms}
            hearts={result._count.favs}
            image={result.image}
          />
        )) : ""}
        {filter === "커뮤니티" ? data?.posts?.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`}>
                    <a className="flex cursor-pointer flex-col pt-4 items-start">
                      <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-700 text-white">
                        {post.categories.name}
                      </span>
                      <div className="mt-2 px-4 text-gray-700">
                        <span className="text-amber-800 font-medium">Q.</span> 
                        {post.question}
                      </div>
                      <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                        <span>{post.user.nickname}</span>
                        <span>{timeForToday(post.created)}</span>
                      </div>
                      <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t   w-full">
                        <span className="flex space-x-2 items-center text-sm">
                          <svg
                            className="w-4 h-4"
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
                        <span className="flex space-x-2 items-center text-sm">
                          <svg
                            className="w-4 h-4"
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
        )) : ""}
      </div>
    </div>
  );
};
export default Search;

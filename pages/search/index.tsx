import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface searchForm {
  param: string;
}
interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

const Search: NextPage = () => {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [name, setName] = useState("");
  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onClick = () => {
    router.back();
  };

  const onValid = () => {
    router.push(`/search/${name}`);
  };

  return (
    <div className="top-0 flex items-center justify-between px-4">
      <button onClick={onClick} className="">
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
            onChange={handleQuery}
            type="text"
            className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-yellow-800 focus:outline-none focus:ring-yellow-800"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button className="flex items-center rounded-full bg-yellow-800 px-3 text-sm text-white hover:bg-yellow-900 focus:ring-2 focus:ring-yellow-800 focus:ring-offset-2">
              검색
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Search;

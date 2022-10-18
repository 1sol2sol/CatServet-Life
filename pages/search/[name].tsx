import Item from "@components/item";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";


interface ProductsResponse {
  ok: boolean;
  result: Product[];
}

const SearchDetail: NextPage = () => {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [name, setName] = useState("");

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);    
  }  
  const {data} = useSWR<ProductsResponse>(`/api/search/${router.query.name}`);
  
  const onClick = () => {
    router.push("/");
  };
  
  const onValid = () => {
    router.push(`/search/${name}`);
  }

  return (
    <>
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
      <form onSubmit={handleSubmit(onValid)} className=" w-full bg-white py-2">
        <div className="relative flex max-w-md items-center">
          <input
            onChange={handleQuery}
            type="text"
            className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button className="flex items-center rounded-full bg-amber-500 px-3 text-sm text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
              검색
            </button>
          </div>
        </div>
      </form>
    </div>
    <div>
      <div>
        {data?.result?.map((result) => (
            <Item
              id={result.id}
              key={result.id}
              title={result.name}
              price={result.price}
              comments={1}
              hearts={1}
            />
          ))}
      </div>
    </div>
    </>
  );
};
export default SearchDetail;

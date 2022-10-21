import Item from "@components/item";
import useMutation from "@libs/client/hooks/useMutation";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface ProductWithProps extends Product {
  _count: {
    favs: number;
    chatRooms: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithProps[];
}

const Search: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [search, { data }] = useMutation<ProductResponse>(
    `/api/product/search`,
    "POST"
  );
  console.log(data);

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
      <div>
        {data?.products?.map((result) => (
          <Item
            id={result.id}
            key={result.id}
            title={result.name}
            price={result.price}
            comments={result._count.chatRooms}
            hearts={result._count.favs}
            image={result.image}
          />
        ))}
      </div>
    </div>
  );
};
export default Search;

import type { NextPage } from 'next'
import FloatingButton from '@components/floating-button'
import Item from '@components/item'
import Layout from '@components/layout'
import useUser from '@libs/client/hooks/useUser';
import useSWRInfinite from 'swr/infinite'
import { Product } from '@prisma/client';
import Loading from '@components/loading';
import { useInfiniteScroll } from '@libs/client/hooks/useInfiniteScroll';
import { useEffect } from 'react';


export interface ProductWithCount extends Product {
  _count: {
    favs: number;
    chatRooms: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const {user} = useUser();
  const getKey = (pageIndex: number) => {
    return `/api/product?latitude=${user?.latitude}&longitude=${user?.longitude}&range=${user?.range}&page=${pageIndex + 1}`;
  };
  const {data, setSize} = useSWRInfinite<ProductsResponse>(getKey, {
    initialSize: 1,
    revalidateAll: false,
  });
  console.log(data);
  const products = data?.map((i) => i.products).flat();
  console.log(products);
  
  const page = useInfiniteScroll();
  useEffect(() => {
    setSize(page);
  }, [setSize, page]);
  
  return (
    <Layout seoTitle='Home' hasTabBar logo>
      <div className="flex flex-col space-y-5 divide-y">
      {products?.length === 0 ? (
          <div className="w-full flex justify-center mt-80">
            <span className="text-yellow-900 font-semibold text-xl">아직 주변의 글이 없어요 😢 😢 </span>
          </div>
        ) : ""}
      {products ? 
        products?.map((product) => (
          <Item
            id={product?.id}
            key={product?.id}
            title={product?.name}
            time={product?.created}
            price={product?.price}
            comments={product?._count.chatRooms}
            image={product?.image}
            hearts={product?._count.favs}
          />
        ))
      : (
        <Loading/>
      )}
        <FloatingButton href="/product/upload">
          <svg
            className="h-6 w-6"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};
export default Home;


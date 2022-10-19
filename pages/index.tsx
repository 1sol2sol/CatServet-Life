import type { NextPage } from 'next'
import FloatingButton from '@components/floating-button'
import Item from '@components/item'
import Layout from '@components/layout'
import useUser from '@libs/client/hooks/useUser';
import useSWR from 'swr';
import { Product } from '@prisma/client';
import Loading from '@components/loading';


export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const {data} = useSWR<ProductsResponse>("/api/product");
  
  return (
    <Layout hasTabBar logo>
      <div className="flex flex-col space-y-5 divide-y">
      {data ? 
        data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            image={product.image}
            hearts={product._count.favs}
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


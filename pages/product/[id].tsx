import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";

const ItemDetail: NextPage = () => {
  return (
    <Layout title="" canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">Tom</p>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">캣타워</h1>
            <span className="mt-3 block text-2xl text-gray-900">₩100000</span>
            <p className=" my-6 text-gray-700">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque
              quia voluptas praesentium ducimus facere assumenda suscipit ipsum
              nesciunt est dolore ratione natus voluptatem facilis dignissimos
              alias sunt architecto nisi maiores dicta, repellat ullam!
              Reprehenderit, beatae atque! Voluptatum, rem? Illo nostrum, cumque
              voluptate distinctio blanditiis expedita dolorem voluptatibus est
              sequi sed.
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button text="판매자에게 연락하기" />
              <button className="flex items-center justify-center rounded-md p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <svg
                  className="h-6 w-6 "
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">비슷한 상품</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i}>
                <div className="mb-4 h-56 w-full bg-slate-300" />
                <h3 className="-mb-1 text-gray-700">아르르 캣타워</h3>
                <span className="text-sm font-medium text-gray-900">₩60000</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;

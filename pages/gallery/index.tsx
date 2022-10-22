import type { NextPage } from "next";
import Layout from "@components/layout";
import useMutation from "@libs/client/hooks/useMutation";
import useSWR from "swr";
import { Gallery, Post, Product, Review, User } from "@prisma/client";
import Image from "next/image";
import FloatingButton from "@components/floating-button";
import { useState } from "react";

interface galleryWithScore extends Gallery {
  _count: {
   scores: number;
  }
}

interface ProductsResponse {
  ok: boolean;
  photo: galleryWithScore[];
}

interface ScoreResponse {
  ok: boolean;
  isScored: boolean;
}
const Gallerys: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/gallery", {
    refreshInterval: 10,
    revalidateOnFocus: true,
  });
  console.log(data);  
  
  const [score] = useMutation(
    `/api/gallery/score`,
    "POST"
  );

  return (
    <Layout title="갤러리" hasTabBar>
      <div className="flex justify-center py-5">
        <span className="font-bold text-yellow-900 text-lg">Vote for the cutest Cat 😽  </span>
      </div>
      <div className="mx-auto w-full max-w-2xl px-4 ">
        <div className=" mx-auto grid grid-cols-2 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data ? 
        data?.photo?.map((photo) => (
            <div key={photo.id}>
            <Image
              alt="고양이사진"
              width={210}
              height={210}
              src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${photo.image}/public`}
              className="rounded-lg shadow-md"
            />
            <div>
            <button
             onClick={()=> {score(photo.id)}} className="bg-amber-50 cursor-pointer w-full text-yellow-900  font-semibold text-sm rounded-lg flex justify-center items-center hover:bg-amber-100">
              👍 Liked {photo._count.scores} 
            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg> */}
            </button>
            </div>
          </div>
          )) : "" }
        </div>
        <FloatingButton href="/gallery/imageUpload">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};
export default Gallerys;

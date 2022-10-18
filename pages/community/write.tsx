import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";

interface WriteForm {
  category: string;
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}
const Write: NextPage = () => {
  const router = useRouter();
  const {register, handleSubmit} = useForm<WriteForm>();
  const [post, {loading, data}] = useMutation<WriteResponse>("/api/posts")
  const onValid = (data: WriteForm) => {
    if(loading) return;
    post(data);    
  };
  useEffect(() => {
    if(data && data.ok ){
      router.push(`/community/${data.post.id}`)
    }
  },[data, router])
  return (
    <Layout canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <select
          {...register("category", {required: true})}
          id="categories"
          className="block w-full rounded-md border border-gray-300 focus:ring-amber-500 focus:border-amber-500 p-2.5 text-sm text-gray-900   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500"
        >
          <option selected>게시글의 주제를 선택해주세요.</option>
          <option value="집사잡담">집사잡담</option>
          <option value="할인정보">할인정보</option>
          <option value="탁묘요청">탁묘요청</option>
          <option value="병원정보">병원정보</option>
          <option value="입양홍보">입양홍보</option>
          <option value="임보요청">임보요청</option>
        </select>
        <TextArea register={register("question", {required: true, minLength: 5})} required placeholder="주인님들에 대한 다양한 정보 공유를 해봐요!" />
        <Button text={loading ? "Loading..." : "커뮤니티 글 올리기"} />
      </form>
    </Layout>
  );
};

export default Write;

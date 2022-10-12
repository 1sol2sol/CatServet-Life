import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className="space-y-4 p-4">
        <select
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
        <TextArea required placeholder="주인님들에 대한 다양한 정보 공유를 해봐요!" />
        <Button text="커뮤니티 글 올리기" />
      </form>
    </Layout>
  );
};

export default Write;

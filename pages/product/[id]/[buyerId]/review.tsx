import type { NextPage } from "next";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useMutation from "@libs/client/hooks/useMutation";
import { useEffect } from "react";

interface RreviewForm {
  review: string;
}

const Review: NextPage = () => {
  const router = useRouter();
  const productId = router.query.id  
  const buyerId = router.query.buyerId
  const { register, handleSubmit } = useForm<RreviewForm>();
  const [sendReview, {data, loading}] = useMutation(`/api/product/${productId}/${buyerId}/review`, "POST");

  const onValid = (form: RreviewForm) => {
    if(loading) return;
    sendReview(form)
  }
  useEffect(() => {
    if (data && data?.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <Layout seoTitle="리뷰작성" title="리뷰 작성" hasTabBar>
      <div className="mx-4 flex flex-col md:mx-auto md:max-w-2xl ">
        <h1 className="mt-[20vh] mb-8 text-center font-semibold text-yellow-900">
          💌 구매자에게 후기를 보내주세요.
        </h1>
        <form onSubmit={handleSubmit(onValid)}>
          <TextArea register={register("review", { required: true })} />
          <div className="mt-5">
            <Button text="작성 완료" />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Review;

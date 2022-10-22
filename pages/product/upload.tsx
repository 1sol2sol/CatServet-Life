import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/hooks/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/hooks/useCoords";
import Image from "next/image";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const {latitude, longitude} = useCoords();

  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] = useMutation<UploadProductMutation>(
    "/api/product",
    "POST"
  );
  const onValid = async ({name, photo, description, price}: UploadProductForm) => {
    if (loading) return;
    if(photo && photo.length > 0){
      const {uploadURL} = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], name);
      const {result: {id}} = await(await fetch(uploadURL, {method: "POST", body: form})).json();
      uploadProduct({name, price, description, photoId: id, latitude, longitude});
    } else {
      uploadProduct({name, price, description, latitude, longitude});
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/product/${data.product.id}`);
    }
  }, [data, router]);
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout canGoBack>
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <Image
              src={photoPreview}
              width={500}
              height={500}
              alt="상품 미리보기"
              className="h-46 w-full rounded-md text-gray-600"
            />
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-yellow-800 hover:text-yellow-800">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="글 제목"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="가격"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="게시글 내용"
        />
        <Button text={loading ? "Loading..." : "상품 올리기"} />
      </form>
    </Layout>
  );
};

export default Upload;

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
import useUser from "@libs/client/hooks/useUser";
import Image from "next/image";

interface UploadPhotoForm {
  photo: FileList;
}

interface UploadPhotoMutation {
  ok: boolean;
  // photo: Gallery;
}

const ImageUpload: NextPage = () => {
  const router = useRouter();
  const {user} = useUser();
  const { register, handleSubmit, watch } = useForm<UploadPhotoForm>();
  const [uploadPhoto, { loading, data }] = useMutation<UploadPhotoMutation>(
    "/api/gallery",
    "POST"
  );
  const onValid = async ({photo}: UploadPhotoForm) => {
    if (loading) return;
    if(photo && photo.length > 0){
      const {uploadURL} = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], user?.id+"");
      const {result: {id}} = await(await fetch(uploadURL, {method: "POST", body: form})).json();
      uploadPhoto({photoId: id});
    } 
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/gallery`);
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
          <h3 className="flex justify-center font-semibold text-yellow-900 text-xl pb-4">Mine is the cutest 🐱🐱</h3>
          {photoPreview ? (
            <Image
              src={photoPreview}
              className="h-46 w-full rounded-md text-gray-600"
              alt="photo preview"
              width={500}
              height={500}
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
        <Button text={loading ? "Loading..." : "사진 올리기"} />
      </form>
    </Layout>
  );
};

export default ImageUpload;

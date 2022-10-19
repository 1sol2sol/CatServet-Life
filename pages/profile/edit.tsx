import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/hooks/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/hooks/useMutation";
import { useRouter } from "next/router";

interface EditProfileForm {
  nickname: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok:boolean;
  error?: string;
}


const EditProfile: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, watch, setValue, handleSubmit, setError, formState: { errors }, } = useForm<EditProfileForm>();
  useEffect(() => {
    if(user?.nickname) setValue("nickname", user.nickname);
    if(user?.avatar) setAvatarPreview(`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${user?.avatar}/avatar`)
  },[user, setValue])
  const [editProfile, {data, loading}] = useMutation<EditProfileResponse>(`/api/users/me`, "PUT")
  const onValid = async ({nickname, avatar}: EditProfileForm) => {
    if(loading) return;
    if(avatar && avatar.length > 0 && user){
      const {uploadURL} = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.id+"");
      const {result: {id}} = await(await fetch(uploadURL, {
        method: "POST",
        body: form
      })).json();  
      editProfile({
        nickname,
        avatarId: id,
      })
    } else {
      editProfile({nickname})
    }
  }
  useEffect(() => {
    if(data && !data.ok && data.error) {
      setError("formErrors", {message: data.error})
    }
  },[data, setError]);
  useEffect(() => {
    if (data?.ok) {
    router.push("/profile");
    }
    }, [data, router]);
  const [avatarPreview, setAvatarPreview] = useState("")
  const avatar = (watch("avatar"));
  useEffect(() => {
    if(avatar && avatar.length > 0){
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file))
    }
  }, [avatar])
    
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? <img src={avatarPreview} className="h-14 w-14 rounded-full bg-slate-500" /> : <div className="h-14 w-14 rounded-full bg-slate-500" />}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("nickname", { required: true })}
          required
          label="닉네임"
          name="nickname"
          type="text"
        />
        {errors.formErrors ? (
          <span className="my-1 text-amber-600 font-medium block text-center text-sm">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "프로필 업데이트"} />
      </form>
    </Layout>
  );
};

export default EditProfile;

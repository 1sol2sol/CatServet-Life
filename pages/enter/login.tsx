import type { NextPage } from "next";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/hooks/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LoginForm {
  phone: string;
}
interface LoginMutationResult {
  ok: boolean;
}
interface TokenForm {
  token: string;
}

interface MutationResult {
  ok: boolean;
}

const Login: NextPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [login, { loading, data, error }] =
    useMutation<LoginMutationResult>("/api/users/login", "POST");
  const [confirmToken, { loading:tokenLoading, data:tokenData}] =
  useMutation<MutationResult>("/api/users/confirm", "POST");
  const {register:tokenRegister, handleSubmit:tokenHandleSubmit} = useForm<TokenForm>();

  const onValid = (validForm: LoginForm) => {
    if (loading) return;
    login(validForm);
  };
  const onTokenValid = (validForm: TokenForm) => {
    if(tokenLoading) return;
    confirmToken(validForm);    
  };

  const router = useRouter();
  useEffect(() => {
    if(tokenData?.ok){
      router.push("/")
    }
  },[tokenData, router])

  return (
    <div className="mt-32 px-4">
      <h3 className="text-center text-2xl font-semibold text-yellow-900">
        핸드폰 번호로 로그인해주세요.
      </h3>
      <div className="mt-10">
        {data?.ok ? (
          <form
            onSubmit={tokenHandleSubmit(onTokenValid)}
            className="flex flex-col mt-8 space-y-4"
          >
              <Input
                register={tokenRegister("token")}
                name="token"
                label="인증번호"
                type="number"
                required
              />   
              <Button text={tokenLoading ? "Loading" : "인증완료"} />
          </form>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onValid)}
              className="mt-8 flex flex-col space-y-4"
            >
              <Input
                register={register("phone")}
                name="phone"
                label="Phone number"
                type="number"
                kind="phone"
                required
              />
              <Button text={loading ? "Loading..." : "인증번호 받기"} />
            </form>
          </>
        )}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or with
              </span>
            </div>
          </div>
          <div className="mt-2 ">
            <button className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
              <Image
                src="/kakao-logo.svg"
                width={20}
                height={20}
                alt="kakaoLogo"
              />
              <span className="text-sm">카카오로 로그인하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

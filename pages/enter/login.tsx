import type { NextPage } from "next";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/hooks/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCoords from "@libs/client/hooks/useCoords";

interface LoginForm {
  email: string;
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
  const {latitude, longitude} = useCoords();
  console.log(latitude, longitude);
  
  const { register, handleSubmit } = useForm<LoginForm>();
  const [login, { loading, data, error }] =
    useMutation<LoginMutationResult>("/api/users/login", "POST");
  const [confirmToken, { loading:tokenLoading, data:tokenData}] =
  useMutation<MutationResult>("/api/users/confirm", "POST");
  const {register:tokenRegister, handleSubmit:tokenHandleSubmit} = useForm<TokenForm>();

  const onValid = (validForm: LoginForm) => {
    if (loading) return;
    login({...validForm, latitude, longitude});   
  };
  const onTokenValid = (validForm: TokenForm) => {
    if(tokenLoading) return;
    confirmToken(validForm);    
  };

  const router = useRouter();
  useEffect(() => {
    if(tokenData?.ok){
      router.replace("/")
    }
  },[tokenData, router])

  return (
    <div className="mt-32 px-4">
      <h3 className="text-center text-2xl font-semibold text-yellow-900">
        이메일 주소로 로그인해주세요.
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
                register={register("email")}
                name="email"
                label="Email Address"
                type="email"
                required
              />
              <Button text={loading ? "Loading..." : "인증번호 받기"} />
            </form>
          </>
        )}

      </div>
    </div>
  );
};
export default Login;

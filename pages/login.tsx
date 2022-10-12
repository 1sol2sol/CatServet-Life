import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";

const Login: NextPage = () => {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const onEmailClick = () => setMethod("email");
  const onPhoneClick = () => setMethod("phone");
  return (
    <div className="mt-32 px-4">
      <h3 className="text-center text-2xl font-semibold">
        핸드폰 번호로 로그인해주세요.
      </h3>
      <div className="mt-10">
        <form className="mt-8 flex flex-col space-y-4">
          <Input
            name="phone"
            label="Phone number"
            type="number"
            kind="phone"
            required
          />
          <Button text={"인증번호 받기"} />
        </form>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or enter with
              </span>
            </div>
          </div>
          <div className="mt-2 ">
            <button className="flex w-full items-center space-x-2 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
              <Image src="/kakao-logo.svg" width={20} height={20} alt="kakaoLogo"/>
              <span className="text-sm">카카오로 로그인하기</span>
            </button>  
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

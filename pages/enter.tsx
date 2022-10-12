import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const Enter: NextPage = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/login");
  };
  return (
    <div className="px-4 pt-52">
      <div className="flex flex-col items-center justify-center">
        <Image width={120} height={120} src="/cat-logo.svg" alt="logo" />
        <div className="mt-3 mb-40 flex flex-col items-center justify-center">
          <span className="mb-2 text-2xl font-semibold ">집사생활</span>
          <p className="text-center  text-lg">
            내 주변의 집사들과
            <br /> 중고거래부터 다양한 정보 공유까지 함께해봐요!{" "}
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full rounded-md border border-transparent  bg-amber-500 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
      >
        시작하기
      </button>
    </div>
  );
};
export default Enter;

import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import enterLogo from "../public/cat-enter-logo.png"

const Enter: NextPage = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/enter/login");
  };
  return (
    <div className="px-4 pt-44">
      <div className="flex flex-col items-center justify-center">
        <Image width={200} height={200} src={enterLogo} alt="logo" quality={100} />
        <div className="mt-3 mb-40 flex flex-col items-center justify-center">
          <p className="text-center text-yellow-900 font-semibold  text-lg">
            내 주변의 집사들과
            <br /> 중고거래부터 다양한 정보 공유까지 함께해봐요!{" "}
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full bottom-0 rounded-md border border-transparent  bg-yellow-800 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-900 focus:ring-offset-2"
      >
        시작하기
      </button>
    </div>
  );
};
export default Enter;

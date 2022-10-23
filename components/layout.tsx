import React from "react";
import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import Input from "./input";
import Image from "next/image";
import Head from "next/head";

interface LayoutProps {
  title?: string;
  logo?: boolean;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({
  title,
  logo,
  canGoBack,
  hasTabBar,
  children,
  seoTitle,
}: LayoutProps) {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  const onHomeClick = () => {
    router.push("/")
  }
  const onSearchClick = () => {
    router.push("/search/")
  }
  return (
    <div>
      <Head>
        <title>{seoTitle} | 집사생활</title>
      </Head>
      <div className="fixed top-0 flex h-12 w-full max-w-xl items-center justify-center  border-b bg-white px-5 text-lg  font-medium text-yellow-900">
        {canGoBack && !title ? (
          <div className="flex w-full space-x-2">
            <button onClick={onClick} >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <button onClick={onHomeClick}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </button>
          </div>
        ) : null}
        {title && canGoBack  ? (
          <div className="flex items-center">
            <button onClick={onClick} className="absolute left-4" >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
          </div>
        ) : null}
        {logo ? (
          <div className="flex w-full justify-between">
          <div className="flex items-center">
            <Image src="/cat-servant.png" width={100} height={35}  alt="catLogo"/>
          </div>
          <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-yellow-800 items-center rounded-full px-2 hover:bg-yellow-700" onClick={onSearchClick}>
            <svg aria-hidden="true" className="w-5 h-5 text-yellow-900 hover:text-white dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
        ) : null}
        {title && !canGoBack ? (
          <div className="flex items-center">
            <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
          </div>
        ) : null}

      </div>
      <div className={cls("pt-12", hasTabBar ? "pb-24" : "")}>{children}</div>
      {hasTabBar ? (
        <nav className="fixed bottom-0 flex w-full max-w-xl justify-between border-t bg-white px-10 pb-5 pt-3 text-xs text-gray-700">
          <Link href="/">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/"
                  ? "text-yellow-800"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span>홈</span>
            </a>
          </Link>
          <Link href="/community">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/community"
                  ? "text-yellow-800"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
              <span>커뮤니티</span>
            </a>
          </Link>
          <Link href="/gallery">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/gallery"
                  ? "text-yellow-800"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>              
              <span>갤러리</span>
                
            </a>
          </Link>
          <Link href="/chats">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/chats"
                  ? "text-yellow-800"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>채팅</span>
            </a>
          </Link>
          <Link href="/profile">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/profile"
                  ? "text-yellow-800"
                  : "transition-colors hover:text-gray-500"
              )}
            >
              {" "}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span>프로필</span>
            </a>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}

import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | null;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
      )}
    >
      <Image
        width={40}
        height={40}
        alt="profile"
        src={`https://imagedelivery.net/omEdHMoJ0gXM7Ip-5lbEIQ/${avatarUrl}/avatar`}
        className="z-0 rounded-full bg-gray-300"
        quality={100}
      />{" "}
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}

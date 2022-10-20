import { cls } from "@libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full bg-yellow-800 hover:bg-yellow-900 text-white  px-4 border border-transparent rounded-md shadow-sm font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-yellow-900 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-base "
      )}
    >
      {text}
    </button>
  );
}
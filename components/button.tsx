import { cls } from "../libs/utils";

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
        "w-full bg-amber-500 hover:bg-amber-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-base "
      )}
    >
      {text}
    </button>
  );
}
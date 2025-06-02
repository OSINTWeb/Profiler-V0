
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const TabButton = ({
  children,
  active,
  className,
  ...props
}: TabButtonProps) => {
  return (
    <button
      className={cn(
        "overflow-hidden flex-1 rounded-[39px] text-xl font-semibold leading-[1.4]",
        "px-[50px] py-[20px] border-solid border-2",
        active
          ? "bg-white border-neutral-50"
          : "bg-transparent border-neutral-50 text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};


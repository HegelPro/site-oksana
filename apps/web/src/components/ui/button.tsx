import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-violet text-white hover:bg-plum",
  outline: "border-[#bfb0c5] bg-transparent text-plum hover:bg-[#eee7f0]",
  light: "bg-[#fffaf4] text-plum hover:bg-[#f0e5f2]",
} as const;

type ButtonVariant = keyof typeof variants;

export function buttonStyles({
  variant = "primary",
  className,
}: { variant?: ButtonVariant; className?: string } = {}) {
  return cn(
    "inline-flex min-h-14 cursor-pointer items-center justify-center gap-[25px] rounded-[5px] border border-transparent px-6 py-4 font-sans text-sm font-[650] transition-[background-color,translate] duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-65 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-xs:px-5 max-xs:text-[13px] [&>span]:text-[21px] [&>span]:leading-none [&>span]:font-normal",
    variants[variant],
    className,
  );
}

export function Button({
  variant,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: ButtonVariant }) {
  return <button className={buttonStyles({ variant, className })} {...props} />;
}

export function ButtonLink({
  variant,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonStyles({ variant, className })} {...props} />;
}

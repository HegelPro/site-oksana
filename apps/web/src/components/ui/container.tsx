import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-[min(100%_-_40px,1200px)] max-xs:w-[calc(100%_-_32px)] md:w-[min(100%_-_72px,1200px)]",
        className,
      )}
      {...props}
    />
  );
}

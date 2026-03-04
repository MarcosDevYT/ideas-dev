import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export const Container = ({ className, id, children }: ContainerProps) => {
  return (
    <section
      id={id}
      className={cn(
        "max-w-[1920px] py-12 md:py-16 xl:py-24 px-4 md:px-8 lg:px-12 2xl:px-16",
        className,
      )}
    >
      {children}
    </section>
  );
};

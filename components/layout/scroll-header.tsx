"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScrollHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollHeader = ({ children, className }: ScrollHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full h-16 z-100 transition-all duration-200",
        scrolled && "bg-background/70 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </header>
  );
};

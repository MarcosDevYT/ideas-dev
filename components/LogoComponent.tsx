import { cn } from "@/lib/utils";

export const LogoComponent = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "font-syne font-black bg-linear-to-r from-purple-500 to-green-500 bg-clip-text text-transparent",
        className,
      )}
    >
      IdeasDev
    </span>
  );
};

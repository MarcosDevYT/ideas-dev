import { cn } from "@/lib/utils";
import Image from "next/image";

export const LogoComponent = ({
  className,
  navigation = false,
}: {
  className?: string;
  navigation?: boolean;
}) => {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-syne font-black bg-linear-to-r from-purple-500 to-green-500 bg-clip-text text-transparent",
        className,
      )}
    >
      {navigation && (
        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
      )}
      IdeasDev
    </span>
  );
};

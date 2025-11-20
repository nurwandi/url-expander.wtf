import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href?: string;
  cta?: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col overflow-hidden rounded-3xl cursor-pointer h-[180px] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-the-frick-rust/20",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col items-center justify-center gap-3 p-6 h-full transition-all duration-500 ease-out group-hover:-translate-y-2">
      <Icon className="h-12 w-12 text-the-frick-rust transition-all duration-500 ease-out group-hover:scale-90 group-hover:rotate-6" />
      <h3 className="text-lg font-bold font-display text-the-frick-text text-center transition-all duration-500 ease-out group-hover:text-the-frick-rust group-hover:scale-105">
        {name}
      </h3>
    </div>

    {/* Description - slides up from bottom with gradient overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 pt-16 bg-gradient-to-t from-white via-white/95 to-transparent translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none z-20">
      <p className="text-sm text-the-frick-text leading-relaxed">
        {description}
      </p>
    </div>

    {href && (
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-30",
        )}
      >
        <a
          href={href}
          className="pointer-events-auto text-sm font-medium text-the-frick-rust hover:underline hover:translate-x-1 transition-transform duration-300"
        >
          {cta || "Learn more →"}
        </a>
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out group-hover:bg-gradient-to-br group-hover:from-the-frick-rust/10 group-hover:to-transparent z-10" />
  </div>
);

export { BentoCard, BentoGrid };

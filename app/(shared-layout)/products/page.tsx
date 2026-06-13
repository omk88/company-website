import { Metadata } from "next";
import { RiAliensFill } from "react-icons/ri";

export const metadata: Metadata = {
  title: "Products",
};

export default function Products() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-center transition-colors duration-300 ease-in-out">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Products
        </p>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Coming soon
          <span className="inline-flex">
            <span className="animate-dot-1">.</span>
            <span className="animate-dot-2">.</span>
            <span className="animate-dot-3">.</span>
          </span>
        </h1>


        <RiAliensFill className="text-7xl text-emerald-600 dark:text-green-400 max-w-sm mx-auto pt-2 transition-colors duration-300" />

      </div>
    </div>
  );
}
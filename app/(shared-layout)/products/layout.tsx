import Footer from "@/components/web/Footer";
import { ReactNode } from "react";

export default async function ProductsLayout({ children }: { children: ReactNode }) {
  
  return (
    <div className="pt-16 min-h-[calc(100vh-4rem)]">
        {children} 
        <Footer />
    </div>
  );
}
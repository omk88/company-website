import Footer from "@/components/web/Footer";
import { ReactNode } from "react";

export default async function CookieLayout({ children }: { children: ReactNode }) {
  
  return (
    <div>
        {children} 
        <Footer />
    </div>
  );
}
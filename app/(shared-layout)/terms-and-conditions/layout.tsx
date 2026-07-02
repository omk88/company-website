import Footer from "@/components/web/Footer";
import { ReactNode } from "react";

export default async function TermsLayout({ children }: { children: ReactNode }) {
  
  return (
    <div>
        {children} 
        <Footer />
    </div>
  );
}
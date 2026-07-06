import { ConvexClientProvider } from "../../ConvexClientProvider";

interface CompanyLayoutProps {
  children: React.ReactNode;
}


// Ensure that adding convex client provider here doesnt cause security issues
export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div>            
      <main>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </main>
    </div>
  );
}
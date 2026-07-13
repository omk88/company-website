import { ConvexClientProvider } from "../../ConvexClientProvider";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

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
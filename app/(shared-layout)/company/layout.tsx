import { preloadAuthQuery } from "@/lib/auth-server";
import { ConvexClientProvider } from "../../ConvexClientProvider";
import { api } from "@/convex/_generated/api";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div>            
      <main>
        <ConvexClientProvider preloadedUser={preloadedUser} >
          {children}
        </ConvexClientProvider>
      </main>
    </div>
  );
}
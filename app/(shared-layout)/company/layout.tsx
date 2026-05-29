import { verifyCompanyUser } from "@/lib/auth-guard";

interface CompanyLayoutProps {
    children: React.ReactNode;
}

export default async function CompanyLayout({ children }: CompanyLayoutProps) {
    await verifyCompanyUser(); 

    return (
        <div className="company-dashboard-layout">
            <aside>Company Admin Navigation</aside> 
            
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
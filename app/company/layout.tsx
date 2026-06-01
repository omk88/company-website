interface CompanyLayoutProps {
  children: React.ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  return (
    <div className="company-dashboard-layout">            
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
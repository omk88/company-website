import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/web/Navbar").then((mod) => mod.Navbar), {
  ssr: true,
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-clip">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
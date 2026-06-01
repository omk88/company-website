import { ConvexClientProvider } from "@/app/ConvexClientProvider";

export default function AuthProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      {children}
    </ConvexClientProvider>
  );
}
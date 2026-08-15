import { Lexend } from "next/font/google";

const blogFont = Lexend({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-blog-custom",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${blogFont.className} ${blogFont.variable}`}>
      {children}
    </div>
  );
}
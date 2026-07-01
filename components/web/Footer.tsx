import Link from "next/link";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <div className="w-full relative z-50 bg-background">
      <Separator />

      <footer className="w-full max-w-7xl mx-auto py-12 px-6 text-sm text-muted-foreground">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          
          <div className="flex flex-col gap-4 col-span-2 md:col-span-4 lg:col-span-1">
            <span className="font-poppins-text text-2xl font-extrabold text-foreground tracking-tight">
              TaQtiQ
            </span>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="https://www.linkedin.com/company/taqtiq-tech" className="hover:text-foreground transition-colors">
                <FaLinkedin size={18} />
              </Link>
              <Link href="https://www.instagram.com/taqtiq_tech" className="hover:text-foreground transition-colors">
                <FaInstagram size={18} />
              </Link>
              <Link href="https://x.com/TaQtiQ_tech" className="hover:text-foreground transition-colors">
                <FaXTwitter size={16} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">About us</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/vision" className="hover:text-foreground transition-colors">About TaQtiQ</Link></li>
              <li><Link href="/vision" className="hover:text-foreground transition-colors">Company info</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/products" className="hover:text-foreground transition-colors">Media gallery</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">For investors</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Community</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/vision" className="hover:text-foreground transition-colors">Creators</Link></li>
              <li><Link href="/vision" className="hover:text-foreground transition-colors">Developers</Link></li>
              <li><Link href="/vision" className="hover:text-foreground transition-colors">Businesses</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Site terms</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Our actions</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Data and privacy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Responsible business</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">App support</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Help Centre</Link></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
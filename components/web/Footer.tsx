import Link from "next/link";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <div className="w-full">
      <Separator />

      <footer className="w-full max-w-7xl mx-auto py-12 px-6 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          
          <div className="flex flex-col gap-4 lg:col-span-1">
            <span className="text-xl font-bold text-foreground tracking-tight">
              TaQtiQ
            </span>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                <FaLinkedin size={18} />
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                <FaInstagram size={18} />
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                <FaXTwitter size={16} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">TaQtiQ Store</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Ray-Ban glasses</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Oakley glasses</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Accessories</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Apps and games</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Refurbished</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Store support and legal</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Centre</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Order status</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Community</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Creators</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Developers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Businesses</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Non-profits</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Our actions</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Data and privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Responsible business</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">About us</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="#" className="hover:text-foreground transition-colors">About Meta</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Company info</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Media gallery</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">For investors</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Site terms</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Community Standards</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookie settings</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">App support</h3>
              <ul className="flex flex-col gap-2">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Centre</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
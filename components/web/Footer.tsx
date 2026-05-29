import Link from "next/link";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="w-full pb-8 px-4 flex justify-center relative z-10">
      
      <footer className="w-full max-w-6xl bg-white/30 backdrop-blur-xl rounded-[2.5rem] py-12 px-10 text-sm text-neutral-800 
        border border-white/60
        shadow-[0_10px_30px_rgba(0,0,0,0.03),inset_1px_1px_2px_rgba(255,255,255,0.7)]"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-black text-neutral-950 tracking-tight">
              <span>TaQtiQ</span>
            </div>
            
            <div className="flex items-center gap-5 text-neutral-800">
              <Link href="#" className="hover:text-neutral-500 transition-colors duration-200"><FaLinkedin size={20} /></Link>
              <Link href="#" className="hover:text-neutral-500 transition-colors duration-200"><FaInstagram size={20} /></Link>
              <Link href="#" className="hover:text-neutral-500 transition-colors duration-200"><FaXTwitter size={18} /></Link>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">TaQtiQ Store</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Ray-Ban glasses</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Oakley glasses</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Accessories</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Apps and games</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Refurbished</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">Store support and legal</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Help Centre</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Order status</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">Community</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Creators</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Developers</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Businesses</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Non-profits</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">Our actions</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Data and privacy</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Responsible business practices</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-neutral-950 tracking-tight">About us</h3>
            <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
              <li><Link href="#" className="hover:text-neutral-500 transition-colors">About Meta</Link></li>
              <li><Link href="#" className="hover:text-neutral-500 transition-colors">Company info</Link></li>
              <li><Link href="#" className="hover:text-neutral-500 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-neutral-500 transition-colors">Media gallery</Link></li>
              <li><Link href="#" className="hover:text-neutral-500 transition-colors">For investors</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">Site terms and policies</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Community Standards</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Cookie settings</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-neutral-950 tracking-tight">App support</h3>
              <ul className="flex flex-col gap-2.5 opacity-85 font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Help Centre</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Help Centre</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6"; // Optional icons

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12 text-sm text-gray-600">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <span>TaQtiQ</span>
            </div>
            
            <div className="flex items-center gap-5 text-gray-700">
              <Link href="#" className="hover:text-gray-900 transition"><FaLinkedin size={20} /></Link>
              <Link href="#" className="hover:text-gray-900 transition"><FaInstagram size={20} /></Link>
              <Link href="#" className="hover:text-gray-900 transition"><FaXTwitter size={18} /></Link>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">TaQtiQ Store</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Ray-Ban glasses</Link></li>
                <li><Link href="#" className="hover:underline">Oakley glasses</Link></li>
                <li><Link href="#" className="hover:underline">Accessories</Link></li>
                <li><Link href="#" className="hover:underline">Apps and games</Link></li>
                <li><Link href="#" className="hover:underline">Refurbished</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">Store support and legal</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Help Centre</Link></li>
                <li><Link href="#" className="hover:underline">Order status</Link></li>
                <li><Link href="#" className="hover:underline">Returns</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">Community</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Creators</Link></li>
                <li><Link href="#" className="hover:underline">Developers</Link></li>
                <li><Link href="#" className="hover:underline">Businesses</Link></li>
                <li><Link href="#" className="hover:underline">Non-profits</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">Our actions</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Data and privacy</Link></li>
                <li><Link href="#" className="hover:underline">Responsible business practices</Link></li>
                <li><Link href="#" className="hover:underline">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-900">About us</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#" className="hover:underline">About Meta</Link></li>
              <li><Link href="#" className="hover:underline">Company info</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Media gallery</Link></li>
              <li><Link href="#" className="hover:underline">For investors</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">Site terms and policies</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Community Standards</Link></li>
                <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:underline">Terms</Link></li>
                <li><Link href="#" className="hover:underline">Cookie settings</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-900">App support</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="hover:underline">Help Centre</Link></li>
                <li><Link href="#" className="hover:underline">Help Centre</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
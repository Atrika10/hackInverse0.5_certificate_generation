import Image from "next/image";
import Link from "next/link";
import { HowItWorksButton } from "@/components/HowItWorks";
import logo from "@/public/logo_dark.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#07070f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          {/* CSS sets the size; `sizes` matches the rendered width (h-7 / sm:h-9) so a small variant is downloaded */}
          <Image
            src={logo}
            alt="HackInverse"
            sizes="(min-width: 640px) 196px, 153px"
            loading="eager"
            className="h-7 w-auto sm:h-9"
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/40">
          <Link
            href="/"
            className="hover:text-white/80 transition-colors duration-150"
          >
            Home
          </Link>
          <HowItWorksButton className="cursor-pointer hover:text-white/80 transition-colors duration-150">
            How it works
          </HowItWorksButton>
        </nav>
      </div>
    </header>
  );
}

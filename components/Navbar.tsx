import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#07070f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-bold text-lg tracking-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-cyan-400">
              Hack
            </span>
            <span className="text-white/90">Inverse</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/40">
          <Link
            href="/"
            className="hover:text-white/80 transition-colors duration-150"
          >
            Home
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-white/80 transition-colors duration-150"
          >
            How it works
          </a>
        </nav>
      </div>
    </header>
  );
}

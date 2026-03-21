import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — HackInverse",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        {/* Glitch number */}
        <div className="relative inline-block mb-6">
          <span
            aria-hidden
            className="absolute inset-0 text-[96px] font-black text-pink-500/20 blur-sm select-none flex items-center justify-center"
          >
            404
          </span>
          <span className="relative text-[96px] font-black text-transparent bg-clip-text bg-linear-to-br from-pink-500 to-cyan-400 leading-none">
            404
          </span>
        </div>

        <h1 className="text-xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          The team or member you&apos;re looking for doesn&apos;t exist in our records.
          Please double-check the name or go back and search again.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
            bg-linear-to-r from-pink-600 to-pink-500
            hover:from-pink-500 hover:to-pink-400
            active:scale-95 transition-all duration-150 text-white shadow-lg shadow-pink-500/20"
        >
          ← Search certificates
        </Link>
      </div>
    </main>
  );
}

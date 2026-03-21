import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-6 py-24 text-center overflow-hidden">
        {/* Background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]"
        />
        {/* Glow blobs */}
        <div aria-hidden className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full bg-pink-600/10 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-1/4 left-1/3 w-100 h-75 rounded-full bg-cyan-500/8 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            HackInverse 2026
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-400 to-cyan-400">
              HackInverse
            </span>{" "}
            <span className="text-white/90">Certificate</span>
            <br />
            <span className="text-white/90">Portal</span>
          </h1>

          <p className="text-white/45 text-base sm:text-lg max-w-md leading-relaxed">
            Find and download your hackathon participation certificate. Search by your team name to get started.
          </p>

          {/* Search */}
          <div className="w-full max-w-xl mt-2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative px-6 py-20 border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-white/80 mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-white/5 bg-white/2 p-6 flex flex-col gap-3"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-linear-to-br from-pink-500/20 to-cyan-500/20 border border-white/10 text-white/70">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white/80">{step.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-white/25">
            Top 3 winning teams receive their certificates directly via registered email.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 text-center text-sm text-white/20">
        HackInverse Hackathon &mdash; 2026
      </footer>
    </>
  );
}

const STEPS = [
  {
    title: "Search your team",
    desc: "Type your team name in the search bar. Partial matches are supported so you don't need to get it exactly right.",
  },
  {
    title: "Select your name",
    desc: "Once your team is found, pick your name from the list of registered members.",
  },
  {
    title: "Download certificate",
    desc: "Your personalised certificate is instantly generated. Download it as PNG or PDF.",
  },
];

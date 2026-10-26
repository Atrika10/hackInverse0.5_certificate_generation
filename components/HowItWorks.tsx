"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";

interface HowItWorksContextValue {
  sectionRef: RefObject<HTMLElement | null>;
  // Set when navigating to the home page so the section scrolls into view once it mounts
  pendingScrollRef: RefObject<boolean>;
}

const HowItWorksContext = createContext<HowItWorksContextValue | null>(null);

function useHowItWorks() {
  const ctx = useContext(HowItWorksContext);
  if (!ctx) throw new Error("useHowItWorks must be used within HowItWorksProvider");
  return ctx;
}

function scrollToSection(section: HTMLElement | null) {
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HowItWorksProvider({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pendingScrollRef = useRef(false);

  return (
    <HowItWorksContext.Provider value={{ sectionRef, pendingScrollRef }}>
      {children}
    </HowItWorksContext.Provider>
  );
}

export function HowItWorksButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { sectionRef, pendingScrollRef } = useHowItWorks();

  function handleClick() {
    // Already on the home page, just scroll to the section
    if (pathname === "/" && sectionRef.current) {
      scrollToSection(sectionRef.current);
      return;
    }
    // Otherwise go home and let the section scroll itself into view on mount
    pendingScrollRef.current = true;
    router.push("/", { scroll: false });
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export function HowItWorksSection({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { sectionRef, pendingScrollRef } = useHowItWorks();

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;
    scrollToSection(sectionRef.current);
  }, [sectionRef, pendingScrollRef]);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}

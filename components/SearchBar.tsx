"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { searchTeams, encodeSegment } from "@/lib/teams";
import type { Team } from "@/lib/teams";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Team[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    setError("");
    if (value.trim().length >= 1) {
      const results = searchTeams(value);
      setSuggestions(results);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }

  function navigate(teamName: string) {
    setShowDropdown(false);
    router.push(`/team/${encodeSegment(teamName)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter your team name.");
      return;
    }
    if (suggestions.length === 0) {
      setError("No team found with that name. Please check the spelling.");
      return;
    }
    // If exactly one match → go directly
    if (suggestions.length === 1) {
      navigate(suggestions[0].name);
      return;
    }
    // Multiple partial matches → show dropdown, prompt user to pick
    setShowDropdown(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 
            bg-white/5 backdrop-blur-sm transition-all duration-200
            ${error
              ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
              : "border-white/10 focus-within:border-pink-500/60 focus-within:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
            }`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Search your team name"
            aria-label="Search team name"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-white placeholder-white/30 text-base outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
              bg-linear-to-br from-pink-500 to-cyan-400
              hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400 px-1">
          {error}
        </p>
      )}

      {/* Suggestions dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Team suggestions"
          className="absolute z-50 top-full mt-2 w-full rounded-xl border border-white/10
            bg-[#0f0f1a]/95 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {suggestions.map((team) => (
            <li key={team.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => navigate(team.name)}
                className="w-full text-left px-4 py-3 flex items-center justify-between
                  hover:bg-white/5 transition-colors duration-150 group cursor-pointer"
              >
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {team.name}
                </span>
                <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                  {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results hint */}
      {showDropdown && query.trim().length >= 1 && suggestions.length === 0 && (
        <div className="absolute z-50 top-full mt-2 w-full rounded-xl border border-white/10
          bg-[#0f0f1a]/95 backdrop-blur-md shadow-2xl px-4 py-4 text-sm text-white/40 text-center">
          No team found matching &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none" stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

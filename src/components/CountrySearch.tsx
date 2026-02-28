import { useState, useRef, useEffect } from "react";
import { ALL_COUNTRIES } from "../data/allCountries";
import "./CountrySearch.css";

interface CountrySearchProps {
  visitedCountries: string[];
  onToggle: (name: string) => void;
}

export default function CountrySearch({
  visitedCountries,
  onToggle,
}: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visited = new Set(visitedCountries);
  const filtered = query.trim()
    ? ALL_COUNTRIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="country-search" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search &amp; add country..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.trim() && setOpen(true)}
        className="search-input"
      />
      {open && filtered.length > 0 && (
        <ul className="search-results">
          {filtered.map((name) => (
            <li key={name}>
              <button
                className={visited.has(name) ? "visited" : ""}
                onClick={() => {
                  onToggle(name);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <span>{name}</span>
                <span className="search-tag">
                  {visited.has(name) ? "Remove" : "Add"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

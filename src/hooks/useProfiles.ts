import { useState, useEffect, useCallback } from "react";

export interface Profile {
  name: string;
  countries: string[];
}

interface ProfilesData {
  profiles: Profile[];
}

const LS_KEY = "travelmap_drafts_v2";

function loadDrafts(): Record<string, string[]> {
  try {
    localStorage.removeItem("travelmap_drafts");
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt data */
  }
  return {};
}

function saveDrafts(drafts: Record<string, string[]>) {
  localStorage.setItem(LS_KEY, JSON.stringify(drafts));
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/profiles.json`)
      .then((res) => res.json())
      .then((data: ProfilesData) => {
        const drafts = loadDrafts();
        const merged = data.profiles.map((p) => ({
          ...p,
          countries: drafts[p.name] ?? p.countries,
        }));
        setProfiles(merged);
        setLoading(false);
      })
      .catch(() => {
        setProfiles([{ name: "Default", countries: [] }]);
        setLoading(false);
      });
  }, []);

  const toggleCountry = useCallback(
    (countryCode: string) => {
      setProfiles((prev) => {
        const updated = prev.map((p, i) => {
          if (i !== activeIndex) return p;
          const has = p.countries.includes(countryCode);
          return {
            ...p,
            countries: has
              ? p.countries.filter((c) => c !== countryCode)
              : [...p.countries, countryCode],
          };
        });
        const drafts = loadDrafts();
        drafts[updated[activeIndex].name] = updated[activeIndex].countries;
        saveDrafts(drafts);
        return updated;
      });
    },
    [activeIndex]
  );

  const removeCountry = useCallback(
    (countryCode: string) => {
      setProfiles((prev) => {
        const updated = prev.map((p, i) => {
          if (i !== activeIndex) return p;
          return {
            ...p,
            countries: p.countries.filter((c) => c !== countryCode),
          };
        });
        const drafts = loadDrafts();
        drafts[updated[activeIndex].name] = updated[activeIndex].countries;
        saveDrafts(drafts);
        return updated;
      });
    },
    [activeIndex]
  );

  const exportJSON = useCallback(() => {
    const data: ProfilesData = { profiles };
    return JSON.stringify(data, null, 2);
  }, [profiles]);

  const activeProfile = profiles[activeIndex] ?? { name: "", countries: [] };

  return {
    profiles,
    activeIndex,
    setActiveIndex,
    activeProfile,
    toggleCountry,
    removeCountry,
    exportJSON,
    loading,
  };
}

import { useState, useEffect, useCallback } from "react";
import { onValue, set } from "firebase/database";
import { profilesRef } from "../lib/firebase";

export interface Profile {
  name: string;
  countries: string[];
}

const LS_KEY = "travelmap_data_v3";

function saveLocal(profiles: Profile[]) {
  localStorage.setItem(LS_KEY, JSON.stringify({ profiles }));
}

function loadLocal(): Profile[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.profiles?.length) return data.profiles;
    }
  } catch {
    /* ignore */
  }
  return null;
}

const DEFAULT_PROFILES: Profile[] = [
  { name: "Yiming", countries: [] },
  { name: "Ruoling", countries: [] },
];

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = loadLocal();
    if (local) {
      setProfiles(local);
      setLoading(false);
    }

    const unsubscribe = onValue(
      profilesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          const remote: Profile[] = data.map(
            (p: { name?: string; countries?: string[] }) => ({
              name: p.name ?? "Unknown",
              countries: Array.isArray(p.countries) ? p.countries : [],
            })
          );
          setProfiles(remote);
          saveLocal(remote);
        } else if (!local) {
          setProfiles(DEFAULT_PROFILES);
          set(profilesRef, DEFAULT_PROFILES);
        }
        setLoading(false);
      },
      () => {
        if (!local) setProfiles(DEFAULT_PROFILES);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const writeToFirebase = useCallback((updated: Profile[]) => {
    saveLocal(updated);
    set(profilesRef, updated).catch(() => {
      console.error("Failed to write to Firebase");
    });
  }, []);

  const toggleCountry = useCallback(
    (countryName: string) => {
      setProfiles((prev) => {
        const updated = prev.map((p, i) => {
          if (i !== activeIndex) return p;
          const has = p.countries.includes(countryName);
          return {
            ...p,
            countries: has
              ? p.countries.filter((c) => c !== countryName)
              : [...p.countries, countryName],
          };
        });
        writeToFirebase(updated);
        return updated;
      });
    },
    [activeIndex, writeToFirebase]
  );

  const removeCountry = useCallback(
    (countryName: string) => {
      setProfiles((prev) => {
        const updated = prev.map((p, i) => {
          if (i !== activeIndex) return p;
          return {
            ...p,
            countries: p.countries.filter((c) => c !== countryName),
          };
        });
        writeToFirebase(updated);
        return updated;
      });
    },
    [activeIndex, writeToFirebase]
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify({ profiles }, null, 2);
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

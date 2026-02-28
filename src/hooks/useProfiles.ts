import { useState, useEffect, useCallback, useRef } from "react";
import { getToken, commitProfiles } from "../lib/githubSync";

export interface Profile {
  name: string;
  countries: string[];
}

interface ProfilesData {
  profiles: Profile[];
}

const LS_KEY = "travelmap_data_v3";

function saveLocal(profiles: Profile[]) {
  localStorage.setItem(LS_KEY, JSON.stringify({ profiles }));
}

function loadLocal(): Profile[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data: ProfilesData = JSON.parse(raw);
      if (data.profiles?.length) return data.profiles;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/profiles.json`)
      .then((res) => res.json())
      .then((remote: ProfilesData) => {
        const local = loadLocal();
        if (local) {
          const merged = remote.profiles.map((rp) => {
            const lp = local.find((l) => l.name === rp.name);
            if (!lp) return rp;
            const combined = Array.from(
              new Set([...rp.countries, ...lp.countries])
            );
            return { ...rp, countries: combined };
          });
          setProfiles(merged);
          saveLocal(merged);
        } else {
          setProfiles(remote.profiles);
          saveLocal(remote.profiles);
        }
        setLoading(false);
      })
      .catch(() => {
        const local = loadLocal();
        setProfiles(
          local ?? [
            { name: "Yiming", countries: [] },
            { name: "Ruoling", countries: [] },
          ]
        );
        setLoading(false);
      });
  }, []);

  const syncToGitHub = useCallback((updated: Profile[]) => {
    const token = getToken();
    if (!token) return;

    if (syncTimeout.current !== null) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      setSyncStatus("syncing");
      const json = JSON.stringify({ profiles: updated }, null, 2) + "\n";
      const ok = await commitProfiles(json, token);
      setSyncStatus(ok ? "success" : "error");
      setTimeout(() => setSyncStatus("idle"), 2500);
    }, 1000);
  }, []);

  const persist = useCallback(
    (updated: Profile[]) => {
      saveLocal(updated);
      syncToGitHub(updated);
    },
    [syncToGitHub]
  );

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
        persist(updated);
        return updated;
      });
    },
    [activeIndex, persist]
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
        persist(updated);
        return updated;
      });
    },
    [activeIndex, persist]
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
    syncStatus,
    loading,
  };
}

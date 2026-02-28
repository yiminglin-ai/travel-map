import { useState } from "react";
import ProfileTabs from "./components/ProfileTabs";
import Sidebar from "./components/Sidebar";
import WorldMap from "./components/WorldMap";
import { useProfiles } from "./hooks/useProfiles";

export default function App() {
  const {
    profiles,
    activeIndex,
    setActiveIndex,
    activeProfile,
    toggleCountry,
    removeCountry,
    exportJSON,
    loading,
  } = useProfiles();

  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(
    null
  );

  if (loading) {
    return <div className="app-loading">Loading travel map...</div>;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="title-wrap">
          <h1>Family Travel Map</h1>
          <p>Click countries to mark where each family member has traveled.</p>
        </div>
        <ProfileTabs
          profiles={profiles}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </header>

      <main className="app-main">
        <WorldMap
          visitedCountries={activeProfile.countries}
          onToggleCountry={toggleCountry}
          highlightedCountry={highlightedCountry}
        />
        <Sidebar
          profileName={activeProfile.name}
          countries={activeProfile.countries}
          onRemoveCountry={removeCountry}
          onToggleCountry={toggleCountry}
          onHighlight={setHighlightedCountry}
          exportJSON={exportJSON}
        />
      </main>
    </div>
  );
}

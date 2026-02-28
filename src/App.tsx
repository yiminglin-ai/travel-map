import { useState } from "react";
import ProfileTabs from "./components/ProfileTabs";
import Sidebar from "./components/Sidebar";
import WorldMap from "./components/WorldMap";
import SettingsModal from "./components/SettingsModal";
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
    syncStatus,
    loading,
  } = useProfiles();

  const [settingsOpen, setSettingsOpen] = useState(false);

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
        <div className="header-actions">
          <ProfileTabs
            profiles={profiles}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
          <button
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            title="Sync settings"
          >
            &#9881;
          </button>
        </div>
      </header>

      <main className="app-main">
        <WorldMap
          visitedCountries={activeProfile.countries}
          onToggleCountry={toggleCountry}
        />
        <Sidebar
          profileName={activeProfile.name}
          countries={activeProfile.countries}
          onRemoveCountry={removeCountry}
          exportJSON={exportJSON}
        />
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        syncStatus={syncStatus}
      />
    </div>
  );
}

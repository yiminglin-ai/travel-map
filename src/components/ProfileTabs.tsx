import type { Profile } from "../hooks/useProfiles";
import "./ProfileTabs.css";

interface ProfileTabsProps {
  profiles: Profile[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ProfileTabs({
  profiles,
  activeIndex,
  onSelect,
}: ProfileTabsProps) {
  return (
    <div className="profile-tabs">
      {profiles.map((profile, i) => (
        <button
          key={profile.name}
          className={`profile-tab ${i === activeIndex ? "active" : ""}`}
          onClick={() => onSelect(i)}
        >
          <span className="profile-name">{profile.name}</span>
          <span className="profile-count">{profile.countries.length}</span>
        </button>
      ))}
    </div>
  );
}

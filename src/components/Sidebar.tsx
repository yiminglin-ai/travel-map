import CountrySearch from "./CountrySearch";
import ExportButton from "./ExportButton";
import "./Sidebar.css";

const TOTAL_COUNTRIES = 255;

interface SidebarProps {
  profileName: string;
  countries: string[];
  onRemoveCountry: (countryCode: string) => void;
  onToggleCountry: (countryCode: string) => void;
  onHighlight: (countryName: string | null) => void;
  exportJSON: () => string;
}

function sortCountryCodes(codes: string[]) {
  return [...codes].sort((a, b) => a.localeCompare(b));
}

export default function Sidebar({
  profileName,
  countries,
  onRemoveCountry,
  onToggleCountry,
  onHighlight,
  exportJSON,
}: SidebarProps) {
  const visited = countries.length;
  const percentage = ((visited / TOTAL_COUNTRIES) * 100).toFixed(1);
  const sortedCountries = sortCountryCodes(countries);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{profileName}</h2>
        <p>
          {visited} of {TOTAL_COUNTRIES} visited ({percentage}%)
        </p>
      </div>

      <CountrySearch
        visitedCountries={countries}
        onToggle={onToggleCountry}
      />

      <ExportButton exportJSON={exportJSON} />

      <div className="country-list">
        {sortedCountries.length === 0 ? (
          <p className="empty-text">No countries selected yet.</p>
        ) : (
          sortedCountries.map((name) => (
            <div
              className="country-item"
              key={name}
              onMouseEnter={() => onHighlight(name)}
              onMouseLeave={() => onHighlight(null)}
              onTouchStart={() => onHighlight(name)}
              onTouchEnd={() => onHighlight(null)}
            >
              <span>{name}</span>
              <button onClick={() => onRemoveCountry(name)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

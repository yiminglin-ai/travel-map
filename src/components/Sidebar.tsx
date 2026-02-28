import ExportButton from "./ExportButton";
import "./Sidebar.css";

const TOTAL_COUNTRIES = 195;

interface SidebarProps {
  profileName: string;
  countries: string[];
  onRemoveCountry: (countryCode: string) => void;
  exportJSON: () => string;
}

function sortCountryCodes(codes: string[]) {
  return [...codes].sort((a, b) => a.localeCompare(b));
}

export default function Sidebar({
  profileName,
  countries,
  onRemoveCountry,
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

      <ExportButton exportJSON={exportJSON} />

      <div className="country-list">
        {sortedCountries.length === 0 ? (
          <p className="empty-text">No countries selected yet.</p>
        ) : (
          sortedCountries.map((code) => (
            <div className="country-item" key={code}>
              <span>{code}</span>
              <button onClick={() => onRemoveCountry(code)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { MouseEvent } from "react";
import { Tooltip, useTooltip } from "./Tooltip";
import "./WorldMap.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json";

interface WorldMapProps {
  visitedCountries: string[];
  onToggleCountry: (code: string) => void;
}

export default function WorldMap({
  visitedCountries,
  onToggleCountry,
}: WorldMapProps) {
  const { tooltip, show, hide, move } = useTooltip();

  const visited = new Set(visitedCountries);

  return (
    <div className="world-map-container">
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        width={800}
        height={400}
        className="world-map"
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isVisited = visited.has(name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (name) onToggleCountry(name);
                    }}
                    onMouseEnter={(e) => {
                      show(name ?? "Unknown", e.clientX, e.clientY);
                    }}
                    onMouseMove={(e: MouseEvent) => {
                      move(e.clientX, e.clientY);
                    }}
                    onMouseLeave={hide}
                    className={`geography ${isVisited ? "visited" : ""}`}
                    style={{
                      default: {
                        fill: isVisited ? "#10b981" : "#334155",
                        stroke: "#94a3b8",
                        strokeWidth: 0.4,
                        outline: "none",
                      },
                      hover: {
                        fill: isVisited ? "#34d399" : "#475569",
                        stroke: "#cbd5e1",
                        strokeWidth: 0.6,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: isVisited ? "#059669" : "#64748b",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip {...tooltip} />
    </div>
  );
}

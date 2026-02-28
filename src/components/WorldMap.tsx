import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { MouseEvent } from "react";
import { Tooltip, useTooltip } from "./Tooltip";
import "./WorldMap.css";

const GEO_URL = `${import.meta.env.BASE_URL}data/countries-50m.json`;

interface WorldMapProps {
  visitedCountries: string[];
  onToggleCountry: (code: string) => void;
  highlightedCountry: string | null;
}

function getFill(
  isVisited: boolean,
  isHighlighted: boolean
): string {
  if (isHighlighted) return isVisited ? "#fbbf24" : "#fbbf24";
  return isVisited ? "#10b981" : "#334155";
}

function getHoverFill(isVisited: boolean): string {
  return isVisited ? "#34d399" : "#475569";
}

export default function WorldMap({
  visitedCountries,
  onToggleCountry,
  highlightedCountry,
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
                const isHighlighted = name === highlightedCountry;
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
                    style={{
                      default: {
                        fill: getFill(isVisited, isHighlighted),
                        stroke: isHighlighted ? "#fbbf24" : "#94a3b8",
                        strokeWidth: isHighlighted ? 1.2 : 0.4,
                        outline: "none",
                        transition: "fill 0.2s ease, stroke 0.2s ease",
                      },
                      hover: {
                        fill: getHoverFill(isVisited),
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

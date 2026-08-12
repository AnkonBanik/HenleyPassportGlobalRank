import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { EnrichedPassportRecord } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  records: EnrichedPassportRecord[];
  onSelectCountry?: (countryName: string) => void;
}

export function WorldMap({ records, onSelectCountry }: WorldMapProps) {
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  });
  const [hoveredCountry, setHoveredCountry] = useState<EnrichedPassportRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const recordMap = new Map<string, EnrichedPassportRecord>();
  records.forEach((r) => {
    recordMap.set(r.country.toLowerCase(), r);
    recordMap.set(r.iso3.toLowerCase(), r);
  });

  const getColorForRank = (rank: number | undefined) => {
    if (rank === undefined) return '#94a3b8'; // slate-400 fallback
    if (rank <= 10) return '#d97706'; // gold-600
    if (rank <= 30) return '#f59e0b'; // gold-500
    if (rank <= 60) return '#0c96eb'; // brand-500
    if (rank <= 90) return '#64748b'; // slate-500
    return '#e11d48'; // rose-600
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.3 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.3 }));
  };

  const handleResetZoom = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden transition-colors duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Global Passport Mobility World Map</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Interactive Choropleth map. Hover over countries for rank and visa-free access metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-200 dark:hover:bg-slate-900 rounded transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-200 dark:hover:bg-slate-900 rounded transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-200 dark:hover:bg-slate-900 rounded transition-all"
            title="Reset Map"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas */}
      <div className="h-[220px] sm:h-[320px] lg:h-[420px] w-full bg-gray-100/60 dark:bg-slate-950/60 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800/60 relative">
        <ComposableMap projectionConfig={{ scale: 145 }} className="w-full h-full">
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={(pos) => setPosition(pos)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const rec =
                    recordMap.get(countryName.toLowerCase()) ||
                    recordMap.get((geo.properties.ISO_A3 || '').toLowerCase());

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt) => {
                        if (rec) {
                          setHoveredCountry(rec);
                          setTooltipPos({ x: evt.clientX, y: evt.clientY });
                        }
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => rec && onSelectCountry && onSelectCountry(rec.country)}
                      style={{
                        default: {
                          fill: getColorForRank(rec?.rank),
                          stroke: '#cbd5e1',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'all 250ms',
                        },
                        hover: {
                          fill: '#fbbf24',
                          stroke: '#ffffff',
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: '#d97706',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-2.5 rounded-lg text-[10px] space-y-1 shadow-md">
          <span className="font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 block mb-1">Rank Legend</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Rank 1 - 10 (Tier 1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Rank 11 - 30 (Tier 2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Rank 31 - 60 (Tier 3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Rank 61 - 90 (Tier 4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Rank 91+ (Tier 5)</span>
          </div>
        </div>
      </div>

      {/* Floating Rich Tooltip */}
      {hoveredCountry && (
        <div
          className="fixed pointer-events-none z-50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl p-3 rounded-xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y - 45}px`,
          }}
        >
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-slate-100 text-sm">
            <span>{hoveredCountry.flagEmoji}</span>
            <span>{hoveredCountry.country}</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-400 font-mono">({hoveredCountry.iso3})</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 text-gray-700 dark:text-slate-300">
            <span>Rank Position:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">#{hoveredCountry.rank}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-gray-700 dark:text-slate-300">
            <span>Visa-Free Destinations:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">{hoveredCountry.accessCount} countries</span>
          </div>
          <div className="text-[10px] text-gray-400 dark:text-slate-400 pt-1 border-t border-gray-200 dark:border-slate-800">
            Capital: {hoveredCountry.capital} • {hoveredCountry.continent}
          </div>
        </div>
      )}
    </div>
  );
}

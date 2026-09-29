import React, { useState, useRef, useEffect } from 'react';
import { useGIS } from '../../services/gisContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Ruler, 
  Compass, 
  Crosshair, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building as BuildingIcon, 
  Info,
  X,
  ExternalLink
} from 'lucide-react';
import { MAP_CENTER_LNG, MAP_CENTER_LAT } from '../../data/mockData';

interface WebGISMapProps {
  heightClass?: string;
  showLayerPanel?: boolean;
  onSelectParcel?: (parcelId: string) => void;
  highlightParcelId?: string;
  isSplitView?: boolean;
  splitDatasetA?: string;
  splitDatasetB?: string;
}

export const WebGISMap: React.FC<WebGISMapProps> = ({
  heightClass = 'h-[620px]',
  showLayerPanel = true,
  onSelectParcel,
  highlightParcelId,
  isSplitView = false,
  splitDatasetA = 'Revenue Cadastral Layer',
  splitDatasetB = '2026 Drone ORI Footprints'
}) => {
  const { 
    parcels, 
    buildings, 
    conflicts, 
    gnssPoints, 
    utilities, 
    changeEvents,
    mapLayers, 
    toggleMapLayer, 
    basemapMode, 
    setBasemapMode,
    selectedParcelId,
    setSelectedParcelId,
    selectedConflictId,
    setSelectedConflictId,
    navigateTo
  } = useGIS();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ lng: number; lat: number; utmX: number; utmY: number }>({
    lng: MAP_CENTER_LNG,
    lat: MAP_CENTER_LAT,
    utmX: 379240,
    utmY: 2047890
  });
  const [measureMode, setMeasureMode] = useState<'off' | 'distance' | 'area'>('off');
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(showLayerPanel);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitSliderPos, setSplitSliderPos] = useState(50); // percentage for split view
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const activeParcel = parcels.find(p => p.id === (highlightParcelId || selectedParcelId)) || parcels[0];
  const activeConflict = conflicts.find(c => c.id === selectedConflictId);

  // SVG coordinate transformation helpers
  // Canvas internal bounds: width 1200, height 800
  const SVG_WIDTH = 1200;
  const SVG_HEIGHT = 800;

  const projectToSvg = (lng: number, lat: number) => {
    // Relative to MAP_CENTER_LNG, MAP_CENTER_LAT
    const scale = 22000;
    const x = SVG_WIDTH / 2 + (lng - MAP_CENTER_LNG) * scale;
    const y = SVG_HEIGHT / 2 - (lat - MAP_CENTER_LAT) * scale * 1.05;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (measureMode !== 'off') {
      const rect = mapContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clickX = (e.clientX - rect.left - pan.x) / zoom;
      const clickY = (e.clientY - rect.top - pan.y) / zoom;
      setMeasurePoints(prev => [...prev, { x: clickX, y: clickY }]);
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const relX = (e.clientX - rect.left - pan.x) / zoom;
      const relY = (e.clientY - rect.top - pan.y) / zoom;
      const scale = 22000;
      const lng = MAP_CENTER_LNG + (relX - SVG_WIDTH / 2) / scale;
      const lat = MAP_CENTER_LAT - (relY - SVG_HEIGHT / 2) / (scale * 1.05);
      const utmX = Math.round(379000 + (lng - 73.8) * 111000);
      const utmY = Math.round(2047000 + (lat - 18.5) * 110000);
      setCursorCoords({ lng, lat, utmX, utmY });
    }

    if (isDragging && measureMode === 'off') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(3.5, Math.max(0.6, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      mapContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Convert parcel polygon to SVG path
  const getParcelPath = (coords: [number, number][]) => {
    if (!coords || coords.length === 0) return '';
    return coords.map((pt, i) => {
      const p = projectToSvg(pt[0], pt[1]);
      return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ') + ' Z';
  };

  return (
    <div 
      ref={mapContainerRef}
      className={`relative w-full ${heightClass} bg-slate-950 overflow-hidden select-none border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: measureMode !== 'off' ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
    >
      {/* MAP BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: SVG_WIDTH,
          height: SVG_HEIGHT
        }}
      >
        {/* Basemap textures */}
        {basemapMode === 'satellite' ? (
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src="/src/assets/images/bhusync_drone_ortho_1790678143433.jpg" 
              alt="High-Res Drone Orthomosaic" 
              className="w-full h-full object-cover opacity-85 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Dark contrast grid overlay */}
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>
        ) : basemapMode === 'cadastral' ? (
          <div className="absolute inset-0 bg-[#0d1b2a] bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px]">
            {/* Grid coordinates blueprint */}
            <div className="absolute inset-0 border border-blue-900/40" />
          </div>
        ) : (
          /* Vector Topographic mode */
          <div className="absolute inset-0 bg-[#f8fafc] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]">
            {/* Topographic contour simulation lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <path d="M 0,200 Q 300,180 600,240 T 1200,210" fill="none" stroke="#94a3b8" strokeWidth="0.75" />
              <path d="M 0,400 Q 400,380 700,430 T 1200,410" fill="none" stroke="#94a3b8" strokeWidth="0.75" />
              <path d="M 0,600 Q 350,620 800,580 T 1200,620" fill="none" stroke="#94a3b8" strokeWidth="0.75" />
            </svg>
          </div>
        )}

        {/* VECTOR GIS MAP SVG CANVAS */}
        <svg 
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            {/* Patterns and markers */}
            <pattern id="conflictHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.7" />
            </pattern>
            <pattern id="underConstructionHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />
            </pattern>
            {/* Drop shadow filter */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* LAYER: ROADS */}
          {mapLayers.roads && (
            <g className="roads-layer">
              {/* Arterial Road 1 */}
              <line x1="120" y1="410" x2="1080" y2="410" stroke="#e2e8f0" strokeWidth="22" strokeLinecap="round" />
              <line x1="120" y1="410" x2="1080" y2="410" stroke="#64748b" strokeWidth="16" strokeLinecap="round" />
              <line x1="120" y1="410" x2="1080" y2="410" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 8" />

              {/* Cross Avenue */}
              <line x1="590" y1="80" x2="590" y2="720" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
              <line x1="590" y1="80" x2="590" y2="720" stroke="#64748b" strokeWidth="14" strokeLinecap="round" />
              <line x1="590" y1="80" x2="590" y2="720" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

              {/* Sector Streets */}
              <line x1="120" y1="230" x2="1080" y2="230" stroke="#94a3b8" strokeWidth="8" />
              <line x1="120" y1="580" x2="1080" y2="580" stroke="#94a3b8" strokeWidth="8" />
              <line x1="360" y1="80" x2="360" y2="720" stroke="#94a3b8" strokeWidth="7" />
              <line x1="820" y1="80" x2="820" y2="720" stroke="#94a3b8" strokeWidth="7" />
            </g>
          )}

          {/* LAYER: UTILITY NETWORKS */}
          {mapLayers.utilities && (
            <g className="utilities-layer" opacity="0.85">
              {utilities.map(u => {
                const pts = u.coordinates.map(c => projectToSvg(c[0], c[1]));
                const pathStr = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
                const strokeColor = u.type === 'Water Pipeline' ? '#0284c7' : u.type === 'Electric Grid' ? '#d97706' : '#7c3aed';
                return (
                  <g key={u.id}>
                    <path d={pathStr} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeDasharray="5 3" />
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER: PARCELS (CADASTRAL BOUNDARIES) */}
          {mapLayers.parcels && (
            <g className="parcels-layer">
              {parcels.map(p => {
                const path = getParcelPath(p.coordinates);
                const isSelected = p.id === (highlightParcelId || selectedParcelId);
                const hasConflict = p.verificationStatus === 'Conflict Detected';
                const isNeedsReview = p.verificationStatus === 'Pending Verification';

                let fillColor = basemapMode === 'satellite' ? 'rgba(30, 41, 59, 0.35)' : 'rgba(241, 245, 249, 0.7)';
                let strokeColor = '#3b82f6';
                let strokeWidth = 1;

                if (hasConflict) {
                  fillColor = 'rgba(239, 68, 68, 0.25)';
                  strokeColor = '#dc2626';
                  strokeWidth = 2;
                } else if (isNeedsReview) {
                  fillColor = 'rgba(245, 158, 11, 0.2)';
                  strokeColor = '#d97706';
                  strokeWidth = 1.5;
                } else if (p.verificationStatus === 'Verified') {
                  fillColor = basemapMode === 'satellite' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(236, 253, 245, 0.6)';
                  strokeColor = '#059669';
                }

                if (isSelected) {
                  strokeColor = '#2563eb';
                  strokeWidth = 3;
                }

                const centroid = projectToSvg(p.centroid[0], p.centroid[1]);

                return (
                  <g 
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedParcelId(p.id);
                      if (hasConflict) {
                        const conf = conflicts.find(c => c.parcelId === p.id);
                        if (conf) setSelectedConflictId(conf.id);
                      }
                      onSelectParcel?.(p.id);
                    }}
                    className="cursor-pointer transition-all duration-150 hover:opacity-90"
                  >
                    <path 
                      d={path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    {/* Survey label */}
                    {zoom >= 0.8 && (
                      <text 
                        x={centroid.x} 
                        y={centroid.y - 4}
                        textAnchor="middle" 
                        fontSize="8.5"
                        fontWeight="600"
                        fill={basemapMode === 'satellite' || basemapMode === 'cadastral' ? '#f8fafc' : '#1e293b'}
                        className="pointer-events-none font-mono"
                      >
                        {p.surveyNumber}
                      </text>
                    )}
                    {zoom >= 1.2 && (
                      <text 
                        x={centroid.x} 
                        y={centroid.y + 7}
                        textAnchor="middle" 
                        fontSize="7"
                        fill={basemapMode === 'satellite' || basemapMode === 'cadastral' ? '#94a3b8' : '#64748b'}
                        className="pointer-events-none font-mono"
                      >
                        {p.areaSqm} m²
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER: BUILDINGS (AI DETECTED FOOTPRINTS) */}
          {mapLayers.buildings && (
            <g className="buildings-layer">
              {buildings.map(b => {
                const path = getParcelPath(b.coordinates);
                const centroid = projectToSvg(b.centroid[0], b.centroid[1]);
                const isUnauthorized = b.status === 'Unauthorized';
                const fillColor = isUnauthorized 
                  ? '#ef4444' 
                  : b.status === 'Newly Detected' 
                  ? '#3b82f6' 
                  : '#475569';

                return (
                  <g key={b.id} className="transition-transform hover:scale-105">
                    {/* Shadow offset for 3D elevation feeling */}
                    <path 
                      d={path}
                      fill="rgba(0,0,0,0.3)"
                      transform="translate(1.5, 2)"
                    />
                    <path 
                      d={path}
                      fill={fillColor}
                      fillOpacity={0.88}
                      stroke={isUnauthorized ? '#b91c1c' : '#1e293b'}
                      strokeWidth="1.2"
                    />
                    {zoom >= 1.4 && (
                      <text 
                        x={centroid.x} 
                        y={centroid.y}
                        textAnchor="middle" 
                        fontSize="6.5"
                        fill="#ffffff"
                        fontWeight="bold"
                        className="pointer-events-none font-mono"
                      >
                        {b.id}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER: CONFLICTS HIGHLIGHT */}
          {mapLayers.conflicts && (
            <g className="conflicts-overlay">
              {conflicts.filter(c => c.status !== 'Resolved').map(c => {
                const targetParcel = parcels.find(p => p.id === c.parcelId);
                if (!targetParcel) return null;
                const centroid = projectToSvg(targetParcel.centroid[0], targetParcel.centroid[1]);
                return (
                  <g 
                    key={c.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConflictId(c.id);
                      setSelectedParcelId(c.parcelId);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Pulsing conflict ring */}
                    <circle 
                      cx={centroid.x} 
                      cy={centroid.y} 
                      r="18" 
                      fill="none" 
                      stroke="#dc2626" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 3"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: `${centroid.x}px ${centroid.y}px` }}
                    />
                    <circle cx={centroid.x} cy={centroid.y} r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text 
                      x={centroid.x} 
                      y={centroid.y + 3} 
                      textAnchor="middle" 
                      fontSize="8" 
                      fill="#ffffff" 
                      fontWeight="bold"
                    >
                      !
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER: GNSS BENCHMARKS */}
          {mapLayers.gnss && (
            <g className="gnss-layer">
              {gnssPoints.map(g => {
                const pt = projectToSvg(g.coordinates[0], g.coordinates[1]);
                return (
                  <g key={g.id} className="cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                    {zoom >= 1.2 && (
                      <text x={pt.x + 8} y={pt.y + 3} fontSize="7" fill="#047857" fontWeight="bold" className="font-mono">
                        {g.id} ({g.accuracyCm}cm)
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* LAYER: DETECTED CHANGES */}
          {mapLayers.changes && (
            <g className="changes-layer">
              {changeEvents.map(chg => {
                const pt = projectToSvg(chg.location[0], chg.location[1]);
                return (
                  <g key={chg.id}>
                    <polygon 
                      points={`${pt.x},${pt.y - 10} ${pt.x + 8},${pt.y + 5} ${pt.x - 8},${pt.y + 5}`}
                      fill="#8b5cf6"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* MEASUREMENT TOOL PATH */}
          {measureMode !== 'off' && measurePoints.length > 0 && (
            <g className="measurement-overlay">
              {measurePoints.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              ))}
              {measurePoints.length > 1 && (
                <polyline 
                  points={measurePoints.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill={measureMode === 'area' ? 'rgba(59, 130, 246, 0.25)' : 'none'}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              )}
            </g>
          )}
        </svg>

        {/* SPLIT MAP SLIDER (IF SPLIT VIEW ENABLED) */}
        {isSplitView && (
          <div 
            className="absolute top-0 bottom-0 z-20 pointer-events-auto cursor-ew-resize flex items-center justify-center"
            style={{ left: `${splitSliderPos}%` }}
          >
            <div className="w-0.5 h-full bg-white shadow-lg relative">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-slate-800 rounded-full p-1.5 shadow-md border border-slate-300">
                <Crosshair className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING TOP-LEFT: BASEMAP SWITCHER & METRICS */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <button
          onClick={() => setBasemapMode('vector')}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            basemapMode === 'vector' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Vector
        </button>
        <button
          onClick={() => setBasemapMode('satellite')}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            basemapMode === 'satellite' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Drone ORI
        </button>
        <button
          onClick={() => setBasemapMode('cadastral')}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            basemapMode === 'cadastral' 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Cadastral
        </button>
      </div>

      {/* FLOATING TOP-RIGHT: MAP TOOLS & ZOOM */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => handleZoom(0.25)} 
            title="Zoom In"
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleZoom(-0.25)} 
            title="Zoom Out"
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
          <button 
            onClick={resetView} 
            title="Reset Extent"
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setLayerDrawerOpen(!layerDrawerOpen)} 
            title="Layer Control"
            className={`p-1.5 rounded transition-colors ${
              layerDrawerOpen ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              if (measureMode === 'off') setMeasureMode('distance');
              else if (measureMode === 'distance') setMeasureMode('area');
              else { setMeasureMode('off'); setMeasurePoints([]); }
            }} 
            title={`Measure Tool (${measureMode})`}
            className={`p-1.5 rounded transition-colors ${
              measureMode !== 'off' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleFullscreen} 
            title="Toggle Fullscreen"
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* LAYER TOGGLE DRAWER (POPOVER) */}
        {layerDrawerOpen && (
          <div className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-md p-3 border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200">GIS Layers Control</span>
              <span className="text-[10px] text-slate-500">EPSG:32643</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {[
                { key: 'parcels', label: 'Parcels (Cadastral)', count: parcels.length, color: 'bg-blue-500' },
                { key: 'buildings', label: 'Buildings (AI ORI)', count: buildings.length, color: 'bg-slate-700' },
                { key: 'roads', label: 'Road Network', count: 24, color: 'bg-amber-500' },
                { key: 'utilities', label: 'Utility Infrastructure', count: utilities.length, color: 'bg-cyan-500' },
                { key: 'revenue', label: 'Revenue Boundaries', count: '105', color: 'bg-emerald-500' },
                { key: 'municipal', label: 'Municipal Assessment', count: '98', color: 'bg-indigo-500' },
                { key: 'gnss', label: 'GNSS / CORS Points', count: gnssPoints.length, color: 'bg-green-600' },
                { key: 'conflicts', label: 'Spatial Conflicts', count: conflicts.length, color: 'bg-red-500' },
                { key: 'changes', label: 'Detected Changes', count: changeEvents.length, color: 'bg-purple-500' },
              ].map(item => (
                <label 
                  key={item.key}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={mapLayers[item.key as keyof typeof mapLayers]}
                      onChange={() => toggleMapLayer(item.key as keyof typeof mapLayers)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums">{item.count}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM-LEFT: COORDINATE INSPECTOR & SCALE BAR */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-sm">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>WGS 84: {cursorCoords.lat.toFixed(5)}° N, {cursorCoords.lng.toFixed(5)}° E</span>
        </div>
        <div className="hidden sm:block text-slate-400">|</div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-slate-500">UTM 43N:</span>
          <span>X: {cursorCoords.utmX}m E, Y: {cursorCoords.utmY}m N</span>
        </div>
        <div className="hidden md:block text-slate-400">|</div>
        <div className="hidden md:flex items-center gap-1">
          <span className="text-slate-500">Scale:</span>
          <div className="flex items-center gap-1">
            <div className="w-12 h-1 bg-slate-800 dark:bg-slate-200 border-x border-slate-600" />
            <span className="text-[10px]">50m</span>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM-RIGHT: SELECTED FEATURE DETAIL CARD */}
      {activeParcel && (
        <div className="absolute bottom-3 right-3 z-10 w-80 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xl text-xs space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{activeParcel.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  activeParcel.verificationStatus === 'Conflict Detected' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : activeParcel.verificationStatus === 'Pending Verification'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeParcel.verificationStatus}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">Survey No: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{activeParcel.surveyNumber}</span></p>
            </div>
            <button 
              onClick={() => setSelectedParcelId(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 py-1.5 border-y border-slate-100 dark:border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Owner</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{activeParcel.ownerName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Area</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{activeParcel.areaSqm} sq.m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Land Use</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{activeParcel.landType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">AI Confidence</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeParcel.confidenceScore}%</span>
            </div>
          </div>

          {/* Sources breakdown */}
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Sources:</span>
            <div className="flex items-center gap-1 font-mono">
              <span className={activeParcel.sources.revenue ? 'text-emerald-600 font-bold' : 'text-slate-300'}>REV</span>·
              <span className={activeParcel.sources.cadastral ? 'text-emerald-600 font-bold' : 'text-slate-300'}>CAD</span>·
              <span className={activeParcel.sources.municipal ? 'text-emerald-600 font-bold' : 'text-slate-300'}>MUN</span>·
              <span className={activeParcel.sources.gnss ? 'text-emerald-600 font-bold' : 'text-slate-300'}>GNSS</span>·
              <span className={activeParcel.sources.drone ? 'text-emerald-600 font-bold' : 'text-slate-300'}>DRONE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button 
              onClick={() => {
                navigateTo('parcels');
              }}
              className="flex-1 py-1.5 px-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded text-center font-medium hover:bg-slate-800 transition-colors"
            >
              Open Unified Record
            </button>
            {activeParcel.verificationStatus === 'Conflict Detected' && (
              <button 
                onClick={() => {
                  navigateTo('conflicts');
                }}
                className="py-1.5 px-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Resolve
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

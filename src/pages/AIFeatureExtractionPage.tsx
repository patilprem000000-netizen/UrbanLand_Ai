import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Cpu, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Play, 
  ArrowRight,
  Eye,
  Sliders
} from 'lucide-react';

export const AIFeatureExtractionPage: React.FC = () => {
  const { buildings, parcels, navigateTo, showToast, addAuditLog } = useGIS();

  const [selectedImage, setSelectedImage] = useState('Ward 4 Sector 18 Drone Orthomosaic (ORI 5cm GSD)');
  const [opts, setOpts] = useState({
    buildings: true,
    roads: true,
    boundaries: true,
    water: false,
    landuse: true,
    changes: true,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelinePhase, setPipelinePhase] = useState<string>('');
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('B-00500');

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setPipelineProgress(10);
    setPipelinePhase('Uploading imagery tile pyramids...');

    const phases = [
      { pct: 25, phase: 'Validating geometry and radiometric calibration...', delay: 400 },
      { pct: 45, phase: 'Detecting building rooftops & footprints (Mask R-CNN)...', delay: 900 },
      { pct: 65, phase: 'Matching spatial features across cadastral vector layer...', delay: 1400 },
      { pct: 75, phase: 'Checking topology invariants and edge snapping...', delay: 1900 },
      { pct: 88, phase: 'Detecting spatial conflicts & road buffer encroachments...', delay: 2400 },
      { pct: 95, phase: 'Calculating multi-factor confidence scoring matrices...', delay: 2900 },
      { pct: 100, phase: 'Completed. 1,284 structures & 1,923 boundaries extracted.', delay: 3400 },
    ];

    phases.forEach(({ pct, phase, delay }) => {
      setTimeout(() => {
        setPipelineProgress(pct);
        setPipelinePhase(phase);
        if (pct === 100) {
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          addAuditLog('AI Feature Extraction', 'Ward 4 ORI Imagery', 'Success', 'Extracted 1,284 building footprints with 94.2% mean confidence');
          showToast('AI Feature Extraction completed successfully!');
        }
      }, delay);
    });
  };

  const activeBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              AI Feature Extraction & Photogrammetry
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Computer Vision Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extract building footprints, road alignments, and parcel boundaries from high-resolution drone orthomosaics and DSM.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing ({pipelineProgress}%)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Feature Extraction</span>
            </>
          )}
        </button>
      </div>

      {/* TOP CONTROLS & DETECTION CONFIGURATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Inference Target & Detection Classes
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Source Aerial Drone / Satellite Raster
              </label>
              <select
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Ward 4 Sector 18 Drone Orthomosaic (ORI 5cm GSD)">
                  Ward 4 Sector 18 Drone Orthomosaic (ORI 5cm GSD) — 482 MB GeoTIFF
                </option>
                <option value="Municipal Corporation Satellite 2024 Base">
                  Municipal Corporation Satellite 2024 Base — 310 MB GeoTIFF
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">
                Enabled AI Extraction Modules
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'buildings', label: 'Building Footprints' },
                  { key: 'roads', label: 'Road Segments' },
                  { key: 'boundaries', label: 'Parcel Boundaries' },
                  { key: 'water', label: 'Water Body Detection' },
                  { key: 'landuse', label: 'Land Use Classification' },
                  { key: 'changes', label: 'Change Detection' },
                ].map(item => (
                  <label 
                    key={item.key} 
                    className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={opts[item.key as keyof typeof opts]}
                      onChange={(e) => setOpts({ ...opts, [item.key]: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EXTRACTION METRICS SUMMARY (SECTION 15) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Extraction Metrics
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Model v2.4 (Fine-Tuned)</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-sans">Buildings Detected:</span>
              <span className="font-bold text-slate-900 dark:text-white">1,284</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-sans">Road Segments:</span>
              <span className="font-bold text-slate-900 dark:text-white">347</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-sans">Potential Boundary Lines:</span>
              <span className="font-bold text-slate-900 dark:text-white">1,923</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-sans">Mean Confidence Score:</span>
              <span className="font-bold text-emerald-600">94.2%</span>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[200px]">{pipelinePhase}</span>
                <span className="font-mono">{pipelineProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 16: BUILDING DETECTION SCREEN (SPLIT COMPARISON) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Building Footprint Extraction Screen
            </h3>
            <p className="text-xs text-slate-500">
              Compare input raw drone orthomosaic imagery against AI-segmented polygon vectors.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{buildings.length} Footprints Indexed</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Raw Drone Image with overlaid AI bounding boxes */}
          <div className="lg:col-span-8 relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 h-96">
            <img 
              src="/src/assets/images/bhusync_drone_ortho_1790678143433.jpg" 
              alt="Raw Drone Orthomosaic" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* SVG overlay of detected building polygons */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <rect x="25%" y="30%" width="12%" height="15%" fill="rgba(59, 130, 246, 0.4)" stroke="#2563eb" strokeWidth="2" />
              <rect x="42%" y="28%" width="14%" height="18%" fill="rgba(16, 185, 129, 0.4)" stroke="#059669" strokeWidth="2" />
              <rect x="60%" y="35%" width="10%" height="12%" fill="rgba(239, 68, 68, 0.5)" stroke="#dc2626" strokeWidth="2" />
              <rect x="35%" y="60%" width="16%" height="20%" fill="rgba(59, 130, 246, 0.4)" stroke="#2563eb" strokeWidth="2" />
              <rect x="65%" y="55%" width="15%" height="14%" fill="rgba(16, 185, 129, 0.4)" stroke="#059669" strokeWidth="2" />
            </svg>

            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded font-mono">
              Raw Drone Orthomosaic + AI Polygonal Overlay
            </div>
          </div>

          {/* Right: Detected Building Details Inspector */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Detected Building Attributes
            </span>

            {activeBuilding && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Building ID:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeBuilding.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Footprint Area:</span>
                  <span className="font-bold text-blue-600">{activeBuilding.areaSqm} sq.m</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Associated Parcel:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{activeBuilding.parcelId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Estimated Height:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activeBuilding.heightM?.toFixed(1)} m ({activeBuilding.floors} floors)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Detection Confidence:</span>
                  <span className="font-bold text-emerald-600">{activeBuilding.confidence}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                  <span className="text-slate-500 font-sans">Detection Source:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-sans">{activeBuilding.detectionSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Statutory Status:</span>
                  <span className={`font-sans font-semibold ${activeBuilding.status === 'Unauthorized' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {activeBuilding.status}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigateTo('buildings')}
              className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold text-center hover:bg-slate-800 transition-colors shadow-xs"
            >
              Open Complete Building Registry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

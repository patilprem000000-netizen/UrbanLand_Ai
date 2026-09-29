import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Compass, 
  BarChart3, 
  Check, 
  X, 
  FileSpreadsheet, 
  RefreshCw,
  Info
} from 'lucide-react';

export const CrossSourceValidationPage: React.FC = () => {
  const { crossSourceValidations, parcels, selectedParcelId, setSelectedParcelId, showToast, addAuditLog } = useGIS();

  const [selectedValidationIndex, setSelectedValidationIndex] = useState(0);
  const currentValidation = crossSourceValidations[selectedValidationIndex] || crossSourceValidations[0];

  // Interactive Confidence Weights Simulator
  const [geomWeight, setGeomWeight] = useState(30);
  const [locWeight, setLocWeight] = useState(20);
  const [areaWeight, setAreaWeight] = useState(20);
  const [attrWeight, setAttrWeight] = useState(15);
  const [relWeight, setRelWeight] = useState(15);

  const matchedParcel = parcels.find(p => p.id === currentValidation.parcelId) || parcels[0];

  // Dynamically calculate weighted confidence score
  const dynamicConfidence = Math.round(
    (matchedParcel.confidenceBreakdown.geometry * (geomWeight / 100)) +
    (matchedParcel.confidenceBreakdown.location * (locWeight / 100)) +
    (matchedParcel.confidenceBreakdown.area * (areaWeight / 100)) +
    (matchedParcel.confidenceBreakdown.attributes * (attrWeight / 100)) +
    (matchedParcel.confidenceBreakdown.sourceReliability * (relWeight / 100))
  );

  const handleApplyWeights = () => {
    showToast(`Recalibrated confidence matrix weights! Global parity score updated to ${dynamicConfidence}%.`);
    addAuditLog('Confidence Calibration', currentValidation.parcelId, 'Success', `Applied weights: Geom ${geomWeight}%, Loc ${locWeight}%, Area ${areaWeight}%`);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Cross-Source Multi-Layer Validation &amp; Confidence Scoring
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-2xl">
            Automated triangulation across 6 distinct departmental sources: Revenue 7/12, Cadastral Vector, Municipal Tax, 
            High-Resolution Drone ORI, CORS GNSS RTK benchmarks, and Utility corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs font-medium font-mono">
            6-Source Triangulation Active
          </span>
        </div>
      </div>

      {/* PARCEL SELECTOR BUTTONS */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-medium">Select Parcel Dossier:</span>
        {crossSourceValidations.map((val, idx) => (
          <button
            key={val.parcelId}
            onClick={() => {
              setSelectedValidationIndex(idx);
              setSelectedParcelId(val.parcelId);
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5 ${
              selectedValidationIndex === idx
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>{val.parcelId} (Survey {val.surveyNumber})</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              val.parityScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {val.parityScore}% Parity
            </span>
          </button>
        ))}
      </div>

      {/* 6-SOURCE TRIANGULATION MATRIX CARDS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              6-Source Authority Triangulation Matrix: {currentValidation.parcelId}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Survey No: {currentValidation.surveyNumber}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {currentValidation.sources.map((src, i) => (
            <div 
              key={i}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                src.status === 'Match'
                  ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {src.sourceName}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    src.status === 'Match'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Area:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{src.areaSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Record:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{src.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spatial Hash:</span>
                    <span className="font-mono text-[10px] text-slate-500">{src.boundaryHash}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Geodetic Anchor:</span>
                <span className="text-emerald-600 font-mono font-medium">EPSG:32643 Calibrated</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATTRIBUTE-BY-ATTRIBUTE PARITY VERIFICATION TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
            Attribute-by-Attribute Parity &amp; Discrepancy Breakdown
          </h2>
          <span className="text-xs text-slate-500">Automated Semantic Comparison</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Cadastral Attribute</th>
                <th className="py-2.5 px-3">Revenue 7/12 (Ref)</th>
                <th className="py-2.5 px-3">Municipal Assessment</th>
                <th className="py-2.5 px-3">Drone ORI Photogrammetry</th>
                <th className="py-2.5 px-3">CORS RTK Rover Survey</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentValidation.parityChecks.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{row.attribute}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{row.revenueVal}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{row.municipalVal}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{row.droneVal}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{row.gnssVal}</td>
                  <td className="py-2.5 px-3">
                    {row.status === 'Pass' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIDENCE SCORING WEIGHTS & RECALCULATION ENGINE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
                Multi-Factor Confidence Scoring Engine &amp; Calibration
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Weighted mathematical formula combining spatial topology, geodetic precision, area closure, and attribute integrity.
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Calculated Score:</span>
            <span className="text-lg font-bold font-mono text-emerald-600">{dynamicConfidence}%</span>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
        </div>

        {/* 5 WEIGHT SLIDERS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Geometry Weight</span>
              <span className="font-mono font-bold">{geomWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={geomWeight} 
              onChange={(e) => setGeomWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">Vertex &amp; boundary IoU match</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Location Weight</span>
              <span className="font-mono font-bold">{locWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="40" 
              value={locWeight} 
              onChange={(e) => setLocWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">Geodetic RMSE &amp; CORS tie</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Area Weight</span>
              <span className="font-mono font-bold">{areaWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="40" 
              value={areaWeight} 
              onChange={(e) => setAreaWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">% delta between 7/12 &amp; vector</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Attributes Weight</span>
              <span className="font-mono font-bold">{attrWeight}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={attrWeight} 
              onChange={(e) => setAttrWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">Fuzzy owner &amp; land-use match</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Source Weight</span>
              <span className="font-mono font-bold">{relWeight}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={relWeight} 
              onChange={(e) => setRelWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 block">Survey method ranking</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Sum of active weights: <strong className="text-slate-900 dark:text-white font-mono">{geomWeight + locWeight + areaWeight + attrWeight + relWeight}%</strong></span>
          </div>

          <button
            onClick={handleApplyWeights}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Apply Recalibrated Matrix
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { SpatialMatch } from '../types/gis';
import { 
  GitMerge, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Compass, 
  Info,
  RefreshCw
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const SpatialMatchingPage: React.FC = () => {
  const { spatialMatches, navigateTo, showToast, addAuditLog } = useGIS();

  const [datasetA, setDatasetA] = useState('Revenue Register (7/12 & Settlement)');
  const [datasetB, setDatasetB] = useState('Cadastral Boundary Vector Sheet 2024');
  const [matchCriteria, setMatchCriteria] = useState({
    geometry: true,
    location: true,
    area: true,
    shape: true,
    attributes: true,
  });

  const [isMatching, setIsMatching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<SpatialMatch>(spatialMatches[0]);

  const handleStartMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      showToast('Multi-source spatial matching matrix re-indexed. 92 strong matches established.');
      addAuditLog('Spatial Matching', `${datasetA} ↔ ${datasetB}`, 'Success', 'Matched 92 parcels with mean IoU 91.4%');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              AI Spatial Matching & Cross-Layer Association
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              IoU & Centroid Proximity
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Correlate identical geographic entities across disparate municipal, cadastral, revenue, and drone datasets.
          </p>
        </div>

        <button
          onClick={handleStartMatching}
          disabled={isMatching}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          {isMatching ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Matching Spatial Layers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Execute Spatial Matching</span>
            </>
          )}
        </button>
      </div>

      {/* MATCHING SELECTION CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Layer Association Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Source Layer (Dataset A)
            </label>
            <select
              value={datasetA}
              onChange={(e) => setDatasetA(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Revenue Register (7/12 & Settlement)">Revenue Register (7/12 & Settlement)</option>
              <option value="Municipal Property GIS Layer">Municipal Property GIS Layer</option>
              <option value="GNSS CORS Field Rover Points">GNSS CORS Field Rover Points</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Target Layer (Dataset B)
            </label>
            <select
              value={datasetB}
              onChange={(e) => setDatasetB(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Cadastral Boundary Vector Sheet 2024">Cadastral Boundary Vector Sheet 2024</option>
              <option value="2026 Drone Orthomosaic Footprints">2026 Drone Orthomosaic Footprints</option>
              <option value="Town Planning Master Scheme">Town Planning Master Scheme</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-xs">
            Evaluation Heuristics
          </label>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { key: 'geometry', label: 'Geometric IoU Overlap' },
              { key: 'location', label: 'Centroid Distance Proximity' },
              { key: 'area', label: 'Calculated Area Similarity' },
              { key: 'shape', label: 'Polygon Contour Descriptors' },
              { key: 'attributes', label: 'Fuzzy Attribute Name Match' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchCriteria[item.key as keyof typeof matchCriteria]}
                  onChange={(e) => setMatchCriteria({ ...matchCriteria, [item.key]: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* MATCHING RESULTS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Spatial Correspondence Matches ({spatialMatches.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">Select a row to open split-map comparison</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Match ID</th>
                <th className="py-2.5 px-3">Dataset A Feature</th>
                <th className="py-2.5 px-3">Dataset B Feature</th>
                <th className="py-2.5 px-3 font-mono text-right">Geometry IoU</th>
                <th className="py-2.5 px-3 font-mono text-right">Area Ratio</th>
                <th className="py-2.5 px-3 font-mono text-right">Centroid Offset</th>
                <th className="py-2.5 px-3 font-mono text-right">Confidence</th>
                <th className="py-2.5 px-4">Evaluation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {spatialMatches.map(m => {
                const isSelected = selectedMatch.id === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 dark:bg-blue-950/40 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {m.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-slate-800 dark:text-slate-200">{m.sourceFeatureId}</span>
                      <span className="text-[10px] text-slate-400 block">{m.sourceType}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-slate-800 dark:text-slate-200">{m.targetFeatureId}</span>
                      <span className="text-[10px] text-slate-400 block">{m.targetType}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-700 dark:text-slate-300">
                      {m.geometrySimilarity}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-700 dark:text-slate-300">
                      {m.areaSimilarity}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-700 dark:text-slate-300">
                      {m.centroidDistanceM} m
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-emerald-600">
                      {m.overallConfidence}%
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        m.status === 'Strong Match' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 18: MATCHING DETAIL VIEW (SPLIT-MAP INSPECTOR) */}
      {selectedMatch && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Spatial Match Detail Inspection: {selectedMatch.id}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {selectedMatch.sourceFeatureId} ({selectedMatch.sourceDataset}) ↔ {selectedMatch.targetFeatureId} ({selectedMatch.targetDataset})
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-600">
              Confidence: {selectedMatch.overallConfidence}%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Split map display */}
            <div className="lg:col-span-8">
              <WebGISMap 
                heightClass="h-80" 
                isSplitView={true}
                splitDatasetA={selectedMatch.sourceDataset}
                splitDatasetB={selectedMatch.targetDataset}
              />
            </div>

            {/* Match metrics & AI reasoning */}
            <div className="lg:col-span-4 space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Geometry Overlap:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMatch.geometrySimilarity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Centroid Distance:</span>
                  <span className="font-bold text-blue-600">{selectedMatch.centroidDistanceM} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Area Similarity:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMatch.areaSimilarity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Attribute Score:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMatch.attributeSimilarity}%</span>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Reasoning Summary</span>
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  {selectedMatch.aiReasoning}
                </p>
                <p className="text-[10px] text-slate-500 italic pt-1 border-t border-blue-200 dark:border-blue-900">
                  Not legally authoritative without officer endorsement.
                </p>
              </div>

              <button
                onClick={() => {
                  showToast(`Correspondence match ${selectedMatch.id} approved for unified master ledger.`);
                }}
                className="w-full py-2 bg-emerald-600 text-white rounded font-semibold text-center hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Approve Correspondence Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

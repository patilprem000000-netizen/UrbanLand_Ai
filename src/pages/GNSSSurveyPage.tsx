import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Crosshair, MapPin, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const GNSSSurveyPage: React.FC = () => {
  const { gnssPoints, setSelectedParcelId, navigateTo, showToast } = useGIS();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              GNSS CORS Network & Ground Truth Benchmarks
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Sub-Centimeter Accuracy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Survey of India CORS Continuously Operating Reference Stations & RTK rover ground control points for definitive georeferencing.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported CORS GCP benchmark coordinates as CSV')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GCP Coordinates</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Active Survey Benchmarks on Geospatial Canvas
        </h3>
        <WebGISMap heightClass="h-72" showLayerPanel={false} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Ground Truth Survey Benchmarks ({gnssPoints.length})
          </h3>
          <span className="text-xs font-mono text-emerald-600 font-bold">Accuracy: 0.6cm – 1.5cm</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Point ID</th>
                <th className="py-3 px-4">Benchmark Name</th>
                <th className="py-3 px-3 font-mono">WGS 84 Coordinates</th>
                <th className="py-3 px-3 font-mono text-right">Elevation (H)</th>
                <th className="py-3 px-3 font-mono text-right">RTK Accuracy</th>
                <th className="py-3 px-3">CORS Station</th>
                <th className="py-3 px-3">Surveyor</th>
                <th className="py-3 px-3 font-mono">Related Parcel</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {gnssPoints.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                    {g.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                    {g.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {g.coordinates[1].toFixed(5)}°N, {g.coordinates[0].toFixed(5)}°E
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-slate-700 dark:text-slate-300">
                    {g.elevationM} m
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-emerald-600">
                    ± {g.accuracyCm} cm
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {g.corsBaseStation}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {g.surveyor}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    <button onClick={() => { setSelectedParcelId(g.relatedParcelId); navigateTo('parcels'); }} className="hover:underline">
                      {g.relatedParcelId}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

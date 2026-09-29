import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Settings as SettingsIcon, Sliders, Shield, Compass, RotateCcw, Check, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast, addAuditLog, resetAllDemoData } = useGIS();

  // Section 54: Data Source Reliability Weights
  const [weights, setWeights] = useState({
    gnss: 98,
    drone: 95,
    cadastral: 92,
    revenue: 90,
    municipal: 88,
  });

  // Section 24: Confidence Thresholds
  const [highThreshold, setHighThreshold] = useState(90);
  const [reviewThreshold, setReviewThreshold] = useState(75);

  // CRS settings
  const [defaultCRS, setDefaultCRS] = useState('EPSG:32643');

  const handleSaveSettings = () => {
    addAuditLog('System Settings Updated', 'Source Reliability Weights & CRS', 'Success', 'Updated confidence scoring weights');
    showToast('Platform parameters & source reliability weights updated.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              System Settings & Harmonization Parameters
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Admin Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure multi-source legal weights, automated confidence thresholds, and default projected coordinate reference systems.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* SECTION 54: DATA SOURCE RELIABILITY WEIGHTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Data Source Priority & Reliability Weights
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer dynamic scoring weights. Do not hardcode a single legal hierarchy; allow weights to adjust according to survey certification levels.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { key: 'gnss', label: 'Survey of India CORS RTK GNSS', desc: 'Sub-centimeter field rover observations with carrier-phase corrections.', val: weights.gnss },
            { key: 'drone', label: 'Drone Photogrammetry Orthomosaic (ORI)', desc: '5cm Ground Sampling Distance (GSD) calibrated aerial raster.', val: weights.drone },
            { key: 'cadastral', label: 'Cadastral Settlement Vector Sheet', desc: 'Historic boundary stones and digitized parcel vertices.', val: weights.cadastral },
            { key: 'revenue', label: 'Revenue 7/12 & Khatauni Ledger', desc: 'Statutory title holder area declarations and land tenure classification.', val: weights.revenue },
            { key: 'municipal', label: 'Municipal Property Tax Assessment GIS', desc: 'Town planning property boundaries and municipal ward numbers.', val: weights.municipal },
          ].map(source => (
            <div key={source.key} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{source.label}</span>
                  <span className="text-[11px] text-slate-500 block">{source.desc}</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                  {source.val}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={source.val}
                onChange={(e) => setWeights({ ...weights, [source.key]: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 24: CONFIDENCE SCORING THRESHOLDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Automated Confidence Threshold Tiers
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Classify harmonized features into High Confidence, Medium Confidence, or Requires Human Verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-md border border-emerald-200 dark:border-emerald-900 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">High Confidence Threshold</span>
              <span className="font-mono font-bold text-emerald-600">{highThreshold}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="98"
              value={highThreshold}
              onChange={(e) => setHighThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Records scoring above this threshold are approved automatically.</span>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-md border border-amber-200 dark:border-amber-900 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-900 dark:text-amber-300">Human Verification Threshold</span>
              <span className="font-mono font-bold text-amber-600">{reviewThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="85"
              value={reviewThreshold}
              onChange={(e) => setReviewThreshold(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Records scoring below this threshold route directly to the officer queue.</span>
          </div>
        </div>
      </div>

      {/* CRS CONFIGURATION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Coordinate Reference System (CRS) Master Standard
        </h3>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Default Standard Projected Coordinate System
          </label>
          <select
            value={defaultCRS}
            onChange={(e) => setDefaultCRS(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          >
            <option value="EPSG:32643">EPSG:32643 — WGS 84 / UTM Zone 43N (Standard for Western/Central India)</option>
            <option value="EPSG:32644">EPSG:32644 — WGS 84 / UTM Zone 44N (Eastern India)</option>
            <option value="EPSG:7755">EPSG:7755 — Indian Geodetic Datum 2020 / UTM 43N</option>
          </select>
        </div>
      </div>

      {/* RESET SYSTEM ENVIRONMENT */}
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-red-900 dark:text-red-300 block">Reset System Datasets to Baseline</span>
          <p className="text-red-700 dark:text-red-400 text-[11px] mt-0.5">
            Restore standard sample cadastral datasets, clear resolved conflicts, and reset baseline verification queues.
          </p>
        </div>
        <button
          onClick={resetAllDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Environment</span>
        </button>
      </div>
    </div>
  );
};

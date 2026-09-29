import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { DatasetSourceType } from '../types/gis';
import { 
  Database, 
  Search, 
  Filter, 
  Map as MapIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  UploadCloud, 
  Cpu, 
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const DatasetsPage: React.FC = () => {
  const { datasets, navigateTo, setSelectedDatasetId, showToast, triggerAIHarmonization } = useGIS();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const filtered = datasets.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.department.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === 'All' || d.sourceType === sourceFilter;
    return matchSearch && matchSource;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Geospatial Dataset Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized repository of multi-source urban land layers, orthomosaics, settlement maps, and survey points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerAIHarmonization}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run Harmonization Batch</span>
          </button>
          <button
            onClick={() => navigateTo('data-upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload New Dataset</span>
          </button>
        </div>
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="All">All Sources ({datasets.length})</option>
            <option value="Drone Survey">Drone Survey</option>
            <option value="Cadastral">Cadastral Vector</option>
            <option value="Municipal">Municipal GIS</option>
            <option value="GNSS/CORS">GNSS / CORS</option>
            <option value="Utility">Utility</option>
          </select>
        </div>
      </div>

      {/* DATASET TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Dataset Name & ID</th>
                <th className="py-3 px-3">Source & Dept</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3 font-mono text-right">Features</th>
                <th className="py-3 px-3">CRS Standard</th>
                <th className="py-3 px-3 font-mono text-right">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{d.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{d.id} · {(d.fileSizeBytes / 1000000).toFixed(1)} MB</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">{d.sourceType}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">{d.department}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {d.format}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-semibold text-slate-800 dark:text-slate-200">
                    {d.featuresCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {d.crsOriginal} → <span className="font-bold text-blue-600">{d.crsTarget}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-emerald-600">
                    {d.confidenceScore}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      d.status === 'Harmonized' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedDatasetId(d.id);
                          navigateTo('gis-map');
                        }}
                        title="View on Map"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      >
                        <MapIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Exported metadata for ${d.id}`)}
                        title="Download Metadata"
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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

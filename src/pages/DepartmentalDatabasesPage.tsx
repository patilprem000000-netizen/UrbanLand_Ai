import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Server, 
  Activity, 
  Link2, 
  ShieldCheck, 
  AlertTriangle,
  Radio,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DepartmentalDatabasesPage: React.FC = () => {
  const { departmentalDBs, syncDepartmentalDB, showToast } = useGIS();
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (dbId: string) => {
    setSyncingId(dbId);
    syncDepartmentalDB(dbId);
    setTimeout(() => {
      setSyncingId(null);
    }, 1500);
  };

  const handleSyncAll = () => {
    departmentalDBs.forEach((db, i) => {
      setTimeout(() => {
        syncDepartmentalDB(db.id);
      }, i * 300);
    });
    showToast('Triggered parallel federated synchronization across all departmental connectors.');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Multiple Departmental Databases &amp; Federated Connectors
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-2xl">
            Live federated synchronization hub unifying Directorate of Land Records (e-Dharti), Inspector General of Registration (IGR), 
            Municipal Property Tax &amp; Town Planning GIS, Survey of India CORS GNSS, and Urban Infrastructure utilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAll}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync All Departmental Connectors
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Federated Connectors</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {departmentalDBs.length} Connected
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">0 Offline · 100% Availability</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Authoritative Records</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {departmentalDBs.reduce((acc, d) => acc + d.totalRecords, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Deeds, RoR &amp; Assessments</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Connector Protocol</span>
            <Link2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            OGC / PostGIS
          </div>
          <span className="text-[11px] text-slate-500">Standardized Interoperability</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sync Latency</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            &lt; 150 ms
          </div>
          <span className="text-[11px] text-emerald-600">Sub-second state exchange</span>
        </div>
      </div>

      {/* DEPARTMENTAL CONNECTORS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {departmentalDBs.map(db => (
          <div 
            key={db.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {db.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {db.authStatus}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {db.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {db.department}
                  </p>
                </div>

                <button
                  onClick={() => handleSync(db.id)}
                  disabled={syncingId === db.id}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === db.id ? 'animate-spin' : ''}`} />
                  Sync Now
                </button>
              </div>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Connection Protocol:</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{db.connectionType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Endpoint URI:</span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate max-w-[280px]">
                    {db.endpoint}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Synchronization Cadence:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{db.syncFrequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Successful Sync:</span>
                  <span className="font-mono text-emerald-600 font-semibold">{db.lastSync}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1.5">
                  Synchronized Schema Tables:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {db.schemaTables.map((t, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Authoritative Records Ingested:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {db.totalRecords.toLocaleString()} records
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

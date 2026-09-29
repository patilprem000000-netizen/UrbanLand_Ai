import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Server, 
  Activity, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Database,
  Terminal,
  Zap,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export const ETLPipelinePage: React.FC = () => {
  const { etlJobs, runETLJob, showToast } = useGIS();
  const [selectedJobId, setSelectedJobId] = useState<string>(etlJobs[0]?.id || 'ETL-JOB-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'live-logs' | 'schedules'>('overview');

  const selectedJob = etlJobs.find(j => j.id === selectedJobId) || etlJobs[0];

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    '[2026-09-29 04:30:01] [INFO] Worker gis-worker-01 initialized for pipeline ' + selectedJob?.id,
    '[2026-09-29 04:30:02] [STAGE 1] Extracting payload from source: ' + selectedJob?.sourceSystem,
    '[2026-09-29 04:30:03] [STAGE 2] Automated CRS detection verified (Source: EPSG:4326 -> Target: EPSG:32643)',
    '[2026-09-29 04:30:04] [STAGE 3] Performing topological vertex snapping with 0.05m tolerance threshold',
    '[2026-09-29 04:30:05] [STAGE 4] AI spatial intersection matching completed. 98 features aligned.',
    '[2026-09-29 04:30:06] [STAGE 5] Attribute normalization committed to Unified PostGIS Spatial Store.',
    '[2026-09-29 04:30:06] [SUCCESS] Pipeline transaction closed. Status: 200 OK. 0 errors.'
  ]);

  const handleTriggerRun = (jobId: string) => {
    runETLJob(jobId);
    setSimulatedLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [INFO] Re-triggering automated ETL ingestion job ${jobId}...`,
      `[${new Date().toLocaleTimeString()}] [STAGE 1] Handshake initiated with remote repository...`,
      `[${new Date().toLocaleTimeString()}] [STAGE 2] Coordinate projection verified. Helmert 7-param transform OK.`,
      `[${new Date().toLocaleTimeString()}] [STAGE 3] Running topological clean pass... 0 gaps / 0 slivers detected.`,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] Batch sync finished with 100% record parity.`,
      ...prev.slice(0, 10)
    ]);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Automated Spatial ETL Pipeline
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-2xl">
            Continuous, multi-stage Extract-Transform-Load pipeline orchestrating cross-departmental geospatial data ingestion, 
            automated CRS reprojection, topology validation, and unified PostGIS integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerRun(selectedJob.id)}
            disabled={selectedJob.status === 'Running'}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
          >
            {selectedJob.status === 'Running' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Pipeline Executing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Current Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active ETL Pipelines</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {etlJobs.length} Jobs
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">All running on schedule</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Ingested Records</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {etlJobs.reduce((acc, j) => acc + j.recordsIngested, 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Parcels, Footprints & Benchmarks</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Average Latency</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            4.2 sec
          </div>
          <span className="text-[11px] text-slate-500">End-to-end multi-stage execution</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Data Integrity Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            99.98%
          </div>
          <span className="text-[11px] text-emerald-600">Zero unhandled topology breaks</span>
        </div>
      </div>

      {/* PIPELINE DAG VISUALIZER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Pipeline Stage Orchestration DAG: {selectedJob.name}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">ID: {selectedJob.id}</span>
        </div>

        {/* 6-STAGE PIPELINE FLOW */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {[
            { step: '01', title: 'Extract & Ingest', desc: 'Remote WFS / REST API', time: '1.2s' },
            { step: '02', title: 'CRS Detection', desc: 'Auto-Reproject to EPSG:32643', time: '0.8s' },
            { step: '03', title: 'Topology Fix', desc: 'Auto-Snap & De-sliver', time: '0.9s' },
            { step: '04', title: 'AI Match', desc: 'IoU & Hausdorff distance', time: '1.1s' },
            { step: '05', title: 'Attr Harmonize', desc: 'Unified RoR Schema Map', time: '0.6s' },
            { step: '06', title: 'PostGIS Load', desc: 'Spatial Index & Commit', time: '0.4s' }
          ].map((s, idx) => (
            <div 
              key={s.step}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded font-bold">
                  {s.step}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600">
                  <Check className="w-3 h-3" />
                  {s.time}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{s.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
              
              <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                <span className="text-emerald-600 font-semibold">Active</span>
                <span className="text-slate-400 font-mono">100% Pass</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JOBS LIST AND TERMINAL LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE ETL JOBS TABLE */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Configured Departmental ETL Pipelines
            </h2>
            <span className="text-xs text-slate-500 font-mono">{etlJobs.length} Pipelines</span>
          </div>

          <div className="space-y-3">
            {etlJobs.map(job => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {job.id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          job.status === 'Running' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {job.name}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerRun(job.id);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Run
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Source Protocol</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">{job.sourceSystem}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Schedule</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{job.schedule}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ingested Records</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">{job.recordsIngested} features</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME EXECUTION LOG STREAM */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Live Worker Pipeline Output
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                STREAM ACTIVE
              </span>
            </div>

            <div className="mt-3 p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg h-72 overflow-y-auto space-y-1.5 leading-relaxed border border-slate-800">
              {simulatedLogs.map((log, idx) => (
                <div key={idx} className="break-all">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Broker: Apache Kafka / Celery PostGIS Queue</span>
            <span className="font-mono">Worker: #04 (Healthy)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

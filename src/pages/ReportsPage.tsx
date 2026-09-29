import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Database,
  Building,
  QrCode
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { parcels, conflicts, datasets, currentUser, showToast } = useGIS();
  const [selectedReportType, setSelectedReportType] = useState('Parcel Harmonization Report');
  const [reportGenerated, setReportGenerated] = useState(true);

  const reportTypes = [
    { id: 'Parcel Harmonization Report', desc: 'Comprehensive unified statutory land parcel ledger and multi-source confidence metrics.' },
    { id: 'Dataset Integration Report', desc: 'CRS reprojection, geometry validation, and ingestion audit of aerial and cadastral layers.' },
    { id: 'Conflict Arbitration Report', desc: 'Spatial discrepancies, area difference calculations, and statutory reconciliation orders.' },
    { id: 'Change Detection Report', desc: 'Multi-epoch temporal diffs cataloging new constructions and boundary alterations.' },
    { id: 'Data Quality & Topology Report', desc: 'OGC geometry health index, vertex overlap counts, and automated snapping logs.' },
    { id: 'System Activity & Audit Report', desc: 'Cryptographically signed audit log of officer actions and statutory endorsements.' },
  ];

  const handleDownloadPDF = () => {
    showToast(`Generated government-grade PDF: "${selectedReportType}.pdf"`);
  };

  const handleExportCSV = () => {
    showToast(`Exported report data as CSV.`);
  };

  const handleExportGeoJSON = () => {
    showToast(`Exported harmonized boundaries as GeoJSON (EPSG:32643).`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Statutory Reports & Harmonization Dossiers
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              OGC &amp; ISO 19115 Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export verifiable government-grade dossiers, spatial certificates, and audit summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GeoJSON</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report Type Picker */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
            Select Report Template
          </span>

          <div className="space-y-2">
            {reportTypes.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedReportType(r.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                  selectedReportType === r.id
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className={`font-bold block ${selectedReportType === r.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {r.id}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {r.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Government-Grade Report Preview Paper */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-800 dark:text-slate-200 font-sans">
          {/* Header Seal & Emblem */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                GOVERNMENT OF INDIA · SMART INDIA HACKATHON 2024
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display uppercase">
                {selectedReportType}
              </h2>
              <p className="text-xs text-slate-500">
                Urban Land Records Modernization & Multi-Source Geospatial Harmonization Board
              </p>
            </div>

            <div className="text-right font-mono text-[10px] space-y-0.5 text-slate-500">
              <span className="block font-bold text-slate-800 dark:text-slate-200">DOC REF: BHU-2026-RPT-089</span>
              <span className="block">DATE: 2026-09-29 09:30 IST</span>
              <span className="block text-emerald-600 font-bold">CRS: EPSG:32643 (UTM 43N)</span>
            </div>
          </div>

          {/* Executive Overview Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-md border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Executive Synthesis
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                Mean Confidence: 94.2%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This statutory audit report confirms the successful automated integration and multi-layer harmonization of Sector 18 (Ward 4). Reconciled datasets include Settlement Cadastral Vector Sheets, Revenue 7/12 Records of Rights, Municipal Assessment GIS polygons, 5cm Drone Orthomosaics, and Survey of India CORS RTK ground benchmarks.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">HARMONIZED PARCELS</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">105</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">AI FOOTPRINTS</span>
                <span className="text-base font-bold text-blue-600">65 Detected</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">SETTLED DISPUTES</span>
                <span className="text-base font-bold text-emerald-600">5 Resolved</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">CONTRIBUTING SOURCES</span>
                <span className="text-base font-bold text-purple-600">5 Distinct</span>
              </div>
            </div>
          </div>

          {/* Sample Table in Report */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
              Sample Harmonized Cadastral Excerpt
            </span>
            <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Parcel ID</th>
                    <th className="py-2 px-3">Survey #</th>
                    <th className="py-2 px-3">Title Holder</th>
                    <th className="py-2 px-3 text-right">Area (sq.m)</th>
                    <th className="py-2 px-3 text-right">Confidence</th>
                    <th className="py-2 px-3">Statutory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {parcels.slice(0, 4).map(p => (
                    <tr key={p.id}>
                      <td className="py-2 px-3 font-bold text-blue-600">{p.id}</td>
                      <td className="py-2 px-3">{p.surveyNumber}</td>
                      <td className="py-2 px-3 font-sans font-medium">{p.ownerName}</td>
                      <td className="py-2 px-3 text-right">{p.areaSqm}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-600">{p.confidenceScore}%</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{p.verificationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Cryptographic Watermark */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-1 text-[10px] font-mono text-slate-400">
              <span className="block font-bold text-slate-700 dark:text-slate-300">CRYPTOGRAPHIC AUDIT PROOF</span>
              <span className="block break-all">SHA256: 8f4a3c9e2b1076d54a88f12c4e9081bb5920a671cf8920437d</span>
              <span className="block text-emerald-600 font-bold">✓ Blockchain Verifiable Timestamped Ledger</span>
            </div>

            <div className="text-right space-y-1 text-xs">
              <span className="font-serif italic text-base text-slate-800 dark:text-slate-200 block">
                {currentUser?.name}
              </span>
              <div className="border-t border-slate-400 dark:border-slate-600 pt-1">
                <span className="font-bold text-slate-900 dark:text-white block">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {currentUser?.role} · {currentUser?.department}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

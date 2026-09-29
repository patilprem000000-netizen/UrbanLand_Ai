import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Parcel } from '../types/gis';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  X,
  Sparkles,
  Building,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const ParcelManagementPage: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, navigateTo, showToast } = useGIS();

  const [search, setSearch] = useState('');
  const [landTypeFilter, setLandTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [dossierModalParcel, setDossierModalParcel] = useState<Parcel | null>(null);

  const filtered = parcels.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(search.toLowerCase()) || 
      p.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesLandType = landTypeFilter === 'All' || p.landType === landTypeFilter;
    const matchesStatus = statusFilter === 'All' || p.verificationStatus === statusFilter;
    return matchesSearch && matchesLandType && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    showToast(`Exported ${filtered.length} parcel records to CSV format.`);
  };

  const handleExportGeoJSON = () => {
    showToast(`Exported ${filtered.length} parcel polygons to unified GeoJSON (EPSG:32643).`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Unified Statutory Land Parcel Ledger
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              One Map · One Record
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconciled master cadastral registry harmonized across Revenue 7/12, Municipal Assessment, and Drone Orthomosaics.
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master GeoJSON</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Parcel ID (P-10245), Survey #, or Owner Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Zoning:</span>
            <select
              value={landTypeFilter}
              onChange={(e) => {
                setLandTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
            >
              <option value="All">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Institutional">Institutional</option>
              <option value="Public Utility">Public Utility</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Conflict Detected">Conflicts</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* PARCEL TABLE (SECTION 26) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Parcel ID</th>
                <th className="py-3 px-3">Survey Number</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-3 font-mono text-right">Area (sq.m)</th>
                <th className="py-3 px-3">Land Use</th>
                <th className="py-3 px-3">Municipal ID</th>
                <th className="py-3 px-3">Structures</th>
                <th className="py-3 px-3 font-mono text-right">AI Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(p => (
                <tr 
                  key={p.id} 
                  onClick={() => {
                    setSelectedParcelId(p.id);
                    setDossierModalParcel(p);
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {p.id}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {p.surveyNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {p.ownerName}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-blue-600">
                    {p.areaSqm.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {p.landType}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {p.municipalId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {p.buildingCount > 0 ? `${p.buildingCount} Detected` : 'Vacant'}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-emerald-600">
                    {p.confidenceScore}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      p.verificationStatus === 'Conflict Detected' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : p.verificationStatus === 'Pending Verification'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {p.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedParcelId(p.id);
                        setDossierModalParcel(p);
                      }}
                      className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold text-[11px] hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} parcels</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono">{page} / {totalPages || 1}</span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 56: UNIFIED PARCEL RECORD MODAL DOSSIER */}
      {dossierModalParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Official Statutory Unified Land Record Dossier
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {dossierModalParcel.id}
                  </h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                    dossierModalParcel.verificationStatus === 'Conflict Detected'
                      ? 'bg-red-100 text-red-700'
                      : dossierModalParcel.verificationStatus === 'Pending Verification'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {dossierModalParcel.verificationStatus}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Confidence: {dossierModalParcel.confidenceScore}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDossierModalParcel(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Snapshot */}
            <div className="h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <WebGISMap 
                heightClass="h-full" 
                showLayerPanel={false} 
                highlightParcelId={dossierModalParcel.id}
              />
            </div>

            {/* Identity & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white font-sans block text-xs">
                  Identity & Registry
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Parcel ID:</span>
                  <span className="font-bold">{dossierModalParcel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Cadastral Survey #:</span>
                  <span className="font-bold">{dossierModalParcel.surveyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Municipal Assessment ID:</span>
                  <span>{dossierModalParcel.municipalId}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white font-sans block text-xs">
                  Ownership & Title
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Registered Owner:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{dossierModalParcel.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Zoning / Land Use:</span>
                  <span className="font-sans font-medium">{dossierModalParcel.landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Revenue Record:</span>
                  <span className="text-emerald-600 font-sans">{dossierModalParcel.revenueStatus}</span>
                </div>
              </div>
            </div>

            {/* Geometry & Building */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white font-sans block text-xs">
                  Harmonized Geometry
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Total Area:</span>
                  <span className="font-bold text-blue-600">{dossierModalParcel.areaSqm} sq.m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Perimeter:</span>
                  <span>{dossierModalParcel.perimeterM} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Projected Standard CRS:</span>
                  <span className="text-slate-700 dark:text-slate-300">EPSG:32643 (UTM 43N)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white font-sans block text-xs">
                  AI Building Footprints
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Structure Status:</span>
                  <span className="font-sans font-medium">{dossierModalParcel.buildingStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Detected Footprints:</span>
                  <span>{dossierModalParcel.buildingCount} Unit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Source Verification:</span>
                  <span className="text-emerald-600 font-sans">ORI Aerial Photogrammetry</span>
                </div>
              </div>
            </div>

            {/* Source contributions 5 checkmarks (Section 55) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Source Dataset Synchronization (5 Contributing Layers)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-slate-400 text-[10px]">REVENUE</span>
                  <span className={dossierModalParcel.sources.revenue ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Endorsed</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-slate-400 text-[10px]">CADASTRAL</span>
                  <span className={dossierModalParcel.sources.cadastral ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Digitized</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-slate-400 text-[10px]">MUNICIPAL</span>
                  <span className={dossierModalParcel.sources.municipal ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Tax Linked</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-slate-400 text-[10px]">GNSS RTK</span>
                  <span className={dossierModalParcel.sources.gnss ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Surveyed</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center">
                  <span className="block text-slate-400 text-[10px]">DRONE ORI</span>
                  <span className={dossierModalParcel.sources.drone ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ 5cm GSD</span>
                </div>
              </div>
            </div>

            {/* Officer Endorsement & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-mono">
                Verified By: {dossierModalParcel.verifiedBy || 'Pending Dispute Resolution'} · {dossierModalParcel.verifiedAt || 'Awaiting Sign-off'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigateTo('reports');
                    setDossierModalParcel(null);
                  }}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Generate Official Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

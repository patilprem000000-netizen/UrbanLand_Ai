import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  FileSpreadsheet, 
  Search, 
  ShieldCheck, 
  Landmark, 
  Building2, 
  CreditCard, 
  MapPin, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  QrCode,
  Compass,
  FileCheck
} from 'lucide-react';

export const CurrentLandInfoPage: React.FC = () => {
  const { currentLandRecords, parcels, selectedParcelId, setSelectedParcelId, navigateTo, showToast } = useGIS();
  
  const [searchTerm, setSearchTerm] = useState(selectedParcelId || 'P-10212');
  const [activeDossierParcelId, setActiveDossierParcelId] = useState<string>(selectedParcelId || 'P-10212');

  const record = currentLandRecords[activeDossierParcelId] || currentLandRecords['P-10212'];
  const parcel = parcels.find(p => p.id === activeDossierParcelId) || parcels[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toUpperCase();
    
    // Find matching parcel or ULPN
    const foundParcel = parcels.find(p => 
      p.id.toUpperCase() === query || 
      p.surveyNumber.toUpperCase() === query ||
      p.ownerName.toLowerCase().includes(query.toLowerCase())
    );

    if (foundParcel && currentLandRecords[foundParcel.id]) {
      setActiveDossierParcelId(foundParcel.id);
      setSelectedParcelId(foundParcel.id);
      showToast(`Loaded statutory land dossier for ${foundParcel.id} (Survey ${foundParcel.surveyNumber})`);
    } else if (currentLandRecords[query]) {
      setActiveDossierParcelId(query);
      setSelectedParcelId(query);
      showToast(`Loaded statutory land dossier for ${query}`);
    } else {
      // Fallback to default
      setActiveDossierParcelId('P-10212');
      showToast(`Query "${searchTerm}" not directly found in certified records. Showing P-10212.`);
    }
  };

  const handlePrint = () => {
    window.print();
    showToast('Sent certified land record dossier to print spooler.');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Current Land Information System (Single-Window Dossier)
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 max-w-2xl">
            Unified statutory land registry combining Department of Land Records (7/12 RoR), Inspector General of Registration (IGR Deeds), 
            Municipal Property Tax Assessment, and Master Plan zoning permissibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Title Dossier
          </button>
          <button
            onClick={() => {
              setSelectedParcelId(record.parcelId);
              navigateTo('gis-map');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            Inspect on WebGIS Map
          </button>
        </div>
      </div>

      {/* SEARCH / ULPN BAR */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Parcel ID (P-10212), Survey No (44/2), ULPN (IN-27-04-10212-91), or Owner Name..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs font-semibold transition-colors"
          >
            Retrieve Certified Record
          </button>
        </div>
      </form>

      {/* QUICK PRESET PARCELS */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
        <span>Available Certified Dossiers:</span>
        {Object.keys(currentLandRecords).map(pid => (
          <button
            key={pid}
            onClick={() => {
              setActiveDossierParcelId(pid);
              setSearchTerm(pid);
              setSelectedParcelId(pid);
            }}
            className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
              activeDossierParcelId === pid
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {pid} ({currentLandRecords[pid].surveyNumber})
          </button>
        ))}
      </div>

      {/* MAIN STATUTORY RECORD DOSSIER CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* OFFICIAL DOSSIER BANNER */}
        <div className="bg-slate-900 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold">
                GOVERNMENT OF MAHARASHTRA / URBAN REVENUE SECRETARIAT
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                FORM 7/12 &amp; UNIFIED TITLE RECORD
              </span>
            </div>
            <h2 className="text-lg lg:text-xl font-bold font-display mt-1.5 flex items-center gap-2">
              <span>Parcel Record {record.parcelId}</span>
              <span className="text-sm font-mono text-slate-300 font-normal">· Survey No. {record.surveyNumber}</span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
              <span>Bhu-Aadhaar ULPN: <strong>{record.ulpn}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified Authentic
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <QrCode className="w-12 h-12 text-white shrink-0" />
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div className="font-bold text-white font-mono">DIGITAL TITLE SEAL</div>
              <div>Hash: 0x8F4A...B29C</div>
              <div className="text-slate-400">Scan to verify cryptographic chain</div>
            </div>
          </div>
        </div>

        {/* 4 CORE SECTIONS GRID */}
        <div className="p-6 space-y-6">
          {/* SECTION A: OWNERSHIP & TENURE PARTICULARS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-blue-500" />
              1. Title Holder &amp; Statutory Tenure Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Primary Title Holder</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block mt-0.5">{record.ownerName}</span>
                <span className="text-emerald-600 font-medium text-[10px] flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Aadhaar Linked &amp; e-KYC Verified
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Ownership Share</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block mt-0.5">{record.sharePercentage}% Undivided</span>
                <span className="text-slate-500 text-[10px]">Sole Proprietary Tenure</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Land Classification</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block mt-0.5">{record.landType}</span>
                <span className="text-slate-500 text-[10px]">Class-1 Occupancy Right</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Official Surface Area</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block mt-0.5 font-mono">{record.totalAreaSqm.toLocaleString()} m²</span>
                <span className="text-slate-500 text-[10px]">{(record.totalAreaSqm / 101.17).toFixed(2)} Gunthas (Cadastral)</span>
              </div>
            </div>
          </div>

          {/* SECTION B: MUTATION HISTORY TIMELINE */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              2. Certified Mutation History &amp; Chain of Title
            </h3>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Mutation No.</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">From Party</th>
                    <th className="py-2.5 px-3">To Party</th>
                    <th className="py-2.5 px-3">Order / Reg Number</th>
                    <th className="py-2.5 px-3">Certification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {record.mutationHistory.map(mut => (
                    <tr key={mut.mutationNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{mut.mutationNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{mut.date}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{mut.type}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{mut.fromParty}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{mut.toParty}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{mut.orderNumber}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-semibold text-[10px]">
                          {mut.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION C & D: FINANCIAL ENCUMBRANCE & MUNICIPAL ASSESSMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ENCUMBRANCE */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                3. Financial Encumbrance &amp; Bank Liens
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Lien Status:</span>
                  <span className={`font-semibold font-mono px-2 py-0.5 rounded text-[10px] ${
                    record.encumbrance.status.includes('Clear')
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {record.encumbrance.status}
                  </span>
                </div>

                {record.encumbrance.financialInstitution && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Lending Bank:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{record.encumbrance.financialInstitution}</span>
                  </div>
                )}

                {record.encumbrance.loanAmountLakhs && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Mortgage Charge:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{record.encumbrance.loanAmountLakhs} Lakhs</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Sub-Registrar Effective Date:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{record.encumbrance.effectiveDate}</span>
                </div>
              </div>
            </div>

            {/* MUNICIPAL PROPERTY TAX & ZONING */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                4. Municipal Property Tax &amp; Master Plan Zoning
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Master Plan Zone:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{record.zoningPermissibility.masterPlanZone}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Permissible FSI / Setbacks:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    FSI {record.zoningPermissibility.allowableFSI} · {record.zoningPermissibility.setbackFrontM}m Setback
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Property Tax Assessment:</span>
                  <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                    record.taxAssessment.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {record.taxAssessment.status} (Due: ₹{record.taxAssessment.propertyTaxDueInr})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Zoning Compliance:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {record.zoningPermissibility.complianceStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

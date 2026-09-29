import React from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Sparkles, 
  MapPin, 
  Database, 
  Cpu, 
  GitMerge, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useGIS();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Banner: Smart India Hackathon PS 26013 */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-center text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-emerald-400 font-semibold">
            SMART INDIA HACKATHON 2024 · PS 26013
          </span>
          <span className="hidden sm:inline text-slate-300">
            Automated Integration & Intelligent Harmonization of Multi-source Geospatial Data for Urban Land Records
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Govt. Prototype Demo
          </span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              B
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                BHUSYNC AI
              </span>
              <span className="text-[10px] text-slate-500 block leading-none font-mono">
                WebGIS Urban Land Harmonization System
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Core Capabilities</a>
            <a href="#pipeline" className="hover:text-slate-900 dark:hover:text-white transition-colors">Harmonization Pipeline</a>
            <a href="#interactive-map" className="hover:text-slate-900 dark:hover:text-white transition-colors">Live WebGIS Demo</a>
            <a href="#specifications" className="hover:text-slate-900 dark:hover:text-white transition-colors">Technical Architecture</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen WebGIS Land Information System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display text-balance">
            Intelligent Multi-Source Geospatial Data Harmonization
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 text-balance leading-relaxed">
            AI-powered integration, spatial validation and statutory synchronization of urban land records across drone photogrammetry, cadastral sheets, revenue records, municipal tax registries, and GNSS CORS benchmarks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md font-semibold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('gis-map')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>Interactive WebGIS Workstation</span>
            </button>

            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Officer Portal Login
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Unified Standard</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">EPSG:32643</span>
              <span className="text-[10px] text-slate-400 block">UTM Zone 43N CRS</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Integrated Layers</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">6 Distinct</span>
              <span className="text-[10px] text-slate-400 block">Drone, Cadastral, GNSS, Revenue</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Spatial Matching</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">94.2%</span>
              <span className="text-[10px] text-slate-400 block">Automated AI Confidence</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Governance</span>
              <span className="text-lg font-bold text-blue-600 font-mono">Human-in-Loop</span>
              <span className="text-[10px] text-slate-400 block">Statutory Officer Sign-off</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WEBGIS MAP PREVIEW SHOWCASE */}
        <div id="interactive-map" className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Interactive WebGIS Digital Twin Preview
              </h3>
              <p className="text-xs text-slate-500">
                Explore harmonized cadastral boundaries, AI rooftop footprints, utilities, and CORS GNSS benchmarks.
              </p>
            </div>
            <button
              onClick={() => navigateTo('gis-map')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Open Fullscreen GIS Workstation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <WebGISMap heightClass="h-[480px]" showLayerPanel={true} />
        </div>
      </section>

      {/* WHY BHUSYNC AI SECTION */}
      <section id="features" className="py-16 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              Why BhuSync AI?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Transforming fragmented geospatial data into a unified, intelligent, and verifiable urban land information system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Multi-Source Integration
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ingest drone survey orthomosaics, DSM/DTM, cadastral settlement sheets, revenue registers (7/12, Khatauni), municipal property IDs, and CORS RTK GNSS survey benchmarks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                <GitMerge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                AI-Powered Spatial Matching
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically identifies matching geographic features across conflicting datasets using spatial IoU, polygon shape descriptors, and fuzzy semantic attribute mapping.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Intelligent Harmonization
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatic CRS detection and coordinate reprojection into EPSG:32643 UTM Zone 43N, with schema alignment into a unified statutory parcel record schema.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Conflict Detection & Resolution
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Identifies boundary disputes, area discrepancies, road setback encroachments, and unapproved construction with 3-layer visual geometry comparisons.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Multi-Factor Confidence Scoring
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes explicit confidence scores across geometry alignment, location proximity, area ratio, attribute consistency, and source reliability weights.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Human-in-the-Loop Verification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Never alters official records without statutory officer authorization. Verification queue allows Revenue and Survey officers to endorse or dispatch field crews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">BHUSYNC AI</span>
            <span>· Smart India Hackathon Prototype (PS 26013)</span>
          </div>
          <p className="text-slate-500">
            One Map. One Record. One Intelligent Land Information System.
          </p>
        </div>
      </footer>
    </div>
  );
};

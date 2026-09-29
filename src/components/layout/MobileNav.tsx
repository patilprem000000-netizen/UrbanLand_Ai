import React, { useState } from 'react';
import { useGIS } from '../../services/gisContext';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Database, 
  AlertTriangle, 
  Menu,
  X,
  UserCheck,
  FileSpreadsheet,
  UploadCloud,
  FileText
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, navigateTo, conflicts, verificationTasks } = useGIS();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pendingConflicts = conflicts.filter(c => c.status !== 'Resolved').length;

  return (
    <>
      {/* Mobile Drawer Modal */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white font-display">UrbanLand AI Menu</span>
              <button onClick={() => setDrawerOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'gis-map', label: 'Interactive WebGIS' },
                { id: 'api-platform', label: 'Unified GIS + API Platform' },
                { id: 'crs-transform', label: 'CRS Detection & Transform' },
                { id: 'etl-pipeline', label: 'Automated ETL Pipeline' },
                { id: 'departmental-dbs', label: 'Departmental Databases' },
                { id: 'data-upload', label: 'Upload Dataset' },
                { id: 'datasets', label: 'Dataset Registry' },
                { id: 'ai-features', label: 'AI Feature Extraction' },
                { id: 'spatial-matching', label: 'Spatial Matching' },
                { id: 'attribute-mapping', label: 'Attribute Harmonization' },
                { id: 'topology-checker', label: 'Topology Checker' },
                { id: 'change-detection', label: 'Change Detection' },
                { id: 'cross-source-validation', label: 'Cross-Source Validation' },
                { id: 'conflicts', label: 'Conflict Resolution' },
                { id: 'verification', label: 'Human Verification Queue' },
                { id: 'current-land-info', label: 'Current Land Info Dossier' },
                { id: 'parcels', label: 'Unified Land Parcels' },
                { id: 'buildings', label: 'AI Building Footprints' },
                { id: 'revenue-records', label: 'Revenue Records (7/12)' },
                { id: 'municipal-gis', label: 'Municipal GIS & Tax' },
                { id: 'utilities', label: 'Utility Infrastructure' },
                { id: 'gnss-survey', label: 'GNSS / CORS Points' },
                { id: 'reports', label: 'Reports & Certificates' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'audit-logs', label: 'Audit Trail' },
                { id: 'settings', label: 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id as any);
                    setDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded font-medium ${
                    currentPage === item.id 
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Fixed Bottom Bar on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-2 shadow-lg">
        <button
          onClick={() => navigateTo('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPage === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('gis-map')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPage === 'gis-map' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={() => navigateTo('datasets')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPage === 'datasets' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Datasets</span>
        </button>

        <button
          onClick={() => navigateTo('conflicts')}
          className={`flex flex-col items-center gap-0.5 text-[10px] relative ${
            currentPage === 'conflicts' ? 'text-red-600 font-bold' : 'text-slate-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {pendingConflicts > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-red-600 rounded-full" />
          )}
          <span>Conflicts</span>
        </button>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};

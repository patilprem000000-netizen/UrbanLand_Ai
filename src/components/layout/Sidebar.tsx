import React from 'react';
import { useGIS, AppPage } from '../../services/gisContext';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  UploadCloud, 
  Database, 
  Cpu, 
  GitMerge, 
  Sliders, 
  CheckSquare, 
  History, 
  AlertTriangle, 
  UserCheck, 
  FileSpreadsheet, 
  Building2, 
  Landmark, 
  Building, 
  Cable, 
  Crosshair, 
  FileText, 
  BarChart3, 
  ScrollText, 
  Users, 
  Settings as SettingsIcon,
  Compass,
  Zap,
  ShieldCheck,
  Globe,
  Server
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: {
    id: AppPage;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { currentPage, navigateTo, conflicts, verificationTasks, datasets, etlJobs, departmentalDBs } = useGIS();

  const pendingConflictsCount = conflicts.filter(c => c.status !== 'Resolved').length;
  const pendingTasksCount = verificationTasks.filter(t => t.status === 'Pending').length;

  const navGroups: NavGroup[] = [
    {
      label: 'Core GIS Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'gis-map', label: 'Interactive WebGIS', icon: MapIcon },
        { id: 'api-platform', label: 'Unified GIS + API Platform', icon: Globe },
      ]
    },
    {
      label: 'Ingestion, CRS & ETL Pipeline',
      items: [
        { id: 'crs-transform', label: 'CRS Detection & Transform', icon: Compass },
        { id: 'etl-pipeline', label: 'Automated ETL Pipeline', icon: Zap, badge: `${etlJobs.length} Active` },
        { id: 'departmental-dbs', label: 'Departmental Databases', icon: Server, badge: departmentalDBs.length },
        { id: 'data-upload', label: 'Upload Dataset', icon: UploadCloud },
        { id: 'datasets', label: 'Dataset Registry', icon: Database, badge: datasets.length },
      ]
    },
    {
      label: 'AI Harmonization Engine',
      items: [
        { id: 'ai-features', label: 'AI Feature Extraction', icon: Cpu },
        { id: 'spatial-matching', label: 'Spatial Matching', icon: GitMerge },
        { id: 'attribute-mapping', label: 'Attribute Harmonization', icon: Sliders },
        { id: 'topology-checker', label: 'Topology Checker', icon: CheckSquare },
        { id: 'change-detection', label: 'Change Detection', icon: History },
      ]
    },
    {
      label: 'Validation & Conflict Resolution',
      items: [
        { id: 'cross-source-validation', label: 'Cross-Source Validation', icon: ShieldCheck },
        { 
          id: 'conflicts', 
          label: 'Conflict Resolution', 
          icon: AlertTriangle, 
          badge: pendingConflictsCount,
          badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400'
        },
        { 
          id: 'verification', 
          label: 'Human Verification Queue', 
          icon: UserCheck, 
          badge: pendingTasksCount,
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        },
      ]
    },
    {
      label: 'Harmonized Land Layers',
      items: [
        { id: 'current-land-info', label: 'Current Land Info Dossier', icon: Landmark },
        { id: 'parcels', label: 'Unified Parcels', icon: FileSpreadsheet },
        { id: 'buildings', label: 'Building Footprints', icon: Building2 },
        { id: 'revenue-records', label: 'Revenue Records (7/12)', icon: FileText },
        { id: 'municipal-gis', label: 'Municipal GIS & Tax', icon: Building },
        { id: 'utilities', label: 'Utility Infrastructure', icon: Cable },
        { id: 'gnss-survey', label: 'GNSS / CORS Points', icon: Crosshair },
      ]
    },
    {
      label: 'Governance & Output',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: FileText },
        { id: 'analytics', label: 'Analytics & Quality', icon: BarChart3 },
        { id: 'audit-logs', label: 'Audit Trail', icon: ScrollText },
        { id: 'users', label: 'User Roles & RBAC', icon: Users },
        { id: 'settings', label: 'System Settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
      {/* Sidebar Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
              {group.label}
            </span>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-slate-900' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  User, 
  UserRole, 
  Parcel, 
  Building, 
  Dataset, 
  SpatialConflict, 
  VerificationTask, 
  TopologyIssue, 
  ChangeEvent, 
  GNSSPoint, 
  UtilityNetwork, 
  AuditLog, 
  NotificationItem,
  SpatialMatch,
  ETLPipelineJob,
  DepartmentalDatabase,
  CrossSourceValidationResult,
  CurrentLandInfo,
  APIRouteSpec
} from '../types/gis';
import { 
  initialParcels, 
  initialBuildings, 
  initialDatasets, 
  initialConflicts, 
  initialVerificationTasks, 
  initialTopologyIssues, 
  initialChangeEvents, 
  initialGNSSPoints, 
  initialUtilities, 
  initialAuditLogs, 
  initialNotifications,
  initialSpatialMatches,
  initialETLJobs,
  initialDepartmentalDBs,
  initialCurrentLandRecords,
  initialCrossSourceValidations,
  initialAPIRoutes
} from '../data/mockData';
import { SAMPLE_USERS } from './authService';

export type AppPage = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'gis-map'
  | 'data-upload'
  | 'datasets'
  | 'crs-transform'
  | 'etl-pipeline'
  | 'ai-features'
  | 'spatial-matching'
  | 'attribute-mapping'
  | 'topology-checker'
  | 'change-detection'
  | 'conflicts'
  | 'conflict-detail'
  | 'verification'
  | 'current-land-info'
  | 'cross-source-validation'
  | 'departmental-dbs'
  | 'api-platform'
  | 'parcels'
  | 'buildings'
  | 'revenue-records'
  | 'municipal-gis'
  | 'utilities'
  | 'gnss-survey'
  | 'reports'
  | 'analytics'
  | 'audit-logs'
  | 'users'
  | 'settings';

export interface MapLayerState {
  parcels: boolean;
  buildings: boolean;
  roads: boolean;
  utilities: boolean;
  revenue: boolean;
  municipal: boolean;
  gnss: boolean;
  groundTruth: boolean;
  conflicts: boolean;
  changes: boolean;
}

export interface GISContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
  switchRole: (role: UserRole) => void;
  
  // Data State
  parcels: Parcel[];
  buildings: Building[];
  datasets: Dataset[];
  conflicts: SpatialConflict[];
  verificationTasks: VerificationTask[];
  topologyIssues: TopologyIssue[];
  changeEvents: ChangeEvent[];
  gnssPoints: GNSSPoint[];
  utilities: UtilityNetwork[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  spatialMatches: SpatialMatch[];

  // Selected Entities
  selectedParcelId: string | null;
  setSelectedParcelId: (id: string | null) => void;
  selectedConflictId: string | null;
  setSelectedConflictId: (id: string | null) => void;
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;

  // Map Controls
  mapLayers: MapLayerState;
  toggleMapLayer: (layer: keyof MapLayerState) => void;
  basemapMode: 'vector' | 'satellite' | 'cadastral';
  setBasemapMode: (mode: 'vector' | 'satellite' | 'cadastral') => void;

  // Actions
  resolveConflict: (conflictId: string, actionTaken: string, note?: string) => void;
  approveVerification: (taskId: string, notes?: string) => void;
  rejectVerification: (taskId: string, notes?: string) => void;
  requestGroundSurvey: (conflictOrTaskId: string, isTask?: boolean) => void;
  runTopologyAutoFix: (issueId: string) => void;
  uploadDataset: (newDataset: Partial<Dataset>) => void;
  triggerAIHarmonization: () => void;
  addAuditLog: (action: string, entity: string, result: 'Success' | 'Warning' | 'Failed', details: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // New Core Modules
  etlJobs: ETLPipelineJob[];
  departmentalDBs: DepartmentalDatabase[];
  crossSourceValidations: CrossSourceValidationResult[];
  currentLandRecords: Record<string, CurrentLandInfo>;
  apiRoutes: APIRouteSpec[];
  runETLJob: (jobId: string) => void;
  syncDepartmentalDB: (dbId: string) => void;
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  resetAllDemoData: () => void;
}

const GISContext = createContext<GISContextType | undefined>(undefined);

export const GISProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(SAMPLE_USERS['GIS Officer']);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  const [parcels, setParcels] = useState<Parcel[]>(initialParcels);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);
  const [conflicts, setConflicts] = useState<SpatialConflict[]>(initialConflicts);
  const [verificationTasks, setVerificationTasks] = useState<VerificationTask[]>(initialVerificationTasks);
  const [topologyIssues, setTopologyIssues] = useState<TopologyIssue[]>(initialTopologyIssues);
  const [changeEvents, setChangeEvents] = useState<ChangeEvent[]>(initialChangeEvents);
  const [gnssPoints] = useState<GNSSPoint[]>(initialGNSSPoints);
  const [utilities] = useState<UtilityNetwork[]>(initialUtilities);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [spatialMatches, setSpatialMatches] = useState<SpatialMatch[]>(initialSpatialMatches);
  const [etlJobs, setEtlJobs] = useState<ETLPipelineJob[]>(initialETLJobs);
  const [departmentalDBs, setDepartmentalDBs] = useState<DepartmentalDatabase[]>(initialDepartmentalDBs);
  const [crossSourceValidations, setCrossSourceValidations] = useState<CrossSourceValidationResult[]>(initialCrossSourceValidations);
  const [currentLandRecords, setCurrentLandRecords] = useState<Record<string, CurrentLandInfo>>(initialCurrentLandRecords);
  const [apiRoutes] = useState<APIRouteSpec[]>(initialAPIRoutes);

  const [selectedParcelId, setSelectedParcelId] = useState<string | null>('P-10212');
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>('C-1024');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>('DS-2026-001');

  const [mapLayers, setMapLayers] = useState<MapLayerState>({
    parcels: true,
    buildings: true,
    roads: true,
    utilities: true,
    revenue: true,
    municipal: true,
    gnss: true,
    groundTruth: true,
    conflicts: true,
    changes: true,
  });

  const [basemapMode, setBasemapMode] = useState<'vector' | 'satellite' | 'cadastral'>('vector');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (role: UserRole) => {
    const user = SAMPLE_USERS[role];
    setCurrentUser(user);
    showToast(`Switched active session to ${role}: ${user.name}`);
    addAuditLog('Switched User Role', role, 'Success', `Session role changed to ${role}`);
  };

  const toggleMapLayer = (layer: keyof MapLayerState) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const addAuditLog = (
    action: string, 
    entity: string, 
    result: 'Success' | 'Warning' | 'Failed', 
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      user: currentUser?.name || 'Authorized Official',
      role: currentUser?.role || 'GIS Officer',
      action,
      datasetOrEntity: entity,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipDevice: '10.14.88.22 / Gov Secure Intranet',
      result,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const runETLJob = (jobId: string) => {
    setEtlJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'Running' as const,
          lastRun: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
      }
      return j;
    }));
    showToast(`Triggered ETL pipeline execution for ${jobId}...`);
    setTimeout(() => {
      setEtlJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'Success' as const,
            recordsIngested: j.recordsIngested + 12
          };
        }
        return j;
      }));
      addAuditLog('ETL Job Completed', jobId, 'Success', 'Extracted, transformed CRS to EPSG:32643, harmonized topology and committed.');
      showToast(`ETL Job ${jobId} executed successfully with 0 topology errors!`);
    }, 1800);
  };

  const syncDepartmentalDB = (dbId: string) => {
    showToast(`Initiating bidirectional sync with departmental connector ${dbId}...`);
    setTimeout(() => {
      setDepartmentalDBs(prev => prev.map(d => {
        if (d.id === dbId) {
          return {
            ...d,
            lastSync: 'Just now',
            authStatus: 'Connected' as const,
            totalRecords: d.totalRecords + 25
          };
        }
        return d;
      }));
      addAuditLog('Departmental DB Synced', dbId, 'Success', 'Federated handshake completed with authoritative registry.');
      showToast(`Connector ${dbId} synced. 25 updated records merged.`);
    }, 1400);
  };

  const resolveConflict = (conflictId: string, actionTaken: string, note?: string) => {
    setConflicts(prev => prev.map(c => {
      if (c.id === conflictId) {
        return {
          ...c,
          status: 'Resolved',
          resolvedBy: currentUser?.name || 'Verification Officer',
          resolvedAt: new Date().toISOString().slice(0, 10),
          resolvedAction: actionTaken,
          resolutionNote: note || `Resolved via ${actionTaken} protocol.`
        };
      }
      return c;
    }));

    // Update corresponding parcel
    const conflict = conflicts.find(c => c.id === conflictId);
    if (conflict) {
      setParcels(prev => prev.map(p => {
        if (p.id === conflict.parcelId) {
          return {
            ...p,
            verificationStatus: 'Verified',
            revenueStatus: 'Verified',
            confidenceScore: Math.min(98, p.confidenceScore + 22),
            confidenceBreakdown: {
              ...p.confidenceBreakdown,
              geometry: 96,
              area: 95
            },
            verifiedBy: currentUser?.name || 'Verification Officer',
            verifiedAt: new Date().toISOString().slice(0, 10),
            disputeNotes: undefined
          };
        }
        return p;
      }));
    }

    addAuditLog('Conflict Resolved', conflictId, 'Success', `Action applied: ${actionTaken}`);
    showToast(`Conflict ${conflictId} successfully resolved and recorded in unified ledger.`);
  };

  const approveVerification = (taskId: string, notes?: string) => {
    setVerificationTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Approved' };
      }
      return t;
    }));

    const task = verificationTasks.find(t => t.id === taskId);
    if (task) {
      setParcels(prev => prev.map(p => {
        if (p.id === task.parcelId) {
          return {
            ...p,
            verificationStatus: 'Verified',
            confidenceScore: 97,
            verifiedBy: currentUser?.name || 'Verification Officer',
            verifiedAt: new Date().toISOString().slice(0, 10)
          };
        }
        return p;
      }));
    }

    addAuditLog('Verification Approved', taskId, 'Success', notes || 'Harmonized spatial boundaries endorsed.');
    showToast(`Task ${taskId} approved by ${currentUser?.role}`);
  };

  const rejectVerification = (taskId: string, notes?: string) => {
    setVerificationTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Rejected' };
      }
      return t;
    }));
    addAuditLog('Verification Rejected', taskId, 'Warning', notes || 'Returned to field survey team for re-triangulation.');
    showToast(`Task ${taskId} rejected. Request routed back to field team.`);
  };

  const requestGroundSurvey = (id: string, isTask = false) => {
    if (isTask) {
      setVerificationTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Survey Requested' } : t));
    } else {
      setConflicts(prev => prev.map(c => c.id === id ? { ...c, status: 'Ground Survey Requested' } : c));
    }
    addAuditLog('Field Survey Dispatched', id, 'Success', 'GNSS RTK Rover field team assigned for boundary demarcation.');
    showToast('Field GNSS RTK survey requisition initiated.');
  };

  const runTopologyAutoFix = (issueId: string) => {
    setTopologyIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        return { ...i, status: 'Auto-Corrected' };
      }
      return i;
    }));
    showToast(`Topology issue ${issueId} automatically snapped and geometry sanitized.`);
    addAuditLog('Topology Sanitized', issueId, 'Success', 'Polygon geometry self-intersection resolved.');
  };

  const uploadDataset = (newDataset: Partial<Dataset>) => {
    const ds: Dataset = {
      id: `DS-2026-00${datasets.length + 1}`,
      name: newDataset.name || 'Imported Cadastral Dataset',
      sourceType: newDataset.sourceType || 'Cadastral',
      department: newDataset.department || 'Urban Land Survey Directorate',
      format: newDataset.format || 'GeoJSON',
      featuresCount: newDataset.featuresCount || 85,
      crsOriginal: newDataset.crsOriginal || 'EPSG:4326',
      crsTarget: 'EPSG:32643',
      fileSizeBytes: newDataset.fileSizeBytes || 12400000,
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: `${currentUser?.name} (${currentUser?.role})`,
      status: 'Harmonized',
      confidenceScore: 94,
      topologyErrors: 0,
      extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
    };
    setDatasets(prev => [ds, ...prev]);
    addAuditLog('Dataset Uploaded & Harmonized', ds.id, 'Success', `${ds.name} standardized into EPSG:32643`);
    showToast(`Dataset "${ds.name}" successfully integrated!`);
  };

  const triggerAIHarmonization = () => {
    showToast('Running multi-source AI spatial matching & topology correction...');
    setTimeout(() => {
      setParcels(prev => prev.map(p => ({
        ...p,
        confidenceScore: Math.min(99, p.confidenceScore + 4)
      })));
      addAuditLog('AI Pipeline Execution', 'Multi-Source Harmonization', 'Success', 'Completed 8-stage harmonization sequence.');
      showToast('AI Harmonization pipeline completed successfully. 92 parcels harmonized.');
    }, 1500);
  };

  const resetAllDemoData = () => {
    setParcels(initialParcels);
    setBuildings(initialBuildings);
    setDatasets(initialDatasets);
    setConflicts(initialConflicts);
    setVerificationTasks(initialVerificationTasks);
    setTopologyIssues(initialTopologyIssues);
    setChangeEvents(initialChangeEvents);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
    setSpatialMatches(initialSpatialMatches);
    setEtlJobs(initialETLJobs);
    setDepartmentalDBs(initialDepartmentalDBs);
    setCrossSourceValidations(initialCrossSourceValidations);
    setCurrentLandRecords(initialCurrentLandRecords);
    setSelectedParcelId('P-10212');
    setSelectedConflictId('C-1024');
    showToast('System operational datasets reset to baseline state.');
  };

  const value = useMemo<GISContextType>(() => ({
    currentUser,
    setCurrentUser,
    currentPage,
    navigateTo,
    switchRole,
    parcels,
    buildings,
    datasets,
    conflicts,
    verificationTasks,
    topologyIssues,
    changeEvents,
    gnssPoints,
    utilities,
    auditLogs,
    notifications,
    spatialMatches,
    selectedParcelId,
    setSelectedParcelId,
    selectedConflictId,
    setSelectedConflictId,
    selectedDatasetId,
    setSelectedDatasetId,
    mapLayers,
    toggleMapLayer,
    basemapMode,
    setBasemapMode,
    resolveConflict,
    approveVerification,
    rejectVerification,
    requestGroundSurvey,
    runTopologyAutoFix,
    uploadDataset,
    triggerAIHarmonization,
    addAuditLog,
    searchQuery,
    setSearchQuery,
    etlJobs,
    departmentalDBs,
    crossSourceValidations,
    currentLandRecords,
    apiRoutes,
    runETLJob,
    syncDepartmentalDB,
    toastMessage,
    showToast,
    resetAllDemoData
  }), [
    currentUser,
    currentPage,
    parcels,
    buildings,
    datasets,
    conflicts,
    verificationTasks,
    topologyIssues,
    changeEvents,
    gnssPoints,
    utilities,
    auditLogs,
    notifications,
    spatialMatches,
    selectedParcelId,
    selectedConflictId,
    selectedDatasetId,
    mapLayers,
    basemapMode,
    searchQuery,
    etlJobs,
    departmentalDBs,
    crossSourceValidations,
    currentLandRecords,
    apiRoutes,
    toastMessage
  ]);

  return <GISContext.Provider value={value}>{children}</GISContext.Provider>;
};

export const useGIS = () => {
  const context = useContext(GISContext);
  if (!context) {
    throw new Error('useGIS must be used within a GISProvider');
  }
  return context;
};

export type UserRole = 
  | 'Administrator'
  | 'GIS Officer'
  | 'Survey Officer'
  | 'Revenue Officer'
  | 'Municipal Officer'
  | 'Verification Officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  badgeNumber: string;
  avatarUrl?: string;
  active: boolean;
  lastLogin: string;
}

export type DatasetSourceType = 
  | 'Drone Survey'
  | 'ORI'
  | 'DSM'
  | 'DTM'
  | 'Cadastral'
  | 'Revenue'
  | 'Municipal'
  | 'Utility'
  | 'GNSS/CORS'
  | 'Ground Truth'
  | 'Building Footprints';

export type DatasetFormat = 'GeoJSON' | 'Shapefile' | 'GeoTIFF' | 'CSV' | 'KML' | 'GPKG';

export interface Dataset {
  id: string;
  name: string;
  sourceType: DatasetSourceType;
  department: string;
  format: DatasetFormat;
  featuresCount: number;
  crsOriginal: string;
  crsTarget: string;
  fileSizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'Ready' | 'Processing' | 'Validated' | 'Harmonized' | 'Failed';
  confidenceScore: number;
  topologyErrors: number;
  extent: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

export interface Parcel {
  id: string;                     // e.g. P-10245
  surveyNumber: string;           // e.g. 45/2A
  municipalId: string;            // e.g. MUN-4589
  ownerName: string;
  landType: 'Residential' | 'Commercial' | 'Agricultural' | 'Institutional' | 'Industrial' | 'Public Utility';
  areaSqm: number;
  perimeterM: number;
  centroid: [number, number];     // [lng, lat]
  coordinates: [number, number][]; // Polygon exterior ring
  buildingStatus: 'Detected' | 'None' | 'Under Construction' | 'Multiple';
  buildingCount: number;
  revenueStatus: 'Verified' | 'Pending Review' | 'Disputed' | 'Reconciled';
  verificationStatus: 'Verified' | 'Pending Verification' | 'Conflict Detected' | 'In Review';
  confidenceScore: number;         // 0 - 100
  confidenceBreakdown: {
    geometry: number;
    location: number;
    area: number;
    attributes: number;
    sourceReliability: number;
  };
  sources: {
    revenue: boolean;
    cadastral: boolean;
    municipal: boolean;
    gnss: boolean;
    drone: boolean;
  };
  lastUpdated: string;
  verifiedBy?: string;
  verifiedAt?: string;
  disputeNotes?: string;
}

export interface Building {
  id: string;                     // e.g. B-00521
  parcelId: string;
  areaSqm: number;
  heightM?: number;
  floors?: number;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed';
  centroid: [number, number];
  coordinates: [number, number][];
  confidence: number;
  detectionSource: 'Drone ORI AI' | 'LiDAR DSM' | 'Manual Digitize';
  detectedDate: string;
  status: 'Newly Detected' | 'Verified' | 'Unauthorized' | 'Existing Record';
}

export interface SpatialMatch {
  id: string;
  sourceDataset: string;
  targetDataset: string;
  sourceFeatureId: string;
  targetFeatureId: string;
  sourceType: string;
  targetType: string;
  geometrySimilarity: number;
  areaSimilarity: number;
  attributeSimilarity: number;
  centroidDistanceM: number;
  overallConfidence: number;
  status: 'Strong Match' | 'Probable Match' | 'Requires Review' | 'Rejected';
  aiReasoning: string;
  timestamp: string;
}

export interface SpatialConflict {
  id: string;                     // e.g. C-1024
  parcelId: string;
  surveyNumber: string;
  type: 
    | 'Boundary Conflict'
    | 'Area Conflict'
    | 'Ownership Attribute Conflict'
    | 'Building-Parcel Conflict'
    | 'Road-Parcel Conflict'
    | 'Utility-Parcel Conflict'
    | 'Duplicate Feature'
    | 'Coordinate Conflict';
  severity: 'High' | 'Medium' | 'Low';
  sources: string[];              // ['Revenue', 'Municipal', 'GNSS']
  revenueAreaSqm: number;
  municipalAreaSqm: number;
  gnssAreaSqm: number;
  areaDifferenceSqm: number;
  confidenceScore: number;
  aiRecommendation: string;
  status: 'Pending Review' | 'Ground Survey Requested' | 'Resolved' | 'Rejected';
  detectedAt: string;
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolvedAction?: string;
}

export interface VerificationTask {
  id: string;                     // e.g. VER-102
  parcelId: string;
  surveyNumber: string;
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  aiConfidence: number;
  aiRecommendation: string;
  sourceDatasets: string[];
  submittedAt: string;
  assignedOfficer: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Survey Requested';
}

export interface TopologyIssue {
  id: string;
  featureId: string;
  type: 'Gap' | 'Overlap' | 'Self-Intersection' | 'Duplicate Geometry' | 'Invalid Polygon' | 'Sliver Polygon';
  severity: 'Error' | 'Warning';
  suggestedAction: string;
  coordinates: [number, number];
  status: 'Open' | 'Auto-Corrected' | 'Ignored';
}

export interface ChangeEvent {
  id: string;
  type: 'New Building' | 'Demolished Building' | 'Boundary Shift' | 'Road Extension' | 'Land Use Alteration';
  parcelId: string;
  location: [number, number];
  previousState: string;
  currentState: string;
  areaChangeSqm: number;
  detectedDate: string;
  confidence: number;
}

export interface GNSSPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  elevationM: number;
  accuracyCm: number;
  surveyDate: string;
  surveyor: string;
  corsBaseStation: string;
  relatedParcelId: string;
  status: 'Verified' | 'Pending Processing' | 'Benchmark';
}

export interface UtilityNetwork {
  id: string;
  type: 'Water Pipeline' | 'Electric Grid' | 'Underground Drainage' | 'Gas Main' | 'Optical Fiber';
  lengthM: number;
  depthM: number;
  status: 'Active' | 'Under Maintenance' | 'Proposed';
  source: 'Municipal Utility Board';
  affectedParcels: string[];
  coordinates: [number, number][];
}

export interface AuditLog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  datasetOrEntity: string;
  timestamp: string;
  ipDevice: string;
  result: 'Success' | 'Warning' | 'Failed';
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  linkPage?: string;
}

export interface ETLPipelineJob {
  id: string;
  name: string;
  sourceSystem: string;
  targetLayer: string;
  schedule: string;
  lastRun: string;
  status: 'Running' | 'Success' | 'Failed' | 'Scheduled';
  recordsIngested: number;
  latencySec: number;
  stages: {
    name: string;
    status: 'completed' | 'in_progress' | 'queued' | 'failed';
    duration: string;
  }[];
}

export interface DepartmentalDatabase {
  id: string;
  name: string;
  department: string;
  connectionType: 'PostgreSQL / PostGIS' | 'Oracle Spatial' | 'OGC WFS/WMS' | 'REST API Connector' | 'SFTP Ingestion';
  endpoint: string;
  authStatus: 'Connected' | 'Degraded' | 'Offline';
  lastSync: string;
  totalRecords: number;
  syncFrequency: string;
  schemaTables: string[];
  dataFreshnessDays: number;
}

export interface CrossSourceValidationResult {
  parcelId: string;
  surveyNumber: string;
  parityScore: number;
  discrepancyCount: number;
  sources: {
    sourceName: string;
    areaSqm: number;
    owner: string;
    boundaryHash: string;
    status: 'Match' | 'Divergent' | 'Missing';
  }[];
  parityChecks: {
    attribute: string;
    revenueVal: string;
    municipalVal: string;
    droneVal: string;
    gnssVal: string;
    status: 'Pass' | 'Flagged';
  }[];
}

export interface CurrentLandInfo {
  parcelId: string;
  surveyNumber: string;
  ulpn: string; // Unique Land Parcel Identification Number (Bhu-Aadhaar)
  ownerName: string;
  aadharLinked: boolean;
  sharePercentage: number;
  landType: string;
  totalAreaSqm: number;
  marketValuationInr: number;
  mutationHistory: {
    mutationNo: string;
    date: string;
    type: 'Sale Deed' | 'Inheritance' | 'Partition' | 'Gift Deed';
    fromParty: string;
    toParty: string;
    orderNumber: string;
    status: 'Certified' | 'In Process';
  }[];
  encumbrance: {
    status: 'Clear / No Lien' | 'Mortgage Active' | 'Court Injunction';
    financialInstitution?: string;
    loanAmountLakhs?: number;
    disputeCaseNumber?: string;
    effectiveDate: string;
  };
  taxAssessment: {
    propertyTaxDueInr: number;
    lastPaymentDate: string;
    status: 'Paid' | 'Outstanding' | 'Exempt';
  };
  zoningPermissibility: {
    masterPlanZone: string;
    allowableFSI: number;
    setbackFrontM: number;
    complianceStatus: 'Compliant' | 'Encroachment Warning';
  };
}

export interface APIRouteSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  category: 'GIS Vector' | 'AI Harmonization' | 'Parcels' | 'Conflicts' | 'ETL Pipeline' | 'OGC GeoServices';
  description: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  sampleRequest?: string;
  sampleResponse: string;
}


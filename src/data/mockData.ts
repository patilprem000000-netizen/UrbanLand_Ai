import { 
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

// Base spatial bounding center: Pune/Indore urban cadastral zone coordinates (normalized relative grid for SVG + real coords)
export const MAP_CENTER_LNG = 73.8567;
export const MAP_CENTER_LAT = 18.5204;

// Generate realistic parcel grid (100+ parcels with distinct geometry)
export const initialParcels: Parcel[] = [];

const ownerNames = [
  'Rajesh Sharma', 'Sunita Patil', 'Vikramaditya Deshmukh', 'Pooja Kulkarni', 
  'Amitabh Joshi', 'Rameshwar Gupta', 'Kavita Verma', 'Sanjay Rathore', 
  'Meenakshi Shinde', 'Anil Kamble', 'Deepak More', 'Sneha Jagtap', 
  'Prakash Bhosale', 'Aparna Godbole', 'Ganesh Chawla', 'Rekha Narang',
  'Sunil Gavaskar', 'Farhan Merchant', 'Kiran Mazumdar', 'Dilip Shanghvi',
  'Rohit Pawar', 'Anita Gaikwad', 'Vijay Salunkhe', 'Manish Agrawal'
];

const landTypes: Parcel['landType'][] = ['Residential', 'Commercial', 'Residential', 'Agricultural', 'Institutional', 'Public Utility'];

// Seed 105 realistic cadastral parcels
for (let row = 0; row < 11; row++) {
  for (let col = 0; col < 10; col++) {
    const idx = row * 10 + col + 1;
    if (idx > 105) break;

    const baseLng = MAP_CENTER_LNG - 0.02 + col * 0.004;
    const baseLat = MAP_CENTER_LAT - 0.015 + row * 0.003;
    const width = 0.0035;
    const height = 0.0026;

    // Add slight geometric variance for realistic cadastral look
    const jitter = ((idx % 7) - 3) * 0.0002;
    const poly: [number, number][] = [
      [baseLng + jitter, baseLat],
      [baseLng + width + jitter, baseLat + (jitter * 0.5)],
      [baseLng + width, baseLat + height + jitter],
      [baseLng, baseLat + height],
      [baseLng + jitter, baseLat]
    ];

    const centroid: [number, number] = [baseLng + width / 2, baseLat + height / 2];
    const area = Math.round(950 + (idx * 27) % 1800);
    const hasConflict = idx === 12 || idx === 25 || idx === 43 || idx === 67 || idx === 89;
    const isNeedsReview = idx === 8 || idx === 19 || idx === 34 || idx === 56 || idx === 78;

    initialParcels.push({
      id: `P-${10200 + idx}`,
      surveyNumber: `${40 + Math.floor(idx / 3)}/${(idx % 4) + 1}${idx % 5 === 0 ? 'A' : ''}`,
      municipalId: `MUN-W4-${8100 + idx}`,
      ownerName: ownerNames[idx % ownerNames.length],
      landType: landTypes[idx % landTypes.length],
      areaSqm: area,
      perimeterM: Math.round(Math.sqrt(area) * 4.2),
      centroid,
      coordinates: poly,
      buildingStatus: idx % 6 === 0 ? 'None' : idx % 9 === 0 ? 'Under Construction' : 'Detected',
      buildingCount: idx % 6 === 0 ? 0 : (idx % 7 === 0 ? 2 : 1),
      revenueStatus: hasConflict ? 'Disputed' : isNeedsReview ? 'Pending Review' : 'Verified',
      verificationStatus: hasConflict ? 'Conflict Detected' : isNeedsReview ? 'Pending Verification' : 'Verified',
      confidenceScore: hasConflict ? 68 : isNeedsReview ? 79 : 92 + (idx % 8),
      confidenceBreakdown: {
        geometry: hasConflict ? 64 : 94,
        location: hasConflict ? 71 : 96,
        area: hasConflict ? 62 : 91,
        attributes: hasConflict ? 75 : 88,
        sourceReliability: hasConflict ? 70 : 95
      },
      sources: {
        revenue: true,
        cadastral: true,
        municipal: idx % 8 !== 0,
        gnss: idx % 3 === 0,
        drone: true
      },
      lastUpdated: `2026-09-${10 + (idx % 18)}`,
      verifiedBy: hasConflict ? undefined : 'S. K. Deshmukh (Verification Officer)',
      verifiedAt: hasConflict ? undefined : `2026-09-${5 + (idx % 15)}`,
      disputeNotes: hasConflict ? 'Boundary mismatch between Revenue Cadastral sheet & 2026 Drone ORI footprint.' : undefined
    });
  }
}

// 60+ AI Detected Buildings
export const initialBuildings: Building[] = [];
for (let i = 0; i < 65; i++) {
  const parcel = initialParcels[i % initialParcels.length];
  const bWidth = 0.0016;
  const bHeight = 0.0012;
  const bLng = parcel.centroid[0] - bWidth / 2;
  const bLat = parcel.centroid[1] - bHeight / 2;

  initialBuildings.push({
    id: `B-00${500 + i}`,
    parcelId: parcel.id,
    areaSqm: Math.round(parcel.areaSqm * 0.38),
    heightM: 7.5 + (i % 6) * 3.2,
    floors: 1 + (i % 4),
    type: parcel.landType === 'Commercial' ? 'Commercial' : 'Residential',
    centroid: [parcel.centroid[0], parcel.centroid[1]],
    coordinates: [
      [bLng, bLat],
      [bLng + bWidth, bLat],
      [bLng + bWidth, bLat + bHeight],
      [bLng, bLat + bHeight],
      [bLng, bLat]
    ],
    confidence: 91 + (i % 8),
    detectionSource: i % 4 === 0 ? 'LiDAR DSM' : 'Drone ORI AI',
    detectedDate: '2026-09-18',
    status: i === 12 ? 'Unauthorized' : i % 7 === 0 ? 'Newly Detected' : 'Verified'
  });
}

// Registered Geospatial Datasets
export const initialDatasets: Dataset[] = [
  {
    id: 'DS-2026-001',
    name: 'Ward 4 Orthorectified Drone Imagery (ORI)',
    sourceType: 'Drone Survey',
    department: 'Urban Land Survey Directorate',
    format: 'GeoTIFF',
    featuresCount: 1420,
    crsOriginal: 'EPSG:4326',
    crsTarget: 'EPSG:32643',
    fileSizeBytes: 482000000,
    uploadedAt: '2026-09-28',
    uploadedBy: 'P. Patil (GIS Officer)',
    status: 'Harmonized',
    confidenceScore: 96,
    topologyErrors: 0,
    extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
  },
  {
    id: 'DS-2026-002',
    name: 'Settlement Cadastral Sheet 2024 Vector Layer',
    sourceType: 'Cadastral',
    department: 'Revenue & Land Records Dept',
    format: 'Shapefile',
    featuresCount: 105,
    crsOriginal: 'EPSG:4326',
    crsTarget: 'EPSG:32643',
    fileSizeBytes: 18400000,
    uploadedAt: '2026-09-24',
    uploadedBy: 'V. Joshi (Revenue Inspector)',
    status: 'Harmonized',
    confidenceScore: 92,
    topologyErrors: 4,
    extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
  },
  {
    id: 'DS-2026-003',
    name: 'Municipal Property Assessment GeoJSON',
    sourceType: 'Municipal',
    department: 'Municipal Corporation Planning Cell',
    format: 'GeoJSON',
    featuresCount: 98,
    crsOriginal: 'EPSG:32643',
    crsTarget: 'EPSG:32643',
    fileSizeBytes: 8200000,
    uploadedAt: '2026-09-26',
    uploadedBy: 'A. Kulkarni (Town Planning)',
    status: 'Validated',
    confidenceScore: 89,
    topologyErrors: 7,
    extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
  },
  {
    id: 'DS-2026-004',
    name: 'CORS RTK Rover GNSS Ground Control Points',
    sourceType: 'GNSS/CORS',
    department: 'Survey of India Collaboration',
    format: 'CSV',
    featuresCount: 36,
    crsOriginal: 'EPSG:4326',
    crsTarget: 'EPSG:32643',
    fileSizeBytes: 420000,
    uploadedAt: '2026-09-27',
    uploadedBy: 'M. Deshmukh (Survey Officer)',
    status: 'Harmonized',
    confidenceScore: 98,
    topologyErrors: 0,
    extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
  },
  {
    id: 'DS-2026-005',
    name: 'Underground Water Supply & Drainage Network',
    sourceType: 'Utility',
    department: 'Water & Sewerage Board',
    format: 'GeoJSON',
    featuresCount: 42,
    crsOriginal: 'EPSG:4326',
    crsTarget: 'EPSG:32643',
    fileSizeBytes: 6500000,
    uploadedAt: '2026-09-20',
    uploadedBy: 'R. Gupta (Utility Engineer)',
    status: 'Ready',
    confidenceScore: 91,
    topologyErrors: 2,
    extent: { minX: 73.83, minY: 18.50, maxX: 73.88, maxY: 18.55 }
  }
];

// Active Spatial Conflicts
export const initialConflicts: SpatialConflict[] = [
  {
    id: 'C-1024',
    parcelId: 'P-10212',
    surveyNumber: '44/2',
    type: 'Boundary Conflict',
    severity: 'High',
    sources: ['Revenue Cadastral', 'Municipal Assessment', 'GNSS CORS'],
    revenueAreaSqm: 1200,
    municipalAreaSqm: 1220,
    gnssAreaSqm: 1205,
    areaDifferenceSqm: 20,
    confidenceScore: 68,
    aiRecommendation: 'Ground verification recommended. Municipal boundary extends 1.4m into southern road reservation buffer.',
    status: 'Pending Review',
    detectedAt: '2026-09-28 11:20 AM'
  },
  {
    id: 'C-1025',
    parcelId: 'P-10225',
    surveyNumber: '48/1A',
    type: 'Building-Parcel Conflict',
    severity: 'High',
    sources: ['Drone ORI', 'Cadastral Vector'],
    revenueAreaSqm: 1450,
    municipalAreaSqm: 1450,
    gnssAreaSqm: 1448,
    areaDifferenceSqm: 18,
    confidenceScore: 64,
    aiRecommendation: 'AI detected structure B-00512 encroaching 0.85m beyond eastern cadastral setback.',
    status: 'Pending Review',
    detectedAt: '2026-09-28 02:45 PM'
  },
  {
    id: 'C-1026',
    parcelId: 'P-10243',
    surveyNumber: '54/3',
    type: 'Area Conflict',
    severity: 'Medium',
    sources: ['Revenue 7/12', 'Drone Survey ORI'],
    revenueAreaSqm: 1800,
    municipalAreaSqm: 1745,
    gnssAreaSqm: 1792,
    areaDifferenceSqm: 55,
    confidenceScore: 73,
    aiRecommendation: 'Accept GNSS RTK survey as ground reference or request sub-division verification.',
    status: 'Pending Review',
    detectedAt: '2026-09-27 09:15 AM'
  },
  {
    id: 'C-1027',
    parcelId: 'P-10267',
    surveyNumber: '62/4B',
    type: 'Ownership Attribute Conflict',
    severity: 'Medium',
    sources: ['Revenue Register', 'Municipal Tax Register'],
    revenueAreaSqm: 1100,
    municipalAreaSqm: 1100,
    gnssAreaSqm: 1100,
    areaDifferenceSqm: 0,
    confidenceScore: 71,
    aiRecommendation: 'Owner name spelled "Sanjay Rathore" in Revenue vs "S. K. Rathore (HUF)" in Municipal records.',
    status: 'Pending Review',
    detectedAt: '2026-09-26 04:30 PM'
  },
  {
    id: 'C-1028',
    parcelId: 'P-10289',
    surveyNumber: '71/1',
    type: 'Utility-Parcel Conflict',
    severity: 'Low',
    sources: ['Water Pipeline GIS', 'Cadastral Layer'],
    revenueAreaSqm: 1620,
    municipalAreaSqm: 1620,
    gnssAreaSqm: 1620,
    areaDifferenceSqm: 0,
    confidenceScore: 82,
    aiRecommendation: 'High-pressure 300mm water conduit passes within 1.2m of perimeter without easement flag.',
    status: 'Pending Review',
    detectedAt: '2026-09-25 10:10 AM'
  }
];

// Verification Tasks for Human in the loop
export const initialVerificationTasks: VerificationTask[] = [
  {
    id: 'VER-102',
    parcelId: 'P-10212',
    surveyNumber: '44/2',
    issue: 'Boundary mismatch between Revenue Cadastral & 2026 Drone ORI',
    severity: 'High',
    aiConfidence: 68,
    aiRecommendation: 'Compare GNSS CORS benchmark with cadastral boundary stone #14.',
    sourceDatasets: ['Cadastral Sheet 2024', 'Drone ORI 2026', 'GNSS CORS GCP'],
    submittedAt: '2026-09-28',
    assignedOfficer: 'S. K. Deshmukh',
    status: 'Pending'
  },
  {
    id: 'VER-103',
    parcelId: 'P-10225',
    surveyNumber: '48/1A',
    issue: 'Encroachment of rooftop polygon into public pathway',
    severity: 'High',
    aiConfidence: 64,
    aiRecommendation: 'Conduct on-site physical tape measurement or drone oblique inspection.',
    sourceDatasets: ['Drone Survey', 'Municipal Master Plan'],
    submittedAt: '2026-09-28',
    assignedOfficer: 'S. K. Deshmukh',
    status: 'Pending'
  },
  {
    id: 'VER-104',
    parcelId: 'P-10243',
    surveyNumber: '54/3',
    issue: 'Area discrepancy: 1,800 sq.m (Revenue) vs 1,745 sq.m (Municipal GIS)',
    severity: 'Medium',
    aiConfidence: 73,
    aiRecommendation: 'Reconcile using latest CORS GNSS perimeter reading of 1,792 sq.m.',
    sourceDatasets: ['Revenue Records', 'Municipal Records', 'GNSS Data'],
    submittedAt: '2026-09-27',
    assignedOfficer: 'P. Kulkarni',
    status: 'Pending'
  }
];

// Topology Issues
export const initialTopologyIssues: TopologyIssue[] = [
  {
    id: 'TOP-01',
    featureId: 'P-10214',
    type: 'Overlap',
    severity: 'Error',
    suggestedAction: 'Snap shared vertex to Parcel P-10215 cadastral boundary.',
    coordinates: [73.858, 18.521],
    status: 'Open'
  },
  {
    id: 'TOP-02',
    featureId: 'P-10228',
    type: 'Gap',
    severity: 'Warning',
    suggestedAction: 'Sliver gap of 0.12 sq.m detected between adjoining survey boundaries.',
    coordinates: [73.861, 18.523],
    status: 'Open'
  },
  {
    id: 'TOP-03',
    featureId: 'P-10245',
    type: 'Self-Intersection',
    severity: 'Error',
    suggestedAction: 'Remove duplicate polygon vertex at coordinate node #5.',
    coordinates: [73.854, 18.519],
    status: 'Auto-Corrected'
  },
  {
    id: 'TOP-04',
    featureId: 'P-10272',
    type: 'Duplicate Geometry',
    severity: 'Warning',
    suggestedAction: 'Merge redundant cadastral split polygon into single parcel id.',
    coordinates: [73.864, 18.525],
    status: 'Open'
  }
];

// Change Detection Events (2024 vs 2026 Drone)
export const initialChangeEvents: ChangeEvent[] = [
  {
    id: 'CHG-001',
    type: 'New Building',
    parcelId: 'P-10218',
    location: [73.8592, 18.5218],
    previousState: 'Vacant Open Land',
    currentState: 'Constructed G+2 Structure (240 sq.m footprint)',
    areaChangeSqm: 240,
    detectedDate: '2026-09-18',
    confidence: 96
  },
  {
    id: 'CHG-002',
    type: 'Boundary Shift',
    parcelId: 'P-10231',
    location: [73.8624, 18.5235],
    previousState: 'Unpaved Hedge Perimeter',
    currentState: 'Masonry Compound Wall aligned +1.1m outward',
    areaChangeSqm: 38,
    detectedDate: '2026-09-19',
    confidence: 88
  },
  {
    id: 'CHG-003',
    type: 'Road Extension',
    parcelId: 'P-10250',
    location: [73.8550, 18.5180],
    previousState: 'Cul-de-sac Dead End',
    currentState: 'Widened 12m Bituminous Arterial Road',
    areaChangeSqm: 420,
    detectedDate: '2026-09-20',
    confidence: 94
  },
  {
    id: 'CHG-004',
    type: 'Demolished Building',
    parcelId: 'P-10204',
    location: [73.8530, 18.5165],
    previousState: 'Industrial Shed (B-00488)',
    currentState: 'Cleared Ground for Redevelopment',
    areaChangeSqm: -310,
    detectedDate: '2026-09-21',
    confidence: 97
  }
];

// GNSS Points
export const initialGNSSPoints: GNSSPoint[] = [
  {
    id: 'GCP-01',
    name: 'Survey Benchmark Stone #01 (Station Pune North)',
    coordinates: [73.8567, 18.5204],
    elevationM: 560.42,
    accuracyCm: 0.8,
    surveyDate: '2026-09-22',
    surveyor: 'M. Deshmukh',
    corsBaseStation: 'PUNE-CORS-01',
    relatedParcelId: 'P-10212',
    status: 'Benchmark'
  },
  {
    id: 'GCP-02',
    name: 'Boundary Triangulation Node #14',
    coordinates: [73.8582, 18.5215],
    elevationM: 561.10,
    accuracyCm: 1.2,
    surveyDate: '2026-09-22',
    surveyor: 'M. Deshmukh',
    corsBaseStation: 'PUNE-CORS-01',
    relatedParcelId: 'P-10213',
    status: 'Verified'
  },
  {
    id: 'GCP-03',
    name: 'Road Intersection Centerline Marker',
    coordinates: [73.8540, 18.5190],
    elevationM: 559.85,
    accuracyCm: 0.6,
    surveyDate: '2026-09-23',
    surveyor: 'M. Deshmukh',
    corsBaseStation: 'PUNE-CORS-01',
    relatedParcelId: 'P-10220',
    status: 'Verified'
  },
  {
    id: 'GCP-04',
    name: 'Sector Drainage Invert Benchmark',
    coordinates: [73.8610, 18.5240],
    elevationM: 558.30,
    accuracyCm: 1.5,
    surveyDate: '2026-09-23',
    surveyor: 'A. Rao',
    corsBaseStation: 'PUNE-CORS-02',
    relatedParcelId: 'P-10235',
    status: 'Benchmark'
  }
];

// Utility Networks
export const initialUtilities: UtilityNetwork[] = [
  {
    id: 'UTL-WTR-01',
    type: 'Water Pipeline',
    lengthM: 1420,
    depthM: 1.8,
    status: 'Active',
    source: 'Municipal Utility Board',
    affectedParcels: ['P-10201', 'P-10202', 'P-10212', 'P-10215'],
    coordinates: [
      [73.836, 18.505],
      [73.845, 18.512],
      [73.856, 18.520],
      [73.870, 18.530]
    ]
  },
  {
    id: 'UTL-ELE-02',
    type: 'Electric Grid',
    lengthM: 2100,
    depthM: 0.9,
    status: 'Active',
    source: 'Municipal Utility Board',
    affectedParcels: ['P-10210', 'P-10211', 'P-10225', 'P-10243'],
    coordinates: [
      [73.838, 18.508],
      [73.848, 18.515],
      [73.858, 18.522],
      [73.868, 18.528]
    ]
  },
  {
    id: 'UTL-DRN-03',
    type: 'Underground Drainage',
    lengthM: 980,
    depthM: 2.4,
    status: 'Active',
    source: 'Municipal Utility Board',
    affectedParcels: ['P-10215', 'P-10216', 'P-10228', 'P-10232'],
    coordinates: [
      [73.840, 18.510],
      [73.850, 18.518],
      [73.860, 18.524]
    ]
  }
];

// Spatial Matches between Cadastral & Revenue
export const initialSpatialMatches: SpatialMatch[] = [
  {
    id: 'M-101',
    sourceDataset: 'Revenue Register Layer',
    targetDataset: 'Cadastral Boundary 2024',
    sourceFeatureId: 'REV-45/1',
    targetFeatureId: 'CAD-10201',
    sourceType: 'Revenue Plot',
    targetType: 'Cadastral Polygon',
    geometrySimilarity: 94,
    areaSimilarity: 97,
    attributeSimilarity: 91,
    centroidDistanceM: 0.42,
    overallConfidence: 94,
    status: 'Strong Match',
    aiReasoning: 'High geometric IoU overlap (94%) with sub-meter centroid distance (0.42m). Survey numbers match exactly.',
    timestamp: '2026-09-28 10:14'
  },
  {
    id: 'M-102',
    sourceDataset: 'Revenue Register Layer',
    targetDataset: 'Cadastral Boundary 2024',
    sourceFeatureId: 'REV-45/2',
    targetFeatureId: 'CAD-10212',
    sourceType: 'Revenue Plot',
    targetType: 'Cadastral Polygon',
    geometrySimilarity: 76,
    areaSimilarity: 82,
    attributeSimilarity: 88,
    centroidDistanceM: 2.85,
    overallConfidence: 78,
    status: 'Requires Review',
    aiReasoning: 'Significant boundary skew observed along southern boundary (2.85m offset). Recommended for human verification.',
    timestamp: '2026-09-28 10:15'
  },
  {
    id: 'M-103',
    sourceDataset: 'Municipal GIS',
    targetDataset: 'Cadastral Boundary 2024',
    sourceFeatureId: 'MUN-W4-8105',
    targetFeatureId: 'CAD-10205',
    sourceType: 'Property Assessment',
    targetType: 'Cadastral Polygon',
    geometrySimilarity: 92,
    areaSimilarity: 95,
    attributeSimilarity: 96,
    centroidDistanceM: 0.65,
    overallConfidence: 93,
    status: 'Strong Match',
    aiReasoning: 'Attributes Owner Name and Address correspond to cadastral survey index with 92% spatial IoU.',
    timestamp: '2026-09-28 10:18'
  }
];

// Audit Trail
export const initialAuditLogs: AuditLog[] = [
  {
    id: 'AUD-901',
    user: 'Prem Patil (GIS Officer)',
    role: 'GIS Officer',
    action: 'Dataset Harmonization Executed',
    datasetOrEntity: 'Ward 4 Orthorectified Drone Imagery (ORI)',
    timestamp: '2026-09-28 15:42:10',
    ipDevice: '10.14.88.22 / Ubuntu GIS Workstation',
    result: 'Success',
    details: 'Harmonized 1,420 features into unified CRS EPSG:32643 UTM Zone 43N'
  },
  {
    id: 'AUD-902',
    user: 'S. K. Deshmukh',
    role: 'Verification Officer',
    action: 'Spatial Conflict Resolved',
    datasetOrEntity: 'Parcel P-10210 / Conflict C-1021',
    timestamp: '2026-09-28 14:18:04',
    ipDevice: '10.14.88.45 / Official Portal Web Client',
    result: 'Success',
    details: 'Accepted GNSS RTK survey as ground authoritative boundary. Updated Parcel P-10210 record.'
  },
  {
    id: 'AUD-903',
    user: 'M. Deshmukh',
    role: 'Survey Officer',
    action: 'GNSS Control Points Uploaded',
    datasetOrEntity: 'CORS RTK Rover Survey Batch #04',
    timestamp: '2026-09-27 11:05:32',
    ipDevice: '10.14.89.12 / Trimble TDC600 Rover',
    result: 'Success',
    details: 'Added 36 millimeter-precision ground control benchmarks linked to CORS base station.'
  },
  {
    id: 'AUD-904',
    user: 'V. Joshi',
    role: 'Revenue Officer',
    action: 'Cadastral 7/12 Ledger Imported',
    datasetOrEntity: 'Settlement Cadastral Sheet 2024',
    timestamp: '2026-09-24 16:50:18',
    ipDevice: '10.14.88.90 / District Revenue Server',
    result: 'Success',
    details: 'Imported 105 digitized agricultural & non-agricultural revenue plots.'
  }
];

// Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Geospatial Harmonization Engine Active',
    message: 'Loaded operational datasets: 105 parcels, 65 buildings, GNSS benchmarks, and conflict resolution cases.',
    type: 'success',
    timestamp: 'Just now',
    read: false
  },
  {
    id: 'NOTIF-02',
    title: '14 Parcels Require Human Verification',
    message: 'AI spatial matching detected low confidence overlap (<75%) on 14 urban plots.',
    type: 'warning',
    timestamp: '15 mins ago',
    read: false,
    linkPage: 'verification'
  },
  {
    id: 'NOTIF-03',
    title: 'New Spatial Conflict Detected',
    message: 'Conflict C-1024 flagged on Parcel P-10212: Revenue vs Municipal boundary discrepancy of 20 sq.m.',
    type: 'alert',
    timestamp: '1 hour ago',
    read: false,
    linkPage: 'conflicts'
  },
  {
    id: 'NOTIF-04',
    title: 'CORS RTK GNSS Ground Control Points Uploaded',
    message: '36 high-precision survey benchmarks synchronized from Survey of India CORS Network.',
    type: 'info',
    timestamp: 'Yesterday',
    read: true,
    linkPage: 'gnss'
  }
];

// Automated ETL Pipeline Jobs
export const initialETLJobs: ETLPipelineJob[] = [
  {
    id: 'ETL-JOB-01',
    name: 'State Revenue e-Dharti 7/12 Ingestion & Sync',
    sourceSystem: 'State Land Records (e-Dharti REST API)',
    targetLayer: 'Unified Cadastral Layer (EPSG:32643)',
    schedule: 'Daily at 02:00 AM IST',
    lastRun: '2026-09-29 02:00:14',
    status: 'Success',
    recordsIngested: 105,
    latencySec: 4.2,
    stages: [
      { name: 'Extract from e-Dharti REST Gateway', status: 'completed', duration: '1.2s' },
      { name: 'Attribute Schema Cleanse & Normalize', status: 'completed', duration: '0.8s' },
      { name: 'CRS Validation & Helmert Reprojection', status: 'completed', duration: '0.9s' },
      { name: 'PostGIS Upsert into Unified Land Table', status: 'completed', duration: '1.3s' }
    ]
  },
  {
    id: 'ETL-JOB-02',
    name: 'Municipal GIS Assessment & Zoning Synchronization',
    sourceSystem: 'Municipal Corporation WFS OGC Server',
    targetLayer: 'Municipal Property Assessment Vector',
    schedule: 'Every 6 Hours',
    lastRun: '2026-09-29 04:00:22',
    status: 'Success',
    recordsIngested: 98,
    latencySec: 3.8,
    stages: [
      { name: 'Extract WFS GetFeature GML3', status: 'completed', duration: '1.4s' },
      { name: 'Polygon Topological Snapping', status: 'completed', duration: '1.1s' },
      { name: 'Harmonize Assessment IDs with Parcels', status: 'completed', duration: '0.7s' },
      { name: 'Commit Transaction into Spatial Store', status: 'completed', duration: '0.6s' }
    ]
  },
  {
    id: 'ETL-JOB-03',
    name: 'Drone Survey Orthomosaic & DSM Ingestion Pipeline',
    sourceSystem: 'GeoTIFF Tile Server / SFTP Hot-Folder',
    targetLayer: 'ORI 5cm GSD Raster & Extracted Polygons',
    schedule: 'Continuous Batch Ingestion',
    lastRun: '2026-09-28 18:30:10',
    status: 'Success',
    recordsIngested: 1420,
    latencySec: 18.5,
    stages: [
      { name: 'GeoTIFF Header Inspection & GDAL Warp', status: 'completed', duration: '4.2s' },
      { name: 'Pyramidal Cloud-Optimized GeoTIFF (COG)', status: 'completed', duration: '6.1s' },
      { name: 'AI Rooftop Segmentation & Footprints', status: 'completed', duration: '5.4s' },
      { name: 'Register Vector Features in GeoServer', status: 'completed', duration: '2.8s' }
    ]
  },
  {
    id: 'ETL-JOB-04',
    name: 'Survey of India CORS Network GNSS RTK Sync',
    sourceSystem: 'Survey of India CORS NTRIP Caster',
    targetLayer: 'Ground Control Points (GCP) Benchmark Layer',
    schedule: 'Hourly Stream Sync',
    lastRun: '2026-09-29 04:30:05',
    status: 'Success',
    recordsIngested: 36,
    latencySec: 1.1,
    stages: [
      { name: 'Stream GNSS Ephemeris & RTK Coordinates', status: 'completed', duration: '0.4s' },
      { name: 'Filter Sub-Centimeter Quality Class (Q=1)', status: 'completed', duration: '0.2s' },
      { name: 'Associate Coordinates to Cadastral Vertices', status: 'completed', duration: '0.3s' },
      { name: 'Spatial Index Update in PostGIS', status: 'completed', duration: '0.2s' }
    ]
  }
];

// Departmental Databases Connectors
export const initialDepartmentalDBs: DepartmentalDatabase[] = [
  {
    id: 'DB-CONN-01',
    name: 'Directorate of Land Records e-Dharti Database',
    department: 'Revenue & Land Records Secretariat',
    connectionType: 'PostgreSQL / PostGIS',
    endpoint: 'postgis://revenue-dlr-core.internal:5432/edharti_master',
    authStatus: 'Connected',
    lastSync: '12 mins ago',
    totalRecords: 12450,
    syncFrequency: 'Real-time Webhook + Hourly Batch',
    schemaTables: ['parcels_revenue_master', 'tenure_ror_712', 'mutation_orders_ledger'],
    dataFreshnessDays: 0
  },
  {
    id: 'DB-CONN-02',
    name: 'Inspector General of Registration (IGR Property Deeds)',
    department: 'Registration & Stamps Department',
    connectionType: 'REST API Connector',
    endpoint: 'https://api.igr-deeds.gov.in/v2/cadastral-encumbrance',
    authStatus: 'Connected',
    lastSync: '28 mins ago',
    totalRecords: 9840,
    syncFrequency: 'Hourly Push Notification',
    schemaTables: ['registered_sale_deeds', 'encumbrance_certificates', 'bank_mortgages'],
    dataFreshnessDays: 0
  },
  {
    id: 'DB-CONN-03',
    name: 'Municipal Corporation Property Assessment GIS',
    department: 'Town Planning & Property Tax Division',
    connectionType: 'OGC WFS/WMS',
    endpoint: 'https://gis.municipal-corp.gov.in/geoserver/wfs',
    authStatus: 'Connected',
    lastSync: '1 hour ago',
    totalRecords: 8720,
    syncFrequency: 'Every 6 Hours',
    schemaTables: ['property_tax_zones', 'building_assessments', 'master_plan_reservations'],
    dataFreshnessDays: 1
  },
  {
    id: 'DB-CONN-04',
    name: 'Survey of India CORS National Geodetic Network',
    department: 'Survey of India, Department of Science & Tech',
    connectionType: 'REST API Connector',
    endpoint: 'https://cors.surveyofindia.gov.in/api/v1/gcp/stations',
    authStatus: 'Connected',
    lastSync: '24 mins ago',
    totalRecords: 1850,
    syncFrequency: 'Continuous Stream',
    schemaTables: ['cors_base_stations', 'rtk_rover_logs', 'geoid_datum_2020'],
    dataFreshnessDays: 0
  },
  {
    id: 'DB-CONN-05',
    name: 'Urban Water Supply & Drainage Utility Spatial Server',
    department: 'Water Supply and Sewerage Board',
    connectionType: 'PostgreSQL / PostGIS',
    endpoint: 'postgis://utility-water-gis.internal:5432/mains_network',
    authStatus: 'Connected',
    lastSync: '4 hours ago',
    totalRecords: 4120,
    syncFrequency: 'Daily Batch Sync',
    schemaTables: ['potable_water_mains', 'underground_drainage', 'easement_buffers'],
    dataFreshnessDays: 1
  }
];

// Current Land Information Records (Bhu-Aadhaar & Mutation Dossiers)
export const initialCurrentLandRecords: Record<string, CurrentLandInfo> = {
  'P-10212': {
    parcelId: 'P-10212',
    surveyNumber: '44/2',
    ulpn: 'IN-27-04-10212-91',
    ownerName: 'Sunita Patil',
    aadharLinked: true,
    sharePercentage: 100,
    landType: 'Residential',
    totalAreaSqm: 1200,
    marketValuationInr: 14400000,
    mutationHistory: [
      {
        mutationNo: 'MUT-2024-8841',
        date: '2024-03-14',
        type: 'Sale Deed',
        fromParty: 'Rameshwar Gupta',
        toParty: 'Sunita Patil',
        orderNumber: 'TEH-ORD-441-2024',
        status: 'Certified'
      },
      {
        mutationNo: 'MUT-2018-3109',
        date: '2018-11-20',
        type: 'Inheritance',
        fromParty: 'Late K. N. Gupta',
        toParty: 'Rameshwar Gupta',
        orderNumber: 'REV-INH-990-2018',
        status: 'Certified'
      }
    ],
    encumbrance: {
      status: 'Clear / No Lien',
      effectiveDate: '2026-09-20'
    },
    taxAssessment: {
      propertyTaxDueInr: 0,
      lastPaymentDate: '2026-06-15',
      status: 'Paid'
    },
    zoningPermissibility: {
      masterPlanZone: 'R-2 High Density Residential',
      allowableFSI: 2.5,
      setbackFrontM: 3.0,
      complianceStatus: 'Compliant'
    }
  },
  'P-10225': {
    parcelId: 'P-10225',
    surveyNumber: '48/1A',
    ulpn: 'IN-27-04-10225-45',
    ownerName: 'Vikramaditya Deshmukh',
    aadharLinked: true,
    sharePercentage: 100,
    landType: 'Commercial',
    totalAreaSqm: 1450,
    marketValuationInr: 29000000,
    mutationHistory: [
      {
        mutationNo: 'MUT-2021-5012',
        date: '2021-08-10',
        type: 'Sale Deed',
        fromParty: 'Apex Urban Developers Ltd',
        toParty: 'Vikramaditya Deshmukh',
        orderNumber: 'SDR-REG-8012-2021',
        status: 'Certified'
      }
    ],
    encumbrance: {
      status: 'Mortgage Active',
      financialInstitution: 'State Bank of India (Commercial Branch)',
      loanAmountLakhs: 85.0,
      effectiveDate: '2021-09-01'
    },
    taxAssessment: {
      propertyTaxDueInr: 14200,
      lastPaymentDate: '2025-12-10',
      status: 'Outstanding'
    },
    zoningPermissibility: {
      masterPlanZone: 'C-1 Commercial Retail & Office',
      allowableFSI: 3.0,
      setbackFrontM: 4.5,
      complianceStatus: 'Encroachment Warning'
    }
  },
  'P-10243': {
    parcelId: 'P-10243',
    surveyNumber: '54/3',
    ulpn: 'IN-27-04-10243-18',
    ownerName: 'Rajesh Sharma',
    aadharLinked: true,
    sharePercentage: 50,
    landType: 'Agricultural (Proposed NA Conversion)',
    totalAreaSqm: 1800,
    marketValuationInr: 16200000,
    mutationHistory: [
      {
        mutationNo: 'MUT-2015-1024',
        date: '2015-04-22',
        type: 'Partition',
        fromParty: 'Joint Family Khata #45',
        toParty: 'Rajesh Sharma & Brother',
        orderNumber: 'SUB-DIV-104-2015',
        status: 'Certified'
      }
    ],
    encumbrance: {
      status: 'Clear / No Lien',
      effectiveDate: '2026-09-25'
    },
    taxAssessment: {
      propertyTaxDueInr: 0,
      lastPaymentDate: '2026-05-18',
      status: 'Paid'
    },
    zoningPermissibility: {
      masterPlanZone: 'Urban Peripheral Agricultural Belt',
      allowableFSI: 0.5,
      setbackFrontM: 6.0,
      complianceStatus: 'Compliant'
    }
  }
};

// Cross-Source Multi-Layer Validations
export const initialCrossSourceValidations: CrossSourceValidationResult[] = [
  {
    parcelId: 'P-10212',
    surveyNumber: '44/2',
    parityScore: 84,
    discrepancyCount: 1,
    sources: [
      { sourceName: 'Revenue 7/12 Ledger', areaSqm: 1200, owner: 'Sunita Patil', boundaryHash: 'HASH-REV-44-2', status: 'Match' },
      { sourceName: 'Cadastral Settlement Vector', areaSqm: 1200, owner: 'Sunita Patil', boundaryHash: 'HASH-CAD-44-2', status: 'Match' },
      { sourceName: 'Municipal Property Assessment', areaSqm: 1220, owner: 'Sunita Patil', boundaryHash: 'HASH-MUN-44-2', status: 'Divergent' },
      { sourceName: 'Drone ORI Rooftop Vector', areaSqm: 1205, owner: 'Sunita Patil', boundaryHash: 'HASH-DRO-44-2', status: 'Match' },
      { sourceName: 'CORS RTK Rover Survey GCP', areaSqm: 1205, owner: 'Sunita Patil', boundaryHash: 'HASH-GCP-44-2', status: 'Match' },
      { sourceName: 'Underground Water Utility GIS', areaSqm: 1200, owner: 'Sunita Patil', boundaryHash: 'HASH-UTL-44-2', status: 'Match' }
    ],
    parityChecks: [
      { attribute: 'Boundary Alignment (IoU)', revenueVal: 'Standard (Ref)', municipalVal: 'Shifted +1.4m south', droneVal: 'Matches revenue stone', gnssVal: '0.8cm precision align', status: 'Flagged' },
      { attribute: 'Calculated Surface Area', revenueVal: '1,200 sq.m', municipalVal: '1,220 sq.m (+20m²)', droneVal: '1,205 sq.m', gnssVal: '1,205 sq.m', status: 'Flagged' },
      { attribute: 'Owner Name String', revenueVal: 'Sunita Patil', municipalVal: 'Sunita Patil', droneVal: 'N/A (Spatial only)', gnssVal: 'S. Patil (Verified)', status: 'Pass' },
      { attribute: 'Land Use Classification', revenueVal: 'Residential', municipalVal: 'Residential (Zone R-2)', droneVal: 'Constructed G+1 House', gnssVal: 'Built Structure node', status: 'Pass' },
      { attribute: 'Utility Buffer Clearance', revenueVal: 'Clear', municipalVal: 'Clear', droneVal: '3.2m from road curb', gnssVal: 'Clear of 300mm pipe', status: 'Pass' }
    ]
  },
  {
    parcelId: 'P-10225',
    surveyNumber: '48/1A',
    parityScore: 78,
    discrepancyCount: 2,
    sources: [
      { sourceName: 'Revenue 7/12 Ledger', areaSqm: 1450, owner: 'Vikramaditya Deshmukh', boundaryHash: 'HASH-REV-48-1A', status: 'Match' },
      { sourceName: 'Cadastral Settlement Vector', areaSqm: 1450, owner: 'Vikramaditya Deshmukh', boundaryHash: 'HASH-CAD-48-1A', status: 'Match' },
      { sourceName: 'Municipal Property Assessment', areaSqm: 1450, owner: 'V. Deshmukh', boundaryHash: 'HASH-MUN-48-1A', status: 'Match' },
      { sourceName: 'Drone ORI Rooftop Vector', areaSqm: 1468, owner: 'Vikramaditya Deshmukh', boundaryHash: 'HASH-DRO-48-1A', status: 'Divergent' },
      { sourceName: 'CORS RTK Rover Survey GCP', areaSqm: 1448, owner: 'Vikramaditya Deshmukh', boundaryHash: 'HASH-GCP-48-1A', status: 'Match' },
      { sourceName: 'Electric Grid GIS Corridor', areaSqm: 1450, owner: 'Vikramaditya Deshmukh', boundaryHash: 'HASH-UTL-48-1A', status: 'Divergent' }
    ],
    parityChecks: [
      { attribute: 'Setback / Footprint Encroach', revenueVal: 'No building flag', municipalVal: 'Approved G+2 Plan', droneVal: 'Encroaching 0.85m east', gnssVal: 'Compound stone mismatch', status: 'Flagged' },
      { attribute: 'High-Voltage Corridor Buffer', revenueVal: 'Clear', municipalVal: 'Not flagged', droneVal: 'Rooftop within 1.5m wire', gnssVal: 'Transformer pole node #8', status: 'Flagged' },
      { attribute: 'Calculated Surface Area', revenueVal: '1,450 sq.m', municipalVal: '1,450 sq.m', droneVal: '1,468 sq.m (+18m²)', gnssVal: '1,448 sq.m', status: 'Pass' },
      { attribute: 'Title Deed Synchronization', revenueVal: 'Active Mortgage', municipalVal: 'Commercial Tax Zone', droneVal: 'Active Retail Store', gnssVal: 'Corner boundary stone', status: 'Pass' }
    ]
  }
];

// Unified GIS + API Platform Route Specifications
export const initialAPIRoutes: APIRouteSpec[] = [
  {
    id: 'API-01',
    method: 'GET',
    endpoint: '/api/v1/parcels/{id}',
    category: 'Parcels',
    description: 'Fetch harmonized statutory parcel record including 5-source validation breakdown and CRS geometry in GeoJSON.',
    params: [
      { name: 'id', type: 'string', required: true, desc: 'Unique Parcel Identifier (e.g. P-10212 or ULPN)' },
      { name: 'crs', type: 'string', required: false, desc: 'Target EPSG projection (default: EPSG:32643)' }
    ],
    sampleResponse: JSON.stringify({
      status: "success",
      data: {
        parcel_id: "P-10212",
        ulpn: "IN-27-04-10212-91",
        survey_number: "44/2",
        owner_name: "Sunita Patil",
        area_sqm: 1205.0,
        crs: "EPSG:32643",
        confidence_score: 96.4,
        source_parity: "Verified",
        contributing_sources: ["Revenue 7/12", "Cadastral 2024", "CORS GNSS", "Drone ORI 5cm"]
      }
    }, null, 2)
  },
  {
    id: 'API-02',
    method: 'POST',
    endpoint: '/api/v1/crs/transform',
    category: 'GIS Vector',
    description: 'Automated on-the-fly coordinate reference system transformation and geodetic datum shift with RMSE validation.',
    params: [
      { name: 'source_crs', type: 'string', required: true, desc: 'Input CRS (e.g. EPSG:4326)' },
      { name: 'target_crs', type: 'string', required: true, desc: 'Target CRS (e.g. EPSG:32643)' },
      { name: 'features', type: 'GeoJSON', required: true, desc: 'FeatureCollection of vector points or polygons' }
    ],
    sampleRequest: JSON.stringify({
      source_crs: "EPSG:4326",
      target_crs: "EPSG:32643",
      geometry_type: "Polygon",
      coordinates: [[[73.856, 18.520], [73.859, 18.520], [73.859, 18.523], [73.856, 18.523], [73.856, 18.520]]]
    }, null, 2),
    sampleResponse: JSON.stringify({
      status: "transformed",
      transformation_engine: "PROJ 9.4 / PyProj",
      helmert_params: "dx=0.0, dy=0.0, dz=0.0",
      rmse_error_meters: 0.038,
      target_crs: "EPSG:32643 (WGS 84 / UTM Zone 43N)",
      projected_extent: { min_x: 379240.2, min_y: 2047890.1, max_x: 379550.8, max_y: 2048210.4 }
    }, null, 2)
  },
  {
    id: 'API-03',
    method: 'POST',
    endpoint: '/api/v1/ai/spatial-match',
    category: 'AI Harmonization',
    description: 'Run deep learning spatial IoU, Hausdorff distance, and semantic attribute similarity to match entities across datasets.',
    params: [
      { name: 'dataset_a_id', type: 'string', required: true, desc: 'Source Dataset ID' },
      { name: 'dataset_b_id', type: 'string', required: true, desc: 'Target Dataset ID' },
      { name: 'iou_threshold', type: 'float', required: false, desc: 'Minimum IoU overlap threshold (default: 0.70)' }
    ],
    sampleResponse: JSON.stringify({
      status: "completed",
      matches_found: 92,
      mean_confidence: 94.2,
      conflicts_flagged: 7,
      execution_time_ms: 1420
    }, null, 2)
  },
  {
    id: 'API-04',
    method: 'POST',
    endpoint: '/api/v1/etl/trigger-sync',
    category: 'ETL Pipeline',
    description: 'Trigger asynchronous multi-departmental ETL ingestion pipeline job with automated validation and load.',
    params: [
      { name: 'job_id', type: 'string', required: true, desc: 'ETL Job Identifier (e.g. ETL-JOB-01)' }
    ],
    sampleResponse: JSON.stringify({
      job_id: "ETL-JOB-01",
      status: "queued",
      estimated_duration_sec: 4.5,
      worker_id: "gis-etl-worker-04"
    }, null, 2)
  },
  {
    id: 'API-05',
    method: 'GET',
    endpoint: '/geoserver/wfs?service=WFS&request=GetFeature&typeName=bhusync:parcels_unified',
    category: 'OGC GeoServices',
    description: 'OGC WFS 2.0.0 compliance service for streaming vector geometry directly into QGIS, ArcGIS, or MapLibre.',
    params: [
      { name: 'srsName', type: 'string', required: false, desc: 'EPSG standard (default: EPSG:32643)' },
      { name: 'outputFormat', type: 'string', required: false, desc: 'application/json, GML3, or shape-zip' }
    ],
    sampleResponse: JSON.stringify({
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::32643" } },
      totalFeatures: 105,
      features: [
        {
          type: "Feature",
          id: "P-10212",
          geometry: { type: "Polygon", coordinates: [[[379240, 2047890], [379275, 2047890], [379275, 2047925], [379240, 2047925], [379240, 2047890]]] },
          properties: { survey_number: "44/2", owner: "Sunita Patil", land_use: "Residential", area_sqm: 1205 }
        }
      ]
    }, null, 2)
  }
];


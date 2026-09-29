import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { DatasetSourceType, DatasetFormat } from '../types/gis';
import { 
  UploadCloud, 
  FileCheck, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  GitBranch, 
  Layers, 
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';

export const DataUploadPage: React.FC = () => {
  const { uploadDataset, navigateTo, showToast } = useGIS();

  const [selectedSourceType, setSelectedSourceType] = useState<DatasetSourceType>('Drone Survey');
  const [selectedFormat, setSelectedFormat] = useState<DatasetFormat>('GeoTIFF');
  const [datasetTitle, setDatasetTitle] = useState('Ward 4 Sector 18 Drone Photogrammetry Orthomosaic');
  const [department, setDepartment] = useState('Directorate of Urban Land Survey');
  const [targetCRS, setTargetCRS] = useState('EPSG:32643');

  // Simulation pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [duplicatesFixed, setDuplicatesFixed] = useState(false);

  const steps = [
    { num: 1, title: 'File Upload', desc: 'Uploading multipart geospatial binary package' },
    { num: 2, title: 'File Validation', desc: 'Verifying geometry integrity and header metadata' },
    { num: 3, title: 'CRS Detection', desc: 'Identified source projection: EPSG:4326 (WGS 84)' },
    { num: 4, title: 'Coordinate Transformation', desc: 'Projecting to EPSG:32643 (UTM Zone 43N Easting/Northing)' },
    { num: 5, title: 'Schema Detection', desc: 'Extracting attribute column definitions and data types' },
    { num: 6, title: 'Data Harmonization', desc: 'Mapping raw schema into statutory unified land ledger' },
    { num: 7, title: 'AI Analysis', desc: 'Running spatial indexing, footprint detection & boundary matching' },
    { num: 8, title: 'Ready for Integration', desc: 'Geospatial layer ready for WebGIS deployment' }
  ];

  const handleStartUpload = () => {
    setIsProcessing(true);
    setUploadComplete(false);
    setCurrentStep(1);
    setProgressPercent(10);

    const stepIntervals = [
      { step: 2, pct: 25, delay: 500 },
      { step: 3, pct: 40, delay: 1000 },
      { step: 4, pct: 55, delay: 1600 },
      { step: 5, pct: 70, delay: 2100 },
      { step: 6, pct: 82, delay: 2600 },
      { step: 7, pct: 93, delay: 3100 },
      { step: 8, pct: 100, delay: 3600 },
    ];

    stepIntervals.forEach(({ step, pct, delay }) => {
      setTimeout(() => {
        setCurrentStep(step);
        setProgressPercent(pct);
        if (step === 8) {
          setIsProcessing(false);
          setUploadComplete(true);
          uploadDataset({
            name: datasetTitle,
            sourceType: selectedSourceType,
            format: selectedFormat,
            department,
            crsOriginal: 'EPSG:4326',
            crsTarget: targetCRS,
            featuresCount: selectedSourceType === 'Drone Survey' ? 1284 : 105,
          });
        }
      }, delay);
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Upload Geospatial Dataset
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              8-Step Automated Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ingest and harmonize drone survey imagery, cadastral maps, revenue sheets, GNSS points, and municipal GIS layers.
          </p>
        </div>

        <button
          onClick={() => {
            // Quick preset demo fill
            setSelectedSourceType('Drone Survey');
            setSelectedFormat('GeoTIFF');
            setDatasetTitle('Sector 18 High-Resolution Drone Orthomosaic (5cm GSD)');
            handleStartUpload();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Sample Ingestion</span>
        </button>
      </div>

      {/* STEP 1: CONFIGURATION FORM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Dataset Ingestion Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Dataset Title / Identifier
              </label>
              <input
                type="text"
                value={datasetTitle}
                onChange={(e) => setDatasetTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Geospatial Source Type
                </label>
                <select
                  value={selectedSourceType}
                  onChange={(e) => setSelectedSourceType(e.target.value as DatasetSourceType)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Drone Survey">Drone Survey (UAV / Photogrammetry)</option>
                  <option value="ORI">Orthorectified Imagery (ORI)</option>
                  <option value="DSM">Digital Surface Model (DSM)</option>
                  <option value="DTM">Digital Terrain Model (DTM)</option>
                  <option value="Cadastral">Cadastral Vector Settlement Map</option>
                  <option value="Revenue">Revenue Record Ledger (7/12 & Khatauni)</option>
                  <option value="Municipal">Municipal Property Tax GIS</option>
                  <option value="Utility">Utility Network Infrastructure</option>
                  <option value="GNSS/CORS">GNSS / CORS RTK Rover Points</option>
                  <option value="Ground Truth">Ground Truth (GT) Benchmarks</option>
                  <option value="Building Footprints">Building Footprints Layer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  File Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as DatasetFormat)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                >
                  <option value="GeoTIFF">GeoTIFF (.tif / .tiff)</option>
                  <option value="GeoJSON">GeoJSON (.geojson / .json)</option>
                  <option value="Shapefile">ESRI Shapefile Archive (.zip)</option>
                  <option value="GPKG">OGC GeoPackage (.gpkg)</option>
                  <option value="KML">Keyhole Markup Language (.kml / .kmz)</option>
                  <option value="CSV">Survey Coordinate Delimited (.csv)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Issuing Department / Agency
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Target Harmonized CRS
                </label>
                <select
                  value={targetCRS}
                  onChange={(e) => setTargetCRS(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                >
                  <option value="EPSG:32643">EPSG:32643 — WGS 84 / UTM Zone 43N (Standard)</option>
                  <option value="EPSG:32644">EPSG:32644 — WGS 84 / UTM Zone 44N</option>
                  <option value="EPSG:4326">EPSG:4326 — WGS 84 Geographic 2D</option>
                </select>
              </div>
            </div>

            {/* Drag & drop simulated box */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50 dark:bg-slate-800/40">
              <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Drag and drop your geospatial file here, or click to browse
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports GeoTIFF, Shapefile (zip), GeoJSON, CSV, KML, GPKG up to 2GB per package
              </p>
            </div>

            <button
              onClick={handleStartUpload}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Stage {currentStep} of 8 ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Begin Automated Ingestion & Harmonization</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP PIPELINE TRACKER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Processing Pipeline
            </h3>
            <span className="font-mono text-xs font-semibold text-blue-600">
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-3 pt-2">
            {steps.map(s => {
              const isPast = currentStep > s.num || uploadComplete;
              const isCurrent = currentStep === s.num && !uploadComplete;

              return (
                <div key={s.num} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] ${
                    isPast 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : isCurrent 
                      ? 'bg-blue-600 text-white animate-pulse' 
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}>
                    {isPast ? '✓' : s.num}
                  </div>
                  <div>
                    <span className={`font-semibold block ${isPast || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {s.title}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      {s.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 13: DATA VALIDATION REPORT & SECTION 14: CRS TRANSFORM DISPLAY */}
      {uploadComplete && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Data Validation & Georeferencing Report
                </h3>
                <p className="text-[11px] text-slate-500">
                  Automated geometric, CRS and attribute verification completed.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">
              96% Integrity Score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Validation Findings */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-md border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Quality Checks
              </span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>File syntax readable and valid GeoTIFF / Vector container.</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Geometries closed without self-intersecting loops.</span>
                </div>
                <div className={`flex items-center gap-2 ${duplicatesFixed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {duplicatesFixed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{duplicatesFixed ? '12 duplicate boundaries snapped and deduplicated.' : '12 duplicate sub-parcel features detected.'}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>4 municipal tax IDs mapped from revenue survey index.</span>
                </div>
              </div>

              {!duplicatesFixed && (
                <button
                  onClick={() => {
                    setDuplicatesFixed(true);
                    showToast('12 duplicate geometries merged into primary parcel indices.');
                  }}
                  className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Fix Automatically (Deduplicate & Snap Vertices) →
                </button>
              )}
            </div>

            {/* Coordinate Transformation (Section 14) */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-md border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-sans block">
                CRS Transformation Status
              </span>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans">Source CRS:</span>
                <span className="text-slate-900 dark:text-white font-bold">EPSG:4326 (WGS 84 Geographic)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans">Target Unified CRS:</span>
                <span className="text-blue-600 font-bold">EPSG:32643 (UTM Zone 43N)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans">Bounding Box:</span>
                <span className="text-slate-700 dark:text-slate-300">X: 379200–381400 | Y: 2047000–2049200</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-sans">Transformation Error:</span>
                <span className="text-emerald-600 font-bold">RMS &lt; 0.04m (Sub-centimeter)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => navigateTo('datasets')}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View in Dataset Registry
            </button>
            <button
              onClick={() => navigateTo('gis-map')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Inspect on WebGIS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

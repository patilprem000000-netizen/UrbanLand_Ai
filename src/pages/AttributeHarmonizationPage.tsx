import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  CheckCircle2, 
  Table, 
  Database,
  RefreshCw
} from 'lucide-react';

interface SchemaMapping {
  id: string;
  sourceField: string;
  targetField: string;
  unifiedField: string;
  confidence: number;
  status: 'Accepted' | 'Pending' | 'Rejected';
  dataType: string;
}

export const AttributeHarmonizationPage: React.FC = () => {
  const { showToast, addAuditLog } = useGIS();

  const [mappings, setMappings] = useState<SchemaMapping[]>([
    { id: 'MAP-1', sourceField: 'OWNER_NAME', targetField: 'OWNER', unifiedField: 'Owner_Name', confidence: 98, status: 'Accepted', dataType: 'VARCHAR(120)' },
    { id: 'MAP-2', sourceField: 'SURVEY_NO', targetField: 'PLOT_NUMBER', unifiedField: 'Survey_Number', confidence: 95, status: 'Accepted', dataType: 'VARCHAR(40)' },
    { id: 'MAP-3', sourceField: 'LAND_AREA', targetField: 'AREA_SQM', unifiedField: 'Land_Area', confidence: 96, status: 'Accepted', dataType: 'FLOAT8 (sq.m)' },
    { id: 'MAP-4', sourceField: 'PROPERTY_TYPE', targetField: 'LAND_USE', unifiedField: 'Land_Type', confidence: 91, status: 'Accepted', dataType: 'ENUM (Zoning)' },
    { id: 'MAP-5', sourceField: 'MUNICIPAL_WARD', targetField: 'WARD_ID', unifiedField: 'Municipal_ID', confidence: 89, status: 'Pending', dataType: 'VARCHAR(32)' },
    { id: 'MAP-6', sourceField: 'STRUCTURE_FLAG', targetField: 'BLDG_EXIST', unifiedField: 'Building_ID', confidence: 87, status: 'Pending', dataType: 'VARCHAR(40)' },
  ]);

  const handleAccept = (id: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, status: 'Accepted' } : m));
    showToast(`Field mapping approved.`);
  };

  const handleReject = (id: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, status: 'Rejected' } : m));
    showToast(`Field mapping rejected.`);
  };

  const handleApplyAll = () => {
    setMappings(prev => prev.map(m => ({ ...m, status: 'Accepted' })));
    addAuditLog('Attribute Schema Harmonized', 'Unified Land Record Schema', 'Success', 'Approved 6 cross-departmental attribute mappings');
    showToast('All attribute mappings accepted and propagated into unified database schema.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Intelligent Attribute Mapping & Harmonization
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Semantic Field Alignment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile disparate column nomenclatures across Revenue, Municipal, and Cadastral database tables into a single statutory schema.
          </p>
        </div>

        <button
          onClick={handleApplyAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Accept All AI Suggested Mappings</span>
        </button>
      </div>

      {/* SCHEMA MAPPING TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Cross-Dataset Field Correspondences
            </h3>
            <p className="text-xs text-slate-500">
              Dataset A (Revenue 7/12) ↔ Dataset B (Municipal Assessment Layer)
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">
            6 AI Suggestions
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Dataset A Column</th>
                <th className="py-3 px-2 text-center"></th>
                <th className="py-3 px-4">Dataset B Column</th>
                <th className="py-3 px-2 text-center"></th>
                <th className="py-3 px-4">Unified Statutory Field</th>
                <th className="py-3 px-3 font-mono">Data Type</th>
                <th className="py-3 px-3 font-mono text-right">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mappings.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {m.sourceField}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5 mx-auto text-slate-400" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {m.targetField}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5 mx-auto text-blue-600" />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {m.unifiedField}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {m.dataType}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-emerald-600">
                    {m.confidence}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      m.status === 'Accepted' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : m.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAccept(m.id)}
                        disabled={m.status === 'Accepted'}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(m.id)}
                        disabled={m.status === 'Rejected'}
                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-medium hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UNIFIED SCHEMA PREVIEW (SECTION 19) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Unified Statutory Parcel Schema Definition
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">PostgreSQL / PostGIS Target Standard</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {[
            { col: 'Parcel_ID', type: 'VARCHAR(32)', primary: true },
            { col: 'Survey_Number', type: 'VARCHAR(40)' },
            { col: 'Owner_Name', type: 'VARCHAR(160)' },
            { col: 'Land_Area', type: 'FLOAT8 (sq.m)' },
            { col: 'Land_Type', type: 'VARCHAR(40)' },
            { col: 'Municipal_ID', type: 'VARCHAR(32)' },
            { col: 'Building_ID', type: 'VARCHAR(32)' },
            { col: 'Geometry', type: 'GEOMETRY(POLYGON, 32643)' },
            { col: 'Source', type: 'VARCHAR(64)' },
            { col: 'Confidence', type: 'NUMERIC(5,2)' },
            { col: 'Last_Updated', type: 'TIMESTAMPTZ' },
            { col: 'Audit_Hash', type: 'SHA256' },
          ].map(field => (
            <div key={field.col} className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className={`font-bold block ${field.primary ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>
                {field.col}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">{field.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

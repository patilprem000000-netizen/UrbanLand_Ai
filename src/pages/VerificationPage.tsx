import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { VerificationTask } from '../types/gis';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const VerificationPage: React.FC = () => {
  const { 
    verificationTasks, 
    approveVerification, 
    rejectVerification, 
    requestGroundSurvey, 
    setSelectedParcelId, 
    navigateTo,
    showToast 
  } = useGIS();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(verificationTasks[0]?.id || 'VER-102');
  const [reviewNote, setReviewNote] = useState('');

  const activeTask = verificationTasks.find(t => t.id === selectedTaskId) || verificationTasks[0];
  const pendingCount = verificationTasks.filter(t => t.status === 'Pending').length;

  const handleApprove = (id: string) => {
    approveVerification(id, reviewNote);
    setReviewNote('');
  };

  const handleReject = (id: string) => {
    rejectVerification(id, reviewNote);
    setReviewNote('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Human-in-the-Loop Statutory Verification Queue
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
              {pendingCount} Pending Officer Sign-Off
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory review of uncertain automated boundary alignments (&lt;80% AI confidence) requiring verification officer endorsement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Mandate: Section 44(A) Land Revenue Code
          </span>
        </div>
      </div>

      {/* ACTIVE VERIFICATION DOSSIER DETAIL */}
      {activeTask && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-base text-blue-600">
                  {activeTask.id}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Verification Review for Parcel {activeTask.parcelId}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  activeTask.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {activeTask.severity} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Survey Number: #{activeTask.surveyNumber} · Assigned Officer: {activeTask.assignedOfficer}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                activeTask.status === 'Approved' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : activeTask.status === 'Rejected'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {activeTask.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Preview */}
            <div className="lg:col-span-7">
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-72">
                <WebGISMap 
                  heightClass="h-full" 
                  showLayerPanel={false}
                  highlightParcelId={activeTask.parcelId}
                />
              </div>
            </div>

            {/* Dossier notes & actions */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Identified Anomaly
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {activeTask.issue}
                </p>

                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                  <span className="text-slate-500">AI Confidence:</span>
                  <span className="font-bold text-amber-600">{activeTask.aiConfidence}%</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-md space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Recommendation for Officer</span>
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  {activeTask.aiRecommendation}
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Contributing Sources: {activeTask.sourceDatasets.join(', ')}
                </div>
              </div>

              {/* Action buttons if Pending */}
              {activeTask.status === 'Pending' ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter statutory verification notes or survey orders..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleApprove(activeTask.id)}
                      className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-center transition-colors shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => requestGroundSurvey(activeTask.id, true)}
                      className="py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-center transition-colors shadow-xs"
                    >
                      <span>Field Survey</span>
                    </button>
                    <button
                      onClick={() => handleReject(activeTask.id)}
                      className="py-2 px-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded font-semibold text-center transition-colors"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  Status: {activeTask.status} by Assigned Officer
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION QUEUE TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Pending Human Verification Queue ({verificationTasks.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">Select task to review details</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-3">Parcel & Survey</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-3 font-mono text-right">AI Score</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Assigned Officer</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {verificationTasks.map(t => {
                const isSelected = activeTask?.id === t.id;
                return (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTaskId(t.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/70 dark:bg-amber-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {t.id}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{t.parcelId}</span>
                      <span className="text-[10px] text-slate-500 block">Survey #{t.surveyNumber}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {t.issue}
                    </td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-amber-600">
                      {t.aiConfidence}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        t.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {t.assignedOfficer}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        t.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : t.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskId(t.id);
                        }}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        Review Task
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

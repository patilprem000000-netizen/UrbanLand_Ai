import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { SAMPLE_USERS } from '../services/authService';
import { UserRole } from '../types/gis';
import { Shield, Sparkles, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, navigateTo, showToast, addAuditLog } = useGIS();

  const [email, setEmail] = useState('gis@bhusync.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('GIS Officer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = SAMPLE_USERS[selectedRole];
    setCurrentUser(user);
    addAuditLog('User Login', user.role, 'Success', `Logged into BhuSync AI as ${user.name}`);
    showToast(`Welcome back, ${user.name} (${user.role})`);
    navigateTo('dashboard');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const user = SAMPLE_USERS[role];
    setCurrentUser(user);
    addAuditLog('Quick Demo Login', role, 'Success', `Demo login as ${user.name}`);
    showToast(`Logged in as ${role}: ${user.name}`);
    navigateTo('dashboard');
  };

  const roles: { role: UserRole; desc: string; dept: string }[] = [
    { role: 'Administrator', desc: 'System governance, user access & audit trail oversight', dept: 'Land Records & IT Directorate' },
    { role: 'GIS Officer', desc: 'Drone photogrammetry, CRS reprojection & AI pipelines', dept: 'Geospatial Data Division' },
    { role: 'Survey Officer', desc: 'GNSS CORS RTK field benchmarks & ground truthing', dept: 'Survey of India' },
    { role: 'Revenue Officer', desc: '7/12 Land registry, Khatauni & legal title records', dept: 'Sub-Divisional Revenue Office' },
    { role: 'Municipal Officer', desc: 'Property tax assessment & town planning zoning', dept: 'Municipal Corporation Planning Cell' },
    { role: 'Verification Officer', desc: 'Statutory dispute arbitration & reconciliation sign-off', dept: 'Dispute Reconciliation Board' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Portal Header pill */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authoritative Land Governance Portal</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-lg">
            B
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            BHUSYNC AI
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Statutory Multi-Source Geospatial Land Harmonization Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-800 sm:rounded-lg sm:px-8 space-y-6">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Official Government Email
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designated Operational Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="block w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                {roles.map(r => (
                  <option key={r.role} value={r.role}>
                    {r.role} — {r.dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-xs"
              >
                Sign In to Platform
              </button>
            </div>
          </form>

          {/* Quick Demo Role Picker Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Instant Demo Access (One-Click Role Selection)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">No password required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map(item => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(item.role)}
                  className="p-2.5 text-left rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.role}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Protected by Digital Personal Data Protection Act compliance protocols.
        </p>
      </div>
    </div>
  );
};

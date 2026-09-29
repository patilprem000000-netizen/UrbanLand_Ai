import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { UserRole, User } from '../types/gis';
import { SAMPLE_USERS } from '../services/authService';
import { Users, Plus, Shield, Check, Lock, X } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { showToast, addAuditLog, switchRole } = useGIS();
  const [usersList, setUsersList] = useState<User[]>(Object.values(SAMPLE_USERS));
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('GIS Officer');
  const [newUserDept, setNewUserDept] = useState('Urban Geospatial Survey Wing');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-3)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      badgeNumber: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
      active: true,
      lastLogin: 'Never'
    };

    setUsersList(prev => [...prev, newUser]);
    setAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    addAuditLog('Created User Account', `${newUser.name} (${newUser.role})`, 'Success', 'Added new officer with role-based permissions');
    showToast(`Officer account created for ${newUser.name}.`);
  };

  const toggleUserStatus = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    showToast('User authorization status updated.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              User Access & Role-Based Access Control (RBAC)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Statutory RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authorize departmental survey officers, verification magistrates, and revenue inspectors with granular geospatial edit permissions.
          </p>
        </div>

        <button
          onClick={() => setAddUserModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Authorize New Officer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Officer Name & Badge</th>
                <th className="py-3 px-3">Official Email</th>
                <th className="py-3 px-3">Designated Role</th>
                <th className="py-3 px-4">Department / Cell</th>
                <th className="py-3 px-3 font-mono">Last Active</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{u.badgeNumber} · {u.id}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {u.email}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {u.department}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {u.lastLogin}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {u.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => switchRole(u.role)}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 rounded font-semibold text-[11px]"
                      >
                        Assume Role
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      >
                        {u.active ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Authorize New Officer</span>
              <button onClick={() => setAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. N. Patil"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. spatil@bhusync.ai"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Designated Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="GIS Officer">GIS Officer</option>
                  <option value="Survey Officer">Survey Officer</option>
                  <option value="Revenue Officer">Revenue Officer</option>
                  <option value="Municipal Officer">Municipal Officer</option>
                  <option value="Verification Officer">Verification Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Create Officer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

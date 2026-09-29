import React, { useState, useRef, useEffect } from 'react';
import { useGIS } from '../../services/gisContext';
import { UserRole } from '../../types/gis';
import { 
  Search, 
  Bell, 
  Shield, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  MapPin, 
  Building, 
  AlertTriangle, 
  Database, 
  Check, 
  User as UserIcon,
  Layers
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    searchQuery, 
    setSearchQuery, 
    parcels, 
    buildings, 
    conflicts, 
    datasets, 
    notifications,
    setSelectedParcelId,
    setSelectedConflictId,
    navigateTo,
    resetAllDemoData
  } = useGIS();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter search results across categories
  const filteredParcels = searchQuery.trim() 
    ? parcels.filter(p => 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3) 
    : [];

  const filteredBuildings = searchQuery.trim()
    ? buildings.filter(b => b.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  const filteredConflicts = searchQuery.trim()
    ? conflicts.filter(c => c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  const filteredDatasets = searchQuery.trim()
    ? datasets.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  const hasSearchResults = 
    filteredParcels.length > 0 || 
    filteredBuildings.length > 0 || 
    filteredConflicts.length > 0 || 
    filteredDatasets.length > 0;

  const roles: UserRole[] = [
    'Administrator',
    'GIS Officer',
    'Survey Officer',
    'Revenue Officer',
    'Municipal Officer',
    'Verification Officer'
  ];

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center justify-between px-4 lg:px-6 shadow-xs">
      {/* ZONE 1: BRAND TITLE WORDMARK */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigateTo('dashboard')} 
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-8 h-8 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-base shadow-xs">
            U
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-display">
                UrbanLand AI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                Gov WebGIS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden md:block">
              One Map · One Record · Land Information System
            </p>
          </div>
        </button>
      </div>

      {/* ZONE 2: GLOBAL SEARCH */}
      <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Parcel ID (P-10245), Survey No (45/2), Owner, Conflict (C-1024)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* INSTANT CATEGORIZED SEARCH RESULTS DROPDOWN */}
        {searchFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl p-2 z-50 text-xs">
            {!hasSearchResults ? (
              <p className="text-slate-500 py-3 text-center text-xs">No matching records found for "{searchQuery}"</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredParcels.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Land Parcels
                    </span>
                    {filteredParcels.map(p => (
                      <button
                        key={p.id}
                        onMouseDown={() => {
                          setSelectedParcelId(p.id);
                          navigateTo('parcels');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold font-mono text-slate-900 dark:text-white">{p.id}</span>
                          <span className="text-slate-500">· Survey #{p.surveyNumber}</span>
                          <span className="text-slate-400">({p.ownerName})</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600">{p.areaSqm} m²</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredConflicts.length > 0 && (
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Spatial Conflicts
                    </span>
                    {filteredConflicts.map(c => (
                      <button
                        key={c.id}
                        onMouseDown={() => {
                          setSelectedConflictId(c.id);
                          navigateTo('conflicts');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between text-red-600"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          <span className="font-semibold font-mono">{c.id}</span>
                          <span className="text-slate-600 dark:text-slate-300">· {c.type}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Parcel {c.parcelId}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredBuildings.length > 0 && (
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Buildings Footprints
                    </span>
                    {filteredBuildings.map(b => (
                      <button
                        key={b.id}
                        onMouseDown={() => {
                          setSelectedParcelId(b.parcelId);
                          navigateTo('buildings');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-slate-600" />
                          <span className="font-mono font-medium">{b.id}</span>
                          <span className="text-slate-500">· Parcel {b.parcelId}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{b.areaSqm} m²</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredDatasets.length > 0 && (
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Geospatial Datasets
                    </span>
                    {filteredDatasets.map(d => (
                      <button
                        key={d.id}
                        onMouseDown={() => {
                          navigateTo('datasets');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-medium">{d.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{d.format}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ZONE 3: ACTIONS, ROLES, NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Reset State */}
        <button
          onClick={resetAllDemoData}
          title="Reset Demo Baseline"
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">System Notifications</span>
                <span className="text-[10px] text-slate-400">{unreadNotifs} unread</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      if (n.linkPage) navigateTo(n.linkPage as any);
                      setNotifDropdownOpen(false);
                    }}
                    className="p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline font-mono">{currentUser?.role || 'Select Role'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Operational Role
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                    currentUser?.role === r 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser?.role === r && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Officer Avatar / Profile */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
          <img 
            src="/src/assets/images/avatar_officer_1790678176682.jpg" 
            alt={currentUser?.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight truncate max-w-[120px]">
              {currentUser?.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              {currentUser?.badgeNumber}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

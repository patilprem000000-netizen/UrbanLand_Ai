import React from 'react';
import { GISProvider, useGIS } from './services/gisContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { GISMapPage } from './pages/GISMapPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { AIFeatureExtractionPage } from './pages/AIFeatureExtractionPage';
import { SpatialMatchingPage } from './pages/SpatialMatchingPage';
import { AttributeHarmonizationPage } from './pages/AttributeHarmonizationPage';
import { TopologyCheckerPage } from './pages/TopologyCheckerPage';
import { ChangeDetectionPage } from './pages/ChangeDetectionPage';
import { ConflictsPage } from './pages/ConflictsPage';
import { VerificationPage } from './pages/VerificationPage';
import { ParcelManagementPage } from './pages/ParcelManagementPage';
import { BuildingManagementPage } from './pages/BuildingManagementPage';
import { RevenueRecordsPage } from './pages/RevenueRecordsPage';
import { MunicipalGISPage } from './pages/MunicipalGISPage';
import { UtilityLayersPage } from './pages/UtilityLayersPage';
import { GNSSSurveyPage } from './pages/GNSSSurveyPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { CRSTransformationPage } from './pages/CRSTransformationPage';
import { ETLPipelinePage } from './pages/ETLPipelinePage';
import { CurrentLandInfoPage } from './pages/CurrentLandInfoPage';
import { CrossSourceValidationPage } from './pages/CrossSourceValidationPage';
import { DepartmentalDatabasesPage } from './pages/DepartmentalDatabasesPage';
import { APIPlatformPage } from './pages/APIPlatformPage';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, toastMessage } = useGIS();

  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'gis-map':
        return <GISMapPage />;
      case 'data-upload':
        return <DataUploadPage />;
      case 'datasets':
        return <DatasetsPage />;
      case 'crs-transform':
        return <CRSTransformationPage />;
      case 'etl-pipeline':
        return <ETLPipelinePage />;
      case 'ai-features':
        return <AIFeatureExtractionPage />;
      case 'spatial-matching':
        return <SpatialMatchingPage />;
      case 'attribute-mapping':
        return <AttributeHarmonizationPage />;
      case 'topology-checker':
        return <TopologyCheckerPage />;
      case 'change-detection':
        return <ChangeDetectionPage />;
      case 'conflicts':
      case 'conflict-detail':
        return <ConflictsPage />;
      case 'verification':
        return <VerificationPage />;
      case 'current-land-info':
        return <CurrentLandInfoPage />;
      case 'cross-source-validation':
        return <CrossSourceValidationPage />;
      case 'departmental-dbs':
        return <DepartmentalDatabasesPage />;
      case 'api-platform':
        return <APIPlatformPage />;
      case 'parcels':
        return <ParcelManagementPage />;
      case 'buildings':
        return <BuildingManagementPage />;
      case 'revenue-records':
        return <RevenueRecordsPage />;
      case 'municipal-gis':
        return <MunicipalGISPage />;
      case 'utilities':
        return <UtilityLayersPage />;
      case 'gnss-survey':
        return <GNSSSurveyPage />;
      case 'reports':
        return <ReportsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Topbar Contract */}
      <Topbar />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-6">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-16 lg:bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GISProvider>
      <AppContent />
    </GISProvider>
  );
}

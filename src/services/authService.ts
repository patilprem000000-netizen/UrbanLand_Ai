import { User, UserRole } from '../types/gis';

export const SAMPLE_USERS: Record<UserRole, User> = {
  'Administrator': {
    id: 'USR-001',
    name: 'Dr. Anand Kelkar',
    email: 'admin@bhusync.ai',
    role: 'Administrator',
    department: 'Directorate of Land Records & IT Mission',
    badgeNumber: 'DLR-ADMIN-01',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-29 08:30 AM'
  },
  'GIS Officer': {
    id: 'USR-002',
    name: 'Prem Patil',
    email: 'gis@bhusync.ai',
    role: 'GIS Officer',
    department: 'Urban Geospatial Data & Photogrammetry Division',
    badgeNumber: 'GIS-OP-44',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-29 09:12 AM'
  },
  'Survey Officer': {
    id: 'USR-003',
    name: 'M. Deshmukh',
    email: 'survey@bhusync.ai',
    role: 'Survey Officer',
    department: 'Survey of India / District Cadastral Survey Office',
    badgeNumber: 'SURV-INSP-89',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-28 04:20 PM'
  },
  'Revenue Officer': {
    id: 'USR-004',
    name: 'V. Joshi (Tehsildar)',
    email: 'revenue@bhusync.ai',
    role: 'Revenue Officer',
    department: 'Sub-Divisional Revenue Secretariat',
    badgeNumber: 'REV-TEH-12',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-28 02:15 PM'
  },
  'Municipal Officer': {
    id: 'USR-005',
    name: 'A. Kulkarni',
    email: 'municipal@bhusync.ai',
    role: 'Municipal Officer',
    department: 'Municipal Town Planning & Property Tax Cell',
    badgeNumber: 'MUN-PLAN-55',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-27 11:45 AM'
  },
  'Verification Officer': {
    id: 'USR-006',
    name: 'S. K. Deshmukh',
    email: 'verify@bhusync.ai',
    role: 'Verification Officer',
    department: 'Statutory Land Dispute & Boundary Reconciliation Board',
    badgeNumber: 'VER-MAG-03',
    avatarUrl: '/src/assets/images/avatar_officer_1790678176682.jpg',
    active: true,
    lastLogin: '2026-09-29 07:50 AM'
  }
};

// =====================================================
// CONSTANTS
// Application-wide constants for CTsync
// =====================================================

import { ActivityEvent } from './types';

// Activity feed mock data (will be replaced with real blockchain events)
export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'a1', type: 'RESOLVED', user: 'city_admin', issueTitle: 'POTHOLE_MAIN_ST', severity: 'High', timestamp: '2m' },
  { id: 'a2', type: 'REPORTED', user: 'concerned_citizen', issueTitle: 'BROKEN_STREETLIGHT', timestamp: '5m' },
  { id: 'a3', type: 'UNDER_REVIEW', user: 'ward_inspector', issueTitle: 'GRAFFITI_PARK', severity: 'Medium', timestamp: '12m' },
  { id: 'a4', type: 'RESOLVED', user: 'public_works', issueTitle: 'WATER_LEAK', severity: 'High', timestamp: '22m' },
];

// Severity levels for issues
export const SEVERITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

// Issue status types
export const ISSUE_STATUS = {
  OPEN: 'Open',
  UNDER_REVIEW: 'Under Review',
  RESOLVED: 'Resolved',
} as const;

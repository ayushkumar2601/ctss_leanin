// =====================================================
// CONSTANTS
// Application-wide constants (mock data removed)
// =====================================================

import { ActivityEvent } from './types';

// Activity feed mock data (will be replaced with real blockchain events in Phase 3)
export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'a1', type: 'SALE', user: 'rekt_saver', nftTitle: 'VOID_01', price: 0.5, timestamp: '2m' },
  { id: 'a2', type: 'MINT', user: 'pixel_drifter', nftTitle: 'NEON_LUNG', timestamp: '5m' },
  { id: 'a3', type: 'BID', user: 'whale_hunter', nftTitle: 'ARTIFACT_Z', price: 4.2, timestamp: '12m' },
  { id: 'a4', type: 'SALE', user: 'ghost_cat', nftTitle: 'PINK_NOISE', price: 0.12, timestamp: '22m' },
];

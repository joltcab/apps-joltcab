import { create } from 'zustand';
import api from '../services/api';

interface UserStats {
  trips_completed: number;
  money_saved: number;
  average_rating: number;
  wallet_balance: number;
  negotiated_trips: number;
  total_spent: number;
}

interface StatsState {
  stats: UserStats | null;
  loading: boolean;
  fetchStats: (userUid: string) => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: null,
  loading: false,

  fetchStats: async (userUid: string) => {
    set({ loading: true });
    try {
      console.log('📊 Fetching user stats...');
      const response = await api.post('/user/stats', {
        user_uid: userUid
      });

      if (response.data.success && response.data.stats) {
        console.log('✅ Stats loaded:', response.data.stats);
        set({ stats: response.data.stats, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load stats');
      set({ loading: false });
    }
  },
}));
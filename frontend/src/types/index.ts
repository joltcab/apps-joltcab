export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'user' | 'driver' | 'admin';
  profile_image?: string;
  wallet_balance: number;
  created_at: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Trip {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_location: Location;
  dropoff_location: Location;
  status: 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled';
  payment_method: 'cash' | 'card' | 'wallet';
  fare: number;
  distance: number;
  duration?: number;
  rating?: number;
  review?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balance_after: number;
  created_at: string;
}

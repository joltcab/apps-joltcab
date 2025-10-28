export interface User {
  uid?: string; // Alias for user_id for backward compatibility
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_phone_code?: string;
  country?: string;
  wallet: number;
  picture?: string;
  token?: string;
  device_type?: string;
  created_at?: string;
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

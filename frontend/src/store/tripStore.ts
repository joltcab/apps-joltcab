import { create } from 'zustand';
import api from '../services/api';
import { Trip } from '../types';

interface TripState {
  currentTrip: Trip | null;
  trips: Trip[];
  loading: boolean;
  createTrip: (pickupLocation: any, dropoffLocation: any, paymentMethod: string) => Promise<Trip>;
  getTrips: () => Promise<void>;
  getTripById: (id: string) => Promise<Trip>;
  rateTrip: (tripId: string, rating: number, review?: string) => Promise<void>;
  cancelTrip: (tripId: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  currentTrip: null,
  trips: [],
  loading: false,

  createTrip: async (pickupLocation, dropoffLocation, paymentMethod) => {
    set({ loading: true });
    try {
      const response = await api.post('/trips', {
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        payment_method: paymentMethod
      });
      set({ currentTrip: response.data, loading: false });
      return response.data;
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.response?.data?.detail || 'Failed to create trip');
    }
  },

  getTrips: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/trips');
      set({ trips: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  getTripById: async (id: string) => {
    try {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get trip');
    }
  },

  rateTrip: async (tripId: string, rating: number, review?: string) => {
    try {
      await api.post(`/trips/${tripId}/rate`, { trip_id: tripId, rating, review });
      await get().getTrips();
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to rate trip');
    }
  },

  cancelTrip: async (tripId: string) => {
    try {
      await api.post(`/trips/${tripId}/cancel`);
      set({ currentTrip: null });
      await get().getTrips();
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to cancel trip');
    }
  },

  setCurrentTrip: (trip: Trip | null) => {
    set({ currentTrip: trip });
  },
}));

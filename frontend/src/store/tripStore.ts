import { create } from 'zustand';
import api from '../services/api';
import { Trip } from '../types';

interface TripState {
  currentTrip: Trip | null;
  trips: Trip[];
  loading: boolean;
  createTrip: (userUid: string, userName: string, userLocation: any, destinationLocation: any, paymentMethod: string) => Promise<Trip>;
  getTrips: (userUid: string) => Promise<void>;
  getTripById: (rideId: string) => Promise<Trip>;
  rateTrip: (rideId: string, userUid: string, rating: number, review?: string) => Promise<void>;
  cancelTrip: (rideId: string, userUid: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  currentTrip: null,
  trips: [],
  loading: false,

  createTrip: async (userUid, userName, userLocation, destinationLocation, paymentMethod) => {
    set({ loading: true });
    try {
      console.log('🚗 Creating ride in joltcab.com...');
      const response = await api.post('/create_ride', {
        user_uid: userUid,
        user_name: userName,
        user_location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: userLocation.address
        },
        destination_location: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
          address: destinationLocation.address
        },
        payment_method: paymentMethod
      });
      
      if (response.data.success) {
        console.log('✅ Ride created:', response.data.ride_id);
        const trip = {
          id: response.data.ride_id,
          user_id: userUid,
          driver_id: response.data.driver_uid || undefined,
          pickup_location: userLocation,
          dropoff_location: destinationLocation,
          status: response.data.status || 'requested',
          payment_method: paymentMethod,
          fare: response.data.fare,
          distance: response.data.distance,
          created_at: response.data.created_at || new Date().toISOString()
        } as Trip;
        
        set({ currentTrip: trip, loading: false });
        return trip;
      } else {
        throw new Error('Failed to create ride');
      }
    } catch (error: any) {
      console.error('❌ Create ride failed:', error.response?.data?.message || error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.message || 'Failed to create trip');
    }
  },

  getTrips: async (userUid: string) => {
    set({ loading: true });
    try {
      console.log('📋 Fetching rides from joltcab.com...');
      const response = await api.get(`/user_rides?user_uid=${userUid}`);
      
      if (response.data.success) {
        const trips = response.data.rides.map((ride: any) => ({
          id: ride.ride_id,
          user_id: ride.user_uid,
          driver_id: ride.driver_uid || undefined,
          pickup_location: ride.user_location ? {
            latitude: ride.user_location._latitude || ride.user_location.latitude,
            longitude: ride.user_location._longitude || ride.user_location.longitude,
            address: ride.user_location.address || 'Pickup location'
          } : undefined,
          dropoff_location: {
            latitude: ride.destination_location._latitude || ride.destination_location.latitude,
            longitude: ride.destination_location._longitude || ride.destination_location.longitude,
            address: ride.destination_address
          },
          status: ride.status,
          payment_method: ride.payment_method || 'card',
          fare: ride.fare,
          distance: ride.distance,
          rating: ride.rating,
          review: ride.review,
          created_at: ride.created_at
        }));
        
        console.log(`✅ Loaded ${trips.length} rides`);
        set({ trips, loading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load rides');
      set({ loading: false });
    }
  },

  getTripById: async (rideId: string) => {
    try {
      console.log('🔍 Fetching ride details...');
      const response = await api.get(`/ride_details?ride_id=${rideId}`);
      
      if (response.data.success) {
        const ride = response.data.ride;
        return {
          id: ride.ride_id,
          user_id: ride.user_uid,
          driver_id: ride.driver_uid,
          pickup_location: ride.user_location,
          dropoff_location: {
            latitude: ride.destination_location._latitude || ride.destination_location.latitude,
            longitude: ride.destination_location._longitude || ride.destination_location.longitude,
            address: ride.destination_address
          },
          status: ride.status,
          payment_method: ride.payment_method,
          fare: ride.fare,
          distance: ride.distance,
          created_at: ride.created_at
        } as Trip;
      }
      throw new Error('Ride not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get trip');
    }
  },

  rateTrip: async (rideId: string, userUid: string, rating: number, review?: string) => {
    try {
      console.log('⭐ Rating ride...');
      await api.post('/rate_ride', {
        ride_id: rideId,
        user_uid: userUid,
        rating,
        review
      });
      console.log('✅ Rating submitted');
      await get().getTrips(userUid);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to rate trip');
    }
  },

  cancelTrip: async (rideId: string, userUid: string) => {
    try {
      console.log('❌ Cancelling ride...');
      await api.post('/cancel_ride', {
        ride_id: rideId,
        user_uid: userUid
      });
      console.log('✅ Ride cancelled');
      set({ currentTrip: null });
      await get().getTrips(userUid);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel trip');
    }
  },

  setCurrentTrip: (trip: Trip | null) => {
    set({ currentTrip: trip });
  },
}));

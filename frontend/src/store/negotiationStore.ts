import { create } from 'zustand';
import api from '../services/api';

interface Offer {
  offer_id: string;
  driver_id: string;
  driver_name: string;
  driver_rating: number;
  offered_price: number;
  message: string;
  created_at: string;
  expires_at: string;
}

interface NegotiationState {
  currentNegotiation: any | null;
  offers: Offer[];
  loading: boolean;
  createNegotiableTrip: (userUid: string, userName: string, pickupLocation: any, destinationLocation: any, suggestedPrice: number) => Promise<any>;
  getOffers: (tripId: string) => Promise<void>;
  acceptOffer: (tripId: string, offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
}

export const useNegotiationStore = create<NegotiationState>((set, get) => ({
  currentNegotiation: null,
  offers: [],
  loading: false,

  createNegotiableTrip: async (userUid, userName, pickupLocation, destinationLocation, suggestedPrice) => {
    set({ loading: true });
    try {
      console.log('💰 Creating negotiable trip...');
      const response = await api.post('/trip/negotiable/create', {
        user_uid: userUid,
        user_name: userName,
        pickup_location: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          address: pickupLocation.address
        },
        destination_location: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
          address: destinationLocation.address
        },
        suggested_price: suggestedPrice,
        negotiable: true
      });

      if (response.data.success) {
        console.log('✅ Negotiable trip created:', response.data.trip_id);
        set({ currentNegotiation: response.data, loading: false });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create negotiable trip');
      }
    } catch (error: any) {
      console.error('❌ Create negotiable trip failed:', error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.message || 'Failed to create negotiable trip');
    }
  },

  getOffers: async (tripId: string) => {
    try {
      console.log('📋 Fetching offers...');
      const response = await api.post('/trip/offers/list', {
        trip_id: tripId
      });

      if (response.data.success && response.data.offers) {
        console.log(`✅ Loaded ${response.data.offers.length} offers`);
        set({ offers: response.data.offers });
      }
    } catch (error) {
      console.error('❌ Failed to load offers');
    }
  },

  acceptOffer: async (tripId: string, offerId: string) => {
    try {
      console.log('✅ Accepting offer...');
      const response = await api.post('/trip/offer/accept', {
        trip_id: tripId,
        offer_id: offerId
      });

      if (response.data.success) {
        console.log('✅ Offer accepted!');
        set({ currentNegotiation: null, offers: [] });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to accept offer');
    }
  },

  rejectOffer: async (offerId: string) => {
    try {
      console.log('❌ Rejecting offer...');
      await api.post('/trip/offer/reject', {
        offer_id: offerId
      });
      
      // Remove from local list
      set(state => ({
        offers: state.offers.filter(o => o.offer_id !== offerId)
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject offer');
    }
  },
}));

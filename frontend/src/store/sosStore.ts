import { create } from 'zustand';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSState {
  emergencyContacts: EmergencyContact[];
  panicActive: boolean;
  loading: boolean;
  activatePanic: (tripId: string, userId: string, location: any) => Promise<void>;
  loadContacts: (userId: string) => Promise<void>;
  addContact: (userId: string, contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeContact: (contactId: string) => Promise<void>;
}

export const useSOSStore = create<SOSState>((set) => ({
  emergencyContacts: [],
  panicActive: false,
  loading: false,

  activatePanic: async (tripId, userId, location) => {
    try {
      console.log('🚨 Activating SOS...');
      set({ panicActive: true });
      
      const response = await api.post('/emergency/panic', {
        trip_id: tripId,
        user_id: userId,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        emergency_type: 'panic_button',
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        console.log('✅ SOS activated successfully');
        // SOS permanece activo hasta que se resuelva
      } else {
        set({ panicActive: false });
        throw new Error('Failed to activate SOS');
      }
    } catch (error: any) {
      console.error('❌ SOS activation failed:', error.message);
      set({ panicActive: false });
      throw error;
    }
  },

  loadContacts: async (userId) => {
    set({ loading: true });
    try {
      console.log('📋 Loading emergency contacts...');
      const response = await api.get(`/emergency/contacts?user_id=${userId}`);

      if (response.data.success && response.data.contacts) {
        console.log(`✅ Loaded ${response.data.contacts.length} contacts`);
        set({ emergencyContacts: response.data.contacts, loading: false });
      } else {
        // Load from local storage as fallback
        const stored = await AsyncStorage.getItem('emergency_contacts');
        if (stored) {
          set({ emergencyContacts: JSON.parse(stored), loading: false });
        } else {
          set({ emergencyContacts: [], loading: false });
        }
      }
    } catch (error) {
      console.error('❌ Load contacts failed');
      set({ emergencyContacts: [], loading: false });
    }
  },

  addContact: async (userId, contact) => {
    try {
      console.log('➕ Adding emergency contact...');
      const response = await api.post('/emergency/contacts/add', {
        user_id: userId,
        ...contact
      });

      if (response.data.success) {
        const newContact: EmergencyContact = {
          id: response.data.contact_id || Date.now().toString(),
          ...contact
        };
        set(state => ({
          emergencyContacts: [...state.emergencyContacts, newContact]
        }));
        
        // Save to local storage
        const contacts = [...get().emergencyContacts];
        await AsyncStorage.setItem('emergency_contacts', JSON.stringify(contacts));
        
        console.log('✅ Contact added');
      }
    } catch (error: any) {
      console.error('❌ Add contact failed:', error.message);
      throw error;
    }
  },

  removeContact: async (contactId) => {
    try {
      await api.post('/emergency/contacts/remove', {
        contact_id: contactId
      });

      set(state => ({
        emergencyContacts: state.emergencyContacts.filter(c => c.id !== contactId)
      }));

      // Update local storage
      const contacts = [...get().emergencyContacts];
      await AsyncStorage.setItem('emergency_contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Failed to remove contact');
      throw error;
    }
  },
}));
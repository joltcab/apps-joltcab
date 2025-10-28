import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,

  login: async (emailOrPhone: string, password: string) => {
    set({ loading: true });
    try {
      console.log('🔐 Attempting login...');
      
      // Detectar si es email o teléfono
      const isEmail = emailOrPhone.includes('@');
      const loginData = isEmail 
        ? { email: emailOrPhone, password }
        : { phone: emailOrPhone, password };
      
      console.log('📧 Login type:', isEmail ? 'Email' : 'Phone');
      
      const response = await api.post('/api/auth/login', loginData);
      const { access_token, user } = response.data;
      
      console.log('✅ Login successful:', user.email);
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: access_token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.detail || error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  register: async (email: string, password: string, full_name: string, phone: string) => {
    set({ loading: true });
    try {
      console.log('📝 Attempting registration...');
      const response = await api.post('/api/auth/register', {
        email,
        password,
        full_name,
        phone,
        role: 'user'
      });
      const { access_token, user } = response.data;
      
      console.log('✅ Registration successful:', user.email);
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: access_token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.detail || error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log('🔄 Loading user profile...');
        const response = await api.get('/api/auth/me');
        console.log('✅ User profile loaded:', response.data.email);
        set({ user: response.data, token, isAuthenticated: true, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load user profile');
      await get().logout();
      set({ loading: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      console.log('📝 Updating profile...');
      const response = await api.put('/api/auth/profile', data);
      console.log('✅ Profile updated');
      set({ user: response.data });
    } catch (error: any) {
      console.error('❌ Profile update failed:', error.response?.data?.detail || error.message);
      throw new Error(error.response?.data?.detail || 'Update failed');
    }
  },
}));

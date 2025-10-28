import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, phone: string, password: string, countryCode: string, country: string) => Promise<void>;
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
      console.log('🔐 Attempting login with joltcab.com...');
      
      // Detectar si es email o teléfono
      const isEmail = emailOrPhone.includes('@');
      const loginData = {
        email: isEmail ? emailOrPhone : '',
        phone: isEmail ? '' : emailOrPhone,
        password,
        device_type: 'web',
        login_by: 'manual'
      };
      
      console.log('📧 Login type:', isEmail ? 'Email' : 'Phone');
      
      const response = await api.post('/userslogin', loginData);
      
      if (response.data.success) {
        const { token, user_id, first_name, last_name, email, phone, wallet, picture } = response.data;
        
        const user: User = {
          uid: user_id, // Add uid for compatibility
          user_id,
          first_name,
          last_name,
          email,
          phone,
          wallet: wallet || 0,
          picture,
          token
        };
        
        console.log('✅ Login successful:', user.email, 'User ID:', user.user_id);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        set({ user, token, isAuthenticated: true, loading: false });
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (firstName: string, lastName: string, email: string, phone: string, password: string, countryCode: string = '+1', country: string = 'United States') => {
    set({ loading: true });
    try {
      console.log('📝 Attempting registration with joltcab.com...');
      
      const registerData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        country_phone_code: countryCode,
        country,
        password,
        login_by: 'manual',
        device_type: 'web'
      };
      
      const response = await api.post('/userregister', registerData);
      
      if (response.data.success) {
        const { token, user_id, first_name, last_name, email, phone, wallet, picture } = response.data;
        
        const user: User = {
          user_id,
          first_name,
          last_name,
          email,
          phone: phone || '',
          wallet: wallet || 0,
          picture,
          token,
          country_phone_code: countryCode,
          country
        };
        
        console.log('✅ Registration successful:', user.email);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        set({ user, token, isAuthenticated: true, loading: false });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      set({ loading: false });
      throw new Error(error.response?.data?.message || 'Registration failed');
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
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        console.log('✅ User loaded from storage:', user.email);
        set({ user, token, isAuthenticated: true, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load user');
      await get().logout();
      set({ loading: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      console.log('📝 Updating profile...');
      // TODO: Implement profile update endpoint when available
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
        console.log('✅ Profile updated locally');
      }
    } catch (error: any) {
      console.error('❌ Profile update failed:', error.message);
      throw new Error('Update failed');
    }
  },
}));

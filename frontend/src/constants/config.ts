import Constants from 'expo-constants';

// FORCE PRODUCTION MODE - Always use joltcab.com
const ENV = 'production';

const config = {
  development: {
    API_URL: 'http://localhost:5000',
    SOCKET_URL: 'http://localhost:5000',
    USE_API_PREFIX: true,
  },
  production: {
    API_URL: 'https://joltcab.com',
    SOCKET_URL: 'https://joltcab.com',
    USE_API_PREFIX: true,
  },
};

// Get current config based on environment
const currentConfig = config[ENV as keyof typeof config] || config.production;

export const API_CONFIG = {
  BASE_URL: currentConfig.API_URL,
  SOCKET_URL: currentConfig.SOCKET_URL,
  TIMEOUT: 30000,
  USE_API_PREFIX: currentConfig.USE_API_PREFIX,
};

// API Endpoints
export const ENDPOINTS = {
  // Modern Auth API
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  UPDATE_PROFILE: '/api/auth/profile',
  
  // Legacy Auth (if needed)
  USER_LOGIN: '/user_login',
  PROVIDER_LOGIN: '/provider_login',
  
  // Trips
  GET_TRIPS: '/api/trips',
  CREATE_TRIP: '/api/trips',
  GET_TRIP: (id: string) => `/api/trips/${id}`,
  RATE_TRIP: (id: string) => `/api/trips/${id}/rate`,
  CANCEL_TRIP: (id: string) => `/api/trips/${id}/cancel`,
  
  // Wallet
  GET_BALANCE: '/api/wallet/balance',
  GET_TRANSACTIONS: '/api/wallet/transactions',
  TOPUP_WALLET: '/api/wallet/topup',
  
  // Payments
  CREATE_PAYMENT_INTENT: '/api/payments/create-intent',
  
  // Health
  HEALTH: '/api/health',
};

export const GOOGLE_MAPS_API_KEY = {
  ios: 'AIzaSyBUcfd1xbONq2LMKAAprsoRlBGPJQ2wkaM',
  android: 'AIzaSyDL8niceH8TH3jfMrV89UXat5NQeUuZQC4',
};

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51K4e7jLM1u3hGW9xjCIlayeJttpwjzPtci7lAMWc8V0pLPuE5LihmGS2OC4vMXihkDAFs24k9GPlpafcX1LNpfJB00D8elSce3';

// Helper to log current environment
console.log('🚀 JoltCab Environment:', ENV);
console.log('🌐 API URL:', API_CONFIG.BASE_URL);
console.log('🔌 Socket URL:', API_CONFIG.SOCKET_URL);
console.log('✅ Configured for joltcab.com production');

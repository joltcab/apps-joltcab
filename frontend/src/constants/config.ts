import Constants from 'expo-constants';

export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
};

export const GOOGLE_MAPS_API_KEY = {
  ios: 'AIzaSyBUcfd1xbONq2LMKAAprsoRlBGPJQ2wkaM',
  android: 'AIzaSyDL8niceH8TH3jfMrV89UXat5NQeUuZQC4'
};

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51K4e7jLM1u3hGW9xjCIlayeJttpwjzPtci7lAMWc8V0pLPuE5LihmGS2OC4vMXihkDAFs24k9GPlpafcX1LNpfJB00D8elSce3';

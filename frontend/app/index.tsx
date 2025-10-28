import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { loadUser, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      console.log('🚀 Initializing app...');
      await loadUser();
      
      // Wait a bit to show splash, then navigate
      setTimeout(() => {
        const isAuth = useAuthStore.getState().isAuthenticated;
        const currentUser = useAuthStore.getState().user;
        
        console.log('🔍 Auth Status:', isAuth);
        console.log('👤 User:', currentUser?.email || 'No user');
        
        if (isAuth && currentUser) {
          console.log('✅ Redirecting to home...');
          router.replace('/(tabs)/home');
        } else {
          console.log('⚠️ Redirecting to onboarding...');
          router.replace('/onboarding');
        }
      }, 1500);
    };

    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

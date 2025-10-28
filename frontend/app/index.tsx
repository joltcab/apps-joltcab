import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding');
        }
      }, 2000);
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

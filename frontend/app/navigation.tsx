import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { useTripStore } from '../src/store/tripStore';
import { Button } from '../src/components/Button';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { openNavigation, isNavigationAppInstalled } from '../src/utils/navigation';

type NavigationApp = 'waze' | 'google' | 'apple';

interface NavOption {
  id: NavigationApp;
  name: string;
  icon: string;
  color: string;
  installed: boolean;
}

export default function NavigationScreen() {
  const { currentTrip } = useTripStore();
  const [navOptions, setNavOptions] = useState<NavOption[]>([
    { id: 'google', name: 'Google Maps', icon: 'map', color: '#4285F4', installed: false },
    { id: 'waze', name: 'Waze', icon: 'navigate-circle', color: '#00D8FF', installed: false },
    { id: 'apple', name: 'Apple Maps', icon: 'navigate', color: COLORS.text, installed: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      Alert.alert(
        'Sin viaje activo',
        'No hay un viaje activo para navegar.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      checkInstalledApps();
    }
  }, [currentTrip]);

  const checkInstalledApps = async () => {
    try {
      const results = await Promise.all(
        navOptions.map(async (option) => {
          if (option.id === 'apple' && Platform.OS !== 'ios') {
            return { ...option, installed: false };
          }
          const installed = await isNavigationAppInstalled(option.id);
          return { ...option, installed };
        })
      );
      setNavOptions(results);
    } catch (error) {
      console.error('Error checking installed apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = async (app: NavigationApp) => {
    if (!currentTrip?.dropoff_location) {
      Alert.alert('Error', 'No hay destino configurado');
      return;
    }

    try {
      await openNavigation(
        {
          latitude: currentTrip.dropoff_location.latitude,
          longitude: currentTrip.dropoff_location.longitude,
          address: currentTrip.dropoff_location.address || 'Destino',
        },
        app
      );
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const openAppStore = (app: NavigationApp) => {
    const storeUrls = {
      waze: Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/waze-navigation-live-traffic/id323229106'
        : 'https://play.google.com/store/apps/details?id=com.waze',
      google: Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/google-maps/id585027354'
        : 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
      apple: 'https://www.apple.com/maps/',
    };

    Linking.openURL(storeUrls[app]);
  };

  if (loading || !currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const installedApps = navOptions.filter((app) => app.installed);
  const notInstalledApps = navOptions.filter((app) => !app.installed);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navegación</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Destination Info */}
        <View style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <Ionicons name="location" size={32} color={COLORS.primary} />
            <View style={styles.destinationText}>
              <Text style={styles.destinationLabel}>Tu destino</Text>
              <Text style={styles.destinationAddress} numberOfLines={2}>
                {currentTrip.dropoff_location?.address || 'Cargando destino...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Installed Apps */}
        {installedApps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abrir en</Text>
            {installedApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.appCard}
                onPress={() => handleNavigate(app.id)}
              >
                <View style={[styles.appIcon, { backgroundColor: `${app.color}20` }]}>
                  <Ionicons name={app.icon as any} size={32} color={app.color} />
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appStatus}>Instalado</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Not Installed Apps */}
        {notInstalledApps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descargar aplicaciones</Text>
            {notInstalledApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[styles.appCard, styles.disabledCard]}
                onPress={() => openAppStore(app.id)}
              >
                <View style={[styles.appIcon, { backgroundColor: `${COLORS.textLight}20` }]}>
                  <Ionicons name={app.icon as any} size={32} color={COLORS.textLight} />
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appStatusDisabled}>No instalado</Text>
                </View>
                <Ionicons name="download" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <View style={styles.infoBoxText}>
            <Text style={styles.infoBoxTitle}>Consejo</Text>
            <Text style={styles.infoBoxSubtitle}>
              Las aplicaciones de navegación te llevarán directamente al destino de tu viaje
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  destinationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationText: {
    flex: 1,
    marginLeft: 16,
  },
  destinationLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.7,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfo: {
    flex: 1,
    marginLeft: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  appStatus: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  appStatusDisabled: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.info}20`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoBoxText: {
    flex: 1,
    marginLeft: 12,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoBoxSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

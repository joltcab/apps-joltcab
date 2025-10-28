import { Linking, Platform, Alert } from 'react-native';

interface Destination {
  latitude: number;
  longitude: number;
  address: string;
}

type NavigationApp = 'waze' | 'google' | 'apple';

export const openNavigation = async (
  destination: Destination,
  app: NavigationApp = 'google'
) => {
  const { latitude, longitude } = destination;

  const urls: Record<NavigationApp, string> = {
    waze: `waze://?ll=${latitude},${longitude}&navigate=yes`,
    google: Platform.OS === 'ios'
      ? `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`
      : `google.navigation:q=${latitude},${longitude}`,
    apple: `maps://app?daddr=${latitude},${longitude}&dirflg=d`,
  };

  const fallbackUrls: Record<NavigationApp, string> = {
    waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    apple: `https://maps.apple.com/?daddr=${latitude},${longitude}`,
  };

  try {
    const canOpen = await Linking.canOpenURL(urls[app]);
    if (canOpen) {
      console.log(`🗺️ Opening ${app}...`);
      await Linking.openURL(urls[app]);
    } else {
      console.log(`📱 ${app} not installed, using fallback...`);
      await Linking.openURL(fallbackUrls[app]);
    }
  } catch (error) {
    console.error('Navigation failed:', error);
    Alert.alert(
      'Error',
      'No se pudo abrir la aplicación de navegación. Intenta con otra opción.'
    );
  }
};

export const isNavigationAppInstalled = async (app: NavigationApp): Promise<boolean> => {
  const urls = {
    waze: 'waze://',
    google: Platform.OS === 'ios' ? 'comgooglemaps://' : 'google.navigation:',
    apple: 'maps://',
  };

  try {
    return await Linking.canOpenURL(urls[app]);
  } catch {
    return false;
  }
};
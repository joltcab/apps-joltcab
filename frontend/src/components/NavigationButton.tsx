import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Button } from './Button';
import { openNavigation, isNavigationAppInstalled } from '../utils/navigation';

interface NavigationButtonProps {
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  label?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  destination,
  label = 'Navegar',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [installedApps, setInstalledApps] = useState({
    waze: false,
    google: false,
    apple: Platform.OS === 'ios',
  });

  useEffect(() => {
    checkInstalledApps();
  }, []);

  const checkInstalledApps = async () => {
    const [waze, google] = await Promise.all([
      isNavigationAppInstalled('waze'),
      isNavigationAppInstalled('google'),
    ]);
    setInstalledApps({ waze, google, apple: Platform.OS === 'ios' });
  };

  const handleNavigate = async (app: 'waze' | 'google' | 'apple') => {
    try {
      await openNavigation(destination, app);
      setShowModal(false);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Ionicons name="navigate" size={24} color={COLORS.white} />
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.overlay} accessible={false}>
          <View style={styles.modal} accessible={true}>
            <View style={styles.header}>
              <Text style={styles.title}>Navegar a destino</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.address}>{destination.address}</Text>

            <View style={styles.apps}>
              {installedApps.waze && (
                <TouchableOpacity
                  style={styles.appOption}
                  onPress={() => handleNavigate('waze')}
                >
                  <View style={[styles.appIcon, { backgroundColor: '#00D8FF20' }]}>
                    <Ionicons name="navigate-circle" size={40} color="#00D8FF" />
                  </View>
                  <Text style={styles.appName}>Waze</Text>
                </TouchableOpacity>
              )}

              {installedApps.google && (
                <TouchableOpacity
                  style={styles.appOption}
                  onPress={() => handleNavigate('google')}
                >
                  <View style={[styles.appIcon, { backgroundColor: '#4285F420' }]}>
                    <Ionicons name="map" size={40} color="#4285F4" />
                  </View>
                  <Text style={styles.appName}>Google Maps</Text>
                </TouchableOpacity>
              )}

              {installedApps.apple && Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.appOption}
                  onPress={() => handleNavigate('apple')}
                >
                  <View style={[styles.appIcon, { backgroundColor: `${COLORS.text}20` }]}>
                    <Ionicons name="navigate" size={40} color={COLORS.text} />
                  </View>
                  <Text style={styles.appName}>Apple Maps</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              title="Cancelar"
              onPress={() => setShowModal(false)}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  address: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  apps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  appOption: {
    alignItems: 'center',
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancelButton: {
    marginTop: 8,
  },
});
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../src/constants/colors';
import { useTripStore } from '../src/store/tripStore';
import { Button } from '../src/components/Button';

type LocationType = 'pickup' | 'dropoff';

export default function BookRideScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { createTrip, loading } = useTripStore();

  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('card');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: 'Current Location',
      };
      setCurrentLocation(current);
      setPickupLocation(current);
      setPickupAddress('Current Location');
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateFare = (pickup: any, dropoff: any) => {
    // Simple fare calculation based on distance
    const R = 6371; // Earth's radius in km
    const lat1 = (pickup.latitude * Math.PI) / 180;
    const lat2 = (dropoff.latitude * Math.PI) / 180;
    const dLat = ((dropoff.latitude - pickup.latitude) * Math.PI) / 180;
    const dLon = ((dropoff.longitude - pickup.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Base fare $5 + $2.5 per km
    const fare = 5 + distance * 2.5;
    setEstimatedFare(Math.round(fare * 100) / 100);
  };

  const handleLocationSelect = (locationType: LocationType, location: any) => {
    if (locationType === 'pickup') {
      setPickupLocation(location);
      setPickupAddress(location.address);
    } else {
      setDropoffLocation(location);
      setDropoffAddress(location.address);
    }

    if (pickupLocation && dropoffLocation && locationType === 'dropoff') {
      calculateFare(pickupLocation, location);
    } else if (pickupLocation && dropoffLocation && locationType === 'pickup') {
      calculateFare(location, dropoffLocation);
    }
  };

  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    const location = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}`,
    };

    if (!pickupLocation) {
      handleLocationSelect('pickup', location);
    } else {
      handleLocationSelect('dropoff', location);
    }
  };

  const handleBookRide = async () => {
    if (!pickupLocation) {
      Alert.alert('Error', 'Please select a pickup location');
      return;
    }
    if (!dropoffLocation) {
      Alert.alert('Error', 'Please select a dropoff location');
      return;
    }

    try {
      const trip = await createTrip(pickupLocation, dropoffLocation, selectedPaymentMethod);
      Alert.alert(
        'Ride Booked!',
        `Your ride has been booked. Fare: $${trip.fare.toFixed(2)}`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/history'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Ride</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || 37.78825,
            longitude: currentLocation?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              title="Pickup"
              pinColor={COLORS.primary}
            />
          )}
          {dropoffLocation && (
            <Marker
              coordinate={{
                latitude: dropoffLocation.latitude,
                longitude: dropoffLocation.longitude,
              }}
              title="Dropoff"
              pinColor={COLORS.error}
            />
          )}
        </MapView>

        {/* Location Inputs */}
        <View style={styles.locationInputsContainer}>
          <View style={styles.locationInput}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Pickup location"
              value={pickupAddress}
              onChangeText={setPickupAddress}
            />
          </View>
          <View style={styles.locationInput}>
            <Ionicons name="flag" size={20} color={COLORS.error} />
            <TextInput
              style={styles.input}
              placeholder="Dropoff location"
              value={dropoffAddress}
              onChangeText={setDropoffAddress}
            />
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.bottomSheet}
      >
        <ScrollView>
          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {[
              { key: 'card', label: 'Card', icon: 'card' },
              { key: 'cash', label: 'Cash', icon: 'cash' },
              { key: 'wallet', label: 'Wallet', icon: 'wallet' },
            ].map((method) => (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.key && styles.paymentMethodActive,
                ]}
                onPress={() => setSelectedPaymentMethod(method.key as any)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={
                    selectedPaymentMethod === method.key
                      ? COLORS.white
                      : COLORS.text
                  }
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === method.key && styles.paymentMethodTextActive,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fare Estimate */}
          {estimatedFare && (
            <View style={styles.fareContainer}>
              <Text style={styles.fareLabel}>Estimated Fare</Text>
              <Text style={styles.fareAmount}>${estimatedFare.toFixed(2)}</Text>
            </View>
          )}

          {/* Book Button */}
          <Button
            title="Book Ride"
            onPress={handleBookRide}
            loading={loading}
            disabled={!pickupLocation || !dropoffLocation}
            style={styles.bookButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationInputsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: '40%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  paymentMethodActive: {
    backgroundColor: COLORS.primary,
  },
  paymentMethodText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
  },
  paymentMethodTextActive: {
    color: COLORS.white,
  },
  fareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  fareLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bookButton: {
    marginTop: 8,
  },
});

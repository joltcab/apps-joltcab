import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../src/constants/colors';
import { useTripStore } from '../src/store/tripStore';
import { useAuthStore } from '../src/store/authStore';
import { SOSButton } from '../src/components/SOSButton';
import { Button } from '../src/components/Button';
import { EmergencyModal } from '../src/components/EmergencyModal';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const DEFAULT_EMERGENCY_NUMBERS = [
  { id: '911', name: 'Emergencias', phone: '911', icon: 'warning' },
  { id: 'police', name: 'Policía', phone: '911', icon: 'shield' },
  { id: 'ambulance', name: 'Ambulancia', phone: '911', icon: 'medical' },
];

export default function SOSScreen() {
  const { currentTrip } = useTripStore();
  const { user } = useAuthStore();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleSOSActivate = () => {
    setShowEmergencyModal(true);
  };

  const handleEmergencyCall = (phone: string) => {
    Alert.alert(
      'Llamar a Emergencias',
      `¿Deseas llamar al ${phone}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar',
          onPress: () => Linking.openURL(`tel:${phone}`),
          style: 'default',
        },
      ]
    );
  };

  const addEmergencyContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!/^\+?[1-9]\d{7,14}$/.test(newContactPhone.trim())) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
    };

    setEmergencyContacts([...emergencyContacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    Alert.alert('Contacto agregado', 'El contacto de emergencia ha sido agregado exitosamente');
  };

  const removeContact = (id: string) => {
    Alert.alert(
      'Eliminar contacto',
      '¿Estás seguro de eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id)),
          style: 'destructive',
        },
      ]
    );
  };

  const shareLocationWithContact = (contact: EmergencyContact) => {
    if (!currentLocation) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      return;
    }

    const message = `🚨 EMERGENCIA: Necesito ayuda. Mi ubicación actual: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
    const smsUrl = Platform.OS === 'ios'
      ? `sms:${contact.phone}&body=${encodeURIComponent(message)}`
      : `sms:${contact.phone}?body=${encodeURIComponent(message)}`;

    Linking.openURL(smsUrl);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergencia SOS</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* SOS Button Section */}
          <View style={styles.sosSection}>
            <Text style={styles.sosTitle}>Botón de Emergencia</Text>
            <Text style={styles.sosSubtitle}>
              Mantén presionado 3 segundos para activar la alerta de emergencia
            </Text>
            <View style={styles.sosButtonContainer}>
              <SOSButton onActivate={handleSOSActivate} />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Llamadas de Emergencia</Text>
            {DEFAULT_EMERGENCY_NUMBERS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.emergencyCard}
                onPress={() => handleEmergencyCall(item.phone)}
              >
                <View style={styles.emergencyIcon}>
                  <Ionicons name={item.icon as any} size={28} color={COLORS.white} />
                </View>
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyName}>{item.name}</Text>
                  <Text style={styles.emergencyPhone}>{item.phone}</Text>
                </View>
                <Ionicons name="call" size={24} color={COLORS.error} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Personal Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contactos Personales</Text>
            <Text style={styles.sectionSubtitle}>
              Agrega contactos de confianza para situaciones de emergencia
            </Text>

            {/* Add Contact Form */}
            <View style={styles.addContactForm}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del contacto"
                value={newContactName}
                onChangeText={setNewContactName}
                placeholderTextColor={COLORS.textLight}
              />
              <TextInput
                style={[styles.input, styles.inputMargin]}
                placeholder="Número de teléfono (+521234567890)"
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textLight}
              />
              <Button
                title="Agregar Contacto"
                onPress={addEmergencyContact}
                icon="add-circle"
                style={styles.addButton}
              />
            </View>

            {/* Contact List */}
            {emergencyContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyStateText}>
                  No tienes contactos de emergencia
                </Text>
              </View>
            ) : (
              emergencyContacts.map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="person" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      onPress={() => shareLocationWithContact(contact)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="location" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEmergencyCall(contact.phone)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="call" size={20} color={COLORS.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Safety Info */}
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={24} color={COLORS.warning} />
            <View style={styles.warningBoxText}>
              <Text style={styles.warningBoxTitle}>Importante</Text>
              <Text style={styles.warningBoxSubtitle}>
                En caso de emergencia real, siempre llama al 911 primero. Esta función es complementaria.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Emergency Modal */}
      <EmergencyModal
        visible={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        tripId={currentTrip?.id}
        userLocation={currentLocation}
        emergencyContacts={emergencyContacts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
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
  },
  sosSection: {
    backgroundColor: COLORS.white,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sosTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sosSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  sosButtonContainer: {
    marginVertical: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyCard: {
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
  emergencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  emergencyPhone: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  addContactForm: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMargin: {
    marginTop: 12,
  },
  addButton: {
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 12,
  },
  contactCard: {
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
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.warning}20`,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  warningBoxText: {
    flex: 1,
    marginLeft: 12,
  },
  warningBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  warningBoxSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { ShareOptionsModal } from '../src/components/ShareOptionsModal';
import { useTripStore } from '../src/store/tripStore';
import { Button } from '../src/components/Button';
import { LoadingSpinner } from '../src/components/LoadingSpinner';

export default function ShareTripScreen() {
  const { currentTrip } = useTripStore();
  const [showModal, setShowModal] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);

  useEffect(() => {
    if (!currentTrip) {
      Alert.alert(
        'Sin viaje activo',
        'No hay un viaje activo para compartir.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [currentTrip]);

  const addEmergencyContact = () => {
    if (contactPhone.trim() && /^\+?[1-9]\d{7,14}$/.test(contactPhone.trim())) {
      setEmergencyContacts([...emergencyContacts, contactPhone.trim()]);
      setContactPhone('');
    } else {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
    }
  };

  const removeContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleShareToAll = () => {
    if (emergencyContacts.length === 0) {
      Alert.alert('Error', 'Por favor agrega al menos un contacto');
      return;
    }
    // TODO: Implement share to all contacts
    Alert.alert('Compartido', `Viaje compartido con ${emergencyContacts.length} contactos`);
  };

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Compartir Viaje</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Trip Info */}
          <View style={styles.tripInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Destino</Text>
                <Text style={styles.value} numberOfLines={2}>
                  {currentTrip.dropoff_location?.address || 'Cargando...'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="car" size={20} color={COLORS.primary} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Estado</Text>
                <Text style={styles.value}>{currentTrip.status}</Text>
              </View>
            </View>
          </View>

          {/* Quick Share */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compartir Ahora</Text>
            <Text style={styles.sectionSubtitle}>
              Comparte tu ubicación en tiempo real con amigos y familia
            </Text>
            <Button
              title="Compartir Viaje"
              onPress={() => setShowModal(true)}
              icon="share-social"
              style={styles.shareButton}
            />
          </View>

          {/* Emergency Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            <Text style={styles.sectionSubtitle}>
              Agrega contactos que recibirán actualizaciones automáticas
            </Text>

            {/* Add Contact Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Número de teléfono (+521234567890)"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textLight}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addEmergencyContact}
              >
                <Ionicons name="add" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Contact List */}
            {emergencyContacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Ionicons name="person" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{contact}</Text>
                <TouchableOpacity onPress={() => removeContact(index)}>
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}

            {emergencyContacts.length > 0 && (
              <Button
                title={`Compartir con ${emergencyContacts.length} contacto(s)`}
                onPress={handleShareToAll}
                variant="outline"
                style={styles.shareAllButton}
              />
            )}
          </View>

          {/* Safety Info */}
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
            <View style={styles.infoBoxText}>
              <Text style={styles.infoBoxTitle}>Tu seguridad es primero</Text>
              <Text style={styles.infoBoxSubtitle}>
                Tus contactos podrán ver tu ubicación en tiempo real hasta que finalice el viaje
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Share Modal */}
      <ShareOptionsModal
        visible={showModal}
        tripId={currentTrip.id}
        onClose={() => setShowModal(false)}
        contactPhone={contactPhone}
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
    padding: 16,
  },
  tripInfo: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
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
  shareButton: {
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  shareAllButton: {
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.success}20`,
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

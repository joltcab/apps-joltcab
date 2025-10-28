import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Button } from './Button';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  tripId?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  emergencyContacts?: EmergencyContact[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  visible,
  onClose,
  tripId,
  userLocation,
  emergencyContacts = [],
}) => {
  const [loading, setLoading] = useState(false);

  const handleActivateSOS = async () => {
    setLoading(true);

    try {
      // 1. Call 911
      const shouldCall911 = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Llamar al 911',
          '¿Deseas llamar a servicios de emergencia?',
          [
            { text: 'No', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Sí, llamar', onPress: () => resolve(true), style: 'default' },
          ]
        );
      });

      if (shouldCall911) {
        await Linking.openURL('tel:911');
      }

      // 2. Send SMS to emergency contacts
      if (emergencyContacts.length > 0 && userLocation) {
        const message = `🚨 EMERGENCIA: Necesito ayuda urgente. Mi ubicación: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
        
        for (const contact of emergencyContacts) {
          try {
            const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
            await Linking.openURL(smsUrl);
          } catch (error) {
            console.error(`Failed to send SMS to ${contact.name}`, error);
          }
        }
      }

      // 3. TODO: Send alert to backend
      console.log('🚨 SOS Activated', { tripId, userLocation });

      Alert.alert(
        'SOS Activado',
        'Se ha enviado la alerta de emergencia a tus contactos y al equipo de JoltCab.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      console.error('SOS activation failed:', error);
      Alert.alert('Error', 'No se pudo activar la alerta de emergencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <View style={styles.overlay} accessible={false}>
        <View style={styles.modal} accessible={true}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={64} color={COLORS.error} />
          </View>

          <Text style={styles.title}>¿Activar SOS?</Text>
          <Text style={styles.subtitle}>
            Se notificará a{emergencyContacts.length > 0 ? ` ${emergencyContacts.length} contacto(s) de emergencia y a` : 'l'} equipo de JoltCab con tu ubicación actual.
          </Text>

          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.error} />
            <Text style={styles.warningText}>
              Solo activa el SOS en caso de emergencia real
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={onClose}
              variant="outline"
              style={styles.button}
              disabled={loading}
            />
            <Button
              title="Activar SOS"
              onPress={handleActivateSOS}
              variant="danger"
              style={styles.button}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.error}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.error}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.error,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
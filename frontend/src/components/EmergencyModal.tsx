import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Button } from './Button';

interface EmergencyModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={64} color={COLORS.error} />
          </View>

          <Text style={styles.title}>¿Activar SOS?</Text>
          <Text style={styles.subtitle}>
            Se notificará a tus contactos de emergencia y al equipo de JoltCab con tu ubicación actual.
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
              onPress={onCancel}
              variant="outline"
              style={styles.button}
              disabled={loading}
            />
            <Button
              title="Activar SOS"
              onPress={onConfirm}
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
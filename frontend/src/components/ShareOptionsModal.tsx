import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { shareTrip, shareViaWhatsApp, shareViaSMS } from '../utils/shareTrip';

interface ShareOptionsModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
  contactPhone?: string;
}

export const ShareOptionsModal: React.FC<ShareOptionsModalProps> = ({
  visible,
  tripId,
  onClose,
  contactPhone = '',
}) => {
  const handleShare = async (method: 'whatsapp' | 'sms' | 'native') => {
    try {
      if (method === 'whatsapp') {
        await shareViaWhatsApp(tripId, contactPhone);
      } else if (method === 'sms') {
        await shareViaSMS(tripId, contactPhone);
      } else {
        await shareTrip(tripId);
      }
      onClose();
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Compartir Viaje</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Comparte tu viaje para que otros puedan seguir tu ubicación en tiempo real
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('whatsapp')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#25D36620' }]}>
                <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
              </View>
              <Text style={styles.optionTitle}>WhatsApp</Text>
              <Text style={styles.optionSubtitle}>Enviar por WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('sms')}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.info}20` }]}>
                <Ionicons name="chatbubble" size={32} color={COLORS.info} />
              </View>
              <Text style={styles.optionTitle}>SMS</Text>
              <Text style={styles.optionSubtitle}>Enviar mensaje</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleShare('native')}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
                <Ionicons name="share-social" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.optionTitle}>Más opciones</Text>
              <Text style={styles.optionSubtitle}>Otros métodos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
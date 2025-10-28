import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import api from '../services/api';

interface WhatsAppButtonProps {
  userName: string;
  userPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  suggestedPrice?: number;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  userName,
  userPhone,
  pickupAddress,
  destinationAddress,
  suggestedPrice,
}) => {
  const [loading, setLoading] = useState(false);

  const handleWhatsAppRequest = async () => {
    try {
      setLoading(true);
      console.log('📲 Generating WhatsApp link...');

      const response = await api.post('/trip/request/whatsapp', {
        user_name: userName,
        user_phone: userPhone,
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        vehicle_type: 'sedan',
        suggested_price: suggestedPrice || 0,
      });

      if (response.data.success && response.data.whatsapp_link) {
        const whatsappUrl = response.data.whatsapp_link;
        console.log('✅ Opening WhatsApp:', whatsappUrl);

        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            'WhatsApp no disponible',
            'Por favor instala WhatsApp para usar esta función'
          );
        }
      } else {
        throw new Error('Failed to generate WhatsApp link');
      }
    } catch (error: any) {
      console.error('❌ WhatsApp request failed:', error.message);
      Alert.alert('Error', 'No se pudo generar el mensaje de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleWhatsAppRequest}
      disabled={loading}
    >
      <Ionicons name="logo-whatsapp" size={24} color={COLORS.white} />
      <Text style={styles.text}>
        {loading ? 'Generando...' : 'Pedir por WhatsApp'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
});
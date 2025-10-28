import { Share, Linking, Platform, Alert } from 'react-native';
import api from '../services/api';

export const shareTrip = async (tripId: string) => {
  try {
    console.log('🔗 Generating share link...');
    const response = await api.post('/trip/share/generate', {
      trip_id: tripId
    });

    if (response.data.success && response.data.share_link) {
      const shareLink = response.data.share_link;
      
      await Share.share({
        message: `🚗 Sígueme en mi viaje con JoltCab en tiempo real: ${shareLink}`,
        url: shareLink,
        title: 'Mi viaje en JoltCab'
      });
      
      console.log('✅ Share dialog opened');
    } else {
      throw new Error('Failed to generate share link');
    }
  } catch (error: any) {
    console.error('❌ Share failed:', error.message);
    throw error;
  }
};

export const shareViaWhatsApp = async (tripId: string, phone: string) => {
  try {
    const response = await api.post('/trip/share/generate', {
      trip_id: tripId
    });

    if (response.data.success && response.data.share_link) {
      const link = response.data.share_link;
      const message = `🚗 Estoy en camino! Sígueme en tiempo real: ${link}`;
      const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp no disponible', 'Por favor instala WhatsApp');
      }
    }
  } catch (error) {
    console.error('Share via WhatsApp failed');
    throw error;
  }
};

export const shareViaSMS = async (tripId: string, phone: string) => {
  try {
    const response = await api.post('/trip/share/generate', {
      trip_id: tripId
    });

    if (response.data.success && response.data.share_link) {
      const link = response.data.share_link;
      const message = `🚗 Estoy en camino! Sígueme en tiempo real: ${link}`;
      const smsUrl = Platform.OS === 'ios'
        ? `sms:${phone}&body=${encodeURIComponent(message)}`
        : `sms:${phone}?body=${encodeURIComponent(message)}`;
      
      await Linking.openURL(smsUrl);
    }
  } catch (error) {
    console.error('Share via SMS failed');
    throw error;
  }
};
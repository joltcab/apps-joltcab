import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface OfferCardProps {
  offer: {
    offer_id: string;
    driver_name: string;
    driver_rating: number;
    offered_price: number;
    message?: string;
    expires_at: string;
  };
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onAccept,
  onReject,
  loading = false,
}) => {
  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const expires = new Date(offer.expires_at).getTime();
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{offer.driver_name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.rating}>{offer.driver_rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Oferta</Text>
          <Text style={styles.price}>${offer.offered_price.toFixed(2)}</Text>
        </View>
      </View>

      {offer.message && (
        <View style={styles.messageContainer}>
          <Ionicons name="chatbubble-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.message}>{offer.message}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={16} color={COLORS.error} />
          <Text style={styles.timer}>{getTimeRemaining()}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={onReject}
            disabled={loading}
          >
            <Text style={styles.rejectText}>Rechazar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
            disabled={loading}
          >
            <Text style={styles.acceptText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverDetails: {
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timer: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: COLORS.lightGray,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

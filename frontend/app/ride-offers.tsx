import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { useNegotiationStore } from '../src/store/negotiationStore';
import { OfferCard } from '../src/components/OfferCard';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import socketService from '../src/services/socket';

export default function RideOffersScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { offers, getOffers, acceptOffer, rejectOffer } = useNegotiationStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tripId) {
      loadOffers();
      setupSocketListeners();
    }

    return () => {
      socketService.off('new_offer');
    };
  }, [tripId]);

  const loadOffers = async () => {
    try {
      await getOffers(tripId!);
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('new_offer', (data: any) => {
      if (data.trip_id === tripId) {
        console.log('🆕 New offer received!');
        loadOffers();
      }
    });
  };

  const handleAcceptOffer = async (offerId: string) => {
    Alert.alert(
      'Aceptar Oferta',
      '¿Estás seguro de que quieres aceptar esta oferta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setLoading(true);
              await acceptOffer(tripId!, offerId);
              Alert.alert('¡Éxito!', 'Has aceptado la oferta del conductor', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/history'),
                },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await rejectOffer(offerId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ofertas Recibidas</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Los conductores están enviando ofertas. Acepta la que más te convenga.
        </Text>
      </View>

      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            onAccept={() => handleAcceptOffer(item.offer_id)}
            onReject={() => handleRejectOffer(item.offer_id)}
            loading={loading}
          />
        )}
        keyExtractor={(item) => item.offer_id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="hourglass-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>Esperando ofertas...</Text>
            <Text style={styles.emptySubtext}>
              Los conductores están revisando tu solicitud
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});
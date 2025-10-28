import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Button } from './Button';

interface PriceNegotiationModalProps {
  visible: boolean;
  estimatedFare: number;
  suggestedPrice: number;
  onChangeSuggestedPrice: (price: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PriceNegotiationModal: React.FC<PriceNegotiationModalProps> = ({
  visible,
  estimatedFare,
  suggestedPrice,
  onChangeSuggestedPrice,
  onConfirm,
  onCancel,
}) => {
  const savings = estimatedFare - suggestedPrice;
  const savingsPercent = ((savings / estimatedFare) * 100).toFixed(0);

  const quickPrices = [
    estimatedFare * 0.7,
    estimatedFare * 0.8,
    estimatedFare * 0.9,
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>💰 Negocia tu Precio</Text>
              <Text style={styles.subtitle}>Los conductores verán tu oferta</Text>
            </View>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceComparison}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Tarifa Normal</Text>
              <Text style={styles.normalPrice}>${estimatedFare.toFixed(2)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Tu Oferta</Text>
              <Text style={styles.suggestedPrice}>${suggestedPrice.toFixed(2)}</Text>
            </View>
          </View>

          {savings > 0 && (
            <View style={styles.savingsCard}>
              <Ionicons name="trending-down" size={20} color={COLORS.success} />
              <Text style={styles.savingsText}>
                ¡Ahorras ${savings.toFixed(2)} ({savingsPercent}%)!
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Ofertas Rápidas</Text>
          <View style={styles.quickPrices}>
            {quickPrices.map((price, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickPriceButton,
                  suggestedPrice === price && styles.quickPriceButtonActive,
                ]}
                onPress={() => onChangeSuggestedPrice(price)}
              >
                <Text
                  style={[
                    styles.quickPriceText,
                    suggestedPrice === price && styles.quickPriceTextActive,
                  ]}
                >
                  ${price.toFixed(2)}
                </Text>
                <Text style={styles.quickPricePercent}>
                  {((1 - price / estimatedFare) * 100).toFixed(0)}% off
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Los conductores pueden aceptar tu oferta o hacer una contraoferta
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={onCancel}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Confirmar"
              onPress={onConfirm}
              style={styles.button}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  normalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textDecorationLine: 'line-through',
  },
  suggestedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.success}20`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  quickPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickPriceButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickPriceButtonActive: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  quickPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  quickPriceTextActive: {
    color: COLORS.primary,
  },
  quickPricePercent: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.info}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
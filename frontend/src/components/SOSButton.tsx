import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface SOSButtonProps {
  onActivate: () => void;
  holdDuration?: number;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onActivate,
  holdDuration = 3000,
}) => {
  const [pressing, setPressing] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    setPressing(true);
    
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: holdDuration,
      useNativeDriver: false,
    }).start();

    timeoutRef.current = setTimeout(() => {
      onActivate();
      handlePressOut();
    }, holdDuration);
  };

  const handlePressOut = () => {
    setPressing(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Ionicons name="warning" size={32} color={COLORS.white} />
        <Text style={styles.title}>SOS</Text>
        <Text style={styles.subtitle}>Mantén presionado 3 seg</Text>
      </View>
      {pressing && (
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progress, { width: progressWidth }]} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 8,
    color: COLORS.white,
    marginTop: 2,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.white,
  },
});
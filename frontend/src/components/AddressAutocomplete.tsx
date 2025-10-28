import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import api from '../services/api';

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressAutocompleteProps {
  placeholder?: string;
  onPlaceSelected: (place: { address: string; latitude: number; longitude: number }) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  initialValue?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder = 'Buscar dirección...',
  onPlaceSelected,
  icon = 'location',
  iconColor = COLORS.primary,
  initialValue = '',
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialValue) {
      setSearchText(initialValue);
    }
  }, [initialValue]);

  const searchPlaces = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Searching places:', text);
      const response = await api.post('/maps/autocomplete', {
        input: text,
        language: 'es',
      });

      if (response.data.success && response.data.predictions) {
        console.log('✅ Found', response.data.predictions.length, 'predictions');
        setPredictions(response.data.predictions);
        setShowPredictions(true);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('❌ Autocomplete error:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);

    // Debounce the search
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const handlePlaceSelect = async (prediction: Prediction) => {
    try {
      console.log('📍 Getting place details for:', prediction.place_id);
      setLoading(true);
      setShowPredictions(false);
      setSearchText(prediction.description);

      // Get place details with coordinates
      const response = await api.post('/maps/place-details', {
        place_id: prediction.place_id,
      });

      if (response.data.success && response.data.result) {
        const location = response.data.result.geometry.location;
        console.log('✅ Place details retrieved:', location);

        onPlaceSelected({
          address: prediction.description,
          latitude: location.lat,
          longitude: location.lng,
        });
      }

      Keyboard.dismiss();
      setPredictions([]);
    } catch (error) {
      console.error('❌ Place details error:', error);
      Alert.alert('Error', 'No se pudieron obtener los detalles de la dirección');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowPredictions(true);
            }
          }}
        />
        {loading && (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
        )}
        {searchText.length > 0 && !loading && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handlePlaceSelect(item)}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={COLORS.textLight}
                  style={styles.predictionIcon}
                />
                <View style={styles.predictionText}>
                  <Text style={styles.predictionMain}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.predictionSecondary}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.predictionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  loader: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  predictionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
    zIndex: 999,
  },
  predictionsList: {
    maxHeight: 300,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  predictionIcon: {
    marginRight: 12,
  },
  predictionText: {
    flex: 1,
  },
  predictionMain: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  predictionSecondary: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

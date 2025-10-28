import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isOwnMessage: boolean;
  senderName?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  timestamp, 
  isOwnMessage,
  senderName 
}) => {
  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    
    try {
      const date = new Date(isoString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, isOwnMessage ? styles.myContainer : styles.theirContainer]}>
      {!isOwnMessage && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View style={[styles.bubble, isOwnMessage ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.messageText, isOwnMessage ? styles.myText : styles.theirText]}>
          {message}
        </Text>
      </View>
      {timestamp && (
        <Text style={styles.timestamp}>
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '75%',
  },
  myContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: '100%',
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: COLORS.white,
  },
  theirText: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    marginHorizontal: 12,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'user' | 'driver';
  message: string;
  created_at: string;
}

interface ChatBubbleProps {
  message: Message;
  currentUserId: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, currentUserId }) => {
  const isMine = message.sender_id === currentUserId;

  return (
    <View style={[styles.container, isMine ? styles.myContainer : styles.theirContainer]}>
      {!isMine && <Text style={styles.senderName}>{message.sender_name}</Text>}
      <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
          {message.message}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {format(new Date(message.created_at), 'HH:mm')}
      </Text>
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
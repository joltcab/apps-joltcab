import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { ChatBubble } from '../src/components/ChatBubble';
import { ChatInput } from '../src/components/ChatInput';
import { useChatStore } from '../src/store/chatStore';
import { useAuthStore } from '../src/store/authStore';
import { useTripStore } from '../src/store/tripStore';
import { LoadingSpinner } from '../src/components/LoadingSpinner';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const tripId = params.tripId as string;
  const driverName = params.driverName as string || 'Conductor';
  
  const { user } = useAuthStore();
  const { currentTrip } = useTripStore();
  const { 
    messages, 
    loading, 
    sendMessage, 
    loadMessages,
    connectToChat,
    disconnectFromChat 
  } = useChatStore();
  
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (tripId && user) {
      // Connect to chat socket
      connectToChat(tripId, user.uid);
      // Load previous messages
      loadMessages(tripId);
    }

    return () => {
      disconnectFromChat();
    };
  }, [tripId, user]);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !tripId || !user) return;

    try {
      await sendMessage(tripId, user.uid, inputText.trim(), 'user');
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!tripId || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>No se pudo cargar el chat</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={COLORS.white} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{driverName}</Text>
              <Text style={styles.headerSubtitle}>Conductor</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          {loading && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No hay mensajes</Text>
              <Text style={styles.emptySubtext}>
                Envía un mensaje para comenzar la conversación
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatBubble
                  message={item.text}
                  timestamp={item.timestamp}
                  isOwnMessage={item.sender_id === user.uid}
                  senderName={item.sender_id === user.uid ? 'Tú' : driverName}
                />
              )}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}
        </View>

        {/* Input */}
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          placeholder="Escribe un mensaje..."
          disabled={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
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
    lineHeight: 20,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  backLink: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 16,
  },
});

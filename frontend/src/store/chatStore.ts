import { create } from 'zustand';
import api from '../services/api';
import socketService from '../services/socket';

interface Message {
  id: string;
  trip_id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'user' | 'driver';
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ChatState {
  messages: Message[];
  unreadCount: number;
  typing: boolean;
  loading: boolean;
  sendMessage: (tripId: string, senderId: string, senderName: string, message: string) => Promise<void>;
  loadHistory: (tripId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  setupSocketListeners: (tripId: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  unreadCount: 0,
  typing: false,
  loading: false,

  sendMessage: async (tripId, senderId, senderName, message) => {
    try {
      console.log('💬 Sending message...');
      const response = await api.post('/chat/send', {
        trip_id: tripId,
        sender_id: senderId,
        sender_name: senderName,
        message,
        sender_type: 'user'
      });

      if (response.data.success) {
        console.log('✅ Message sent');
        const newMessage: Message = {
          id: response.data.message_id || Date.now().toString(),
          trip_id: tripId,
          sender_id: senderId,
          sender_name: senderName,
          sender_type: 'user',
          message,
          created_at: new Date().toISOString(),
          is_read: false
        };
        set(state => ({ messages: [...state.messages, newMessage] }));
      }
    } catch (error: any) {
      console.error('❌ Send message failed:', error.message);
      throw error;
    }
  },

  loadHistory: async (tripId) => {
    set({ loading: true });
    try {
      console.log('📋 Loading chat history...');
      const response = await api.get(`/chat/history?trip_id=${tripId}`);

      if (response.data.success && response.data.messages) {
        console.log(`✅ Loaded ${response.data.messages.length} messages`);
        set({ messages: response.data.messages, loading: false });
      } else {
        set({ messages: [], loading: false });
      }
    } catch (error) {
      console.error('❌ Load history failed');
      set({ messages: [], loading: false });
    }
  },

  markAsRead: async (messageId) => {
    try {
      await api.post('/chat/mark_read', { message_id: messageId });
      set(state => ({
        messages: state.messages.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      }));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  },

  setTyping: (isTyping) => {
    set({ typing: isTyping });
  },

  setupSocketListeners: (tripId) => {
    socketService.on('new_message', (data: any) => {
      if (data.trip_id === tripId) {
        console.log('📥 New message received');
        const newMessage: Message = {
          id: data.message_id,
          trip_id: data.trip_id,
          sender_id: data.sender_id,
          sender_name: data.sender_name,
          sender_type: data.sender_type,
          message: data.message,
          created_at: data.created_at,
          is_read: false
        };
        set(state => ({ messages: [...state.messages, newMessage] }));
      }
    });

    socketService.on('user_typing', (data: any) => {
      if (data.trip_id === tripId && data.sender_type === 'driver') {
        set({ typing: true });
        setTimeout(() => set({ typing: false }), 3000);
      }
    });
  },

  clearMessages: () => {
    set({ messages: [], unreadCount: 0, typing: false });
  },
}));
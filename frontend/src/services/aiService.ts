import api from './api';

// Tipos para los servicios de IA
export interface DynamicPricingRequest {
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  service_type: string;
  time: string;
  user_email?: string;
}

export interface DynamicPricingResponse {
  success: boolean;
  final_price: number;
  base_price: number;
  surge_multiplier: number;
  factors: {
    distance_km: number;
    duration_min: number;
    time_factor: number;
    demand_factor: number;
    weather_factor: number;
    traffic_factor: number;
  };
  explanation: string;
}

export interface ChatMessage {
  message: string;
  user_email?: string;
  role: 'user' | 'driver' | 'corporate' | 'hotel' | 'dispatcher';
  conversation_history?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

export interface WhatsAppNotification {
  to: string;
  message: string;
  ride_id?: string;
  user_id?: string;
}

export interface WhatsAppBooking {
  user_phone: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  service_type?: string;
  scheduled_time?: string;
}

class AIService {
  /**
   * Calcular precio dinámico con IA
   */
  async calculateDynamicPrice(data: DynamicPricingRequest): Promise<DynamicPricingResponse> {
    try {
      console.log('💰 Calculating dynamic price with AI...');
      const response = await api.post('/api/v1/ai/dynamic-pricing-advanced', data);
      
      if (response.data.success) {
        console.log('✅ Dynamic price calculated:', response.data.final_price);
        return response.data;
      }
      
      throw new Error('Failed to calculate price');
    } catch (error: any) {
      console.error('❌ Dynamic pricing error:', error.message);
      
      // Fallback a cálculo simple
      const distance = this.calculateDistance(
        data.pickup_lat,
        data.pickup_lng,
        data.dropoff_lat,
        data.dropoff_lng
      );
      
      const basePrice = 5 + distance * 2.5;
      
      return {
        success: true,
        final_price: Math.round(basePrice * 100) / 100,
        base_price: basePrice,
        surge_multiplier: 1,
        factors: {
          distance_km: distance,
          duration_min: Math.round(distance * 3),
          time_factor: 1,
          demand_factor: 1,
          weather_factor: 1,
          traffic_factor: 1,
        },
        explanation: 'Using fallback pricing calculation',
      };
    }
  }

  /**
   * Chat con soporte IA
   */
  async chatWithSupport(data: ChatMessage): Promise<ChatResponse> {
    try {
      console.log('💬 Sending message to AI support...');
      const response = await api.post('/api/v1/ai/chatbot', data);
      
      if (response.data.success) {
        console.log('✅ AI response received');
        return response.data;
      }
      
      throw new Error('Failed to get AI response');
    } catch (error: any) {
      console.error('❌ AI chat error:', error.message);
      
      // Fallback response
      return {
        success: true,
        response: 'Lo siento, el servicio de chat no está disponible en este momento. Por favor intenta más tarde o contacta a support@joltcab.com',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Enviar notificación por WhatsApp
   */
  async sendWhatsAppNotification(data: WhatsAppNotification): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📱 Sending WhatsApp notification...');
      const response = await api.post('/api/v1/whatsapp/notify', data);
      
      console.log('✅ WhatsApp notification sent');
      return response.data;
    } catch (error: any) {
      console.error('❌ WhatsApp notification error:', error.message);
      throw error;
    }
  }

  /**
   * Crear booking por WhatsApp
   */
  async createWhatsAppBooking(data: WhatsAppBooking): Promise<{ success: boolean; booking_id: string; whatsapp_url: string }> {
    try {
      console.log('🚕 Creating WhatsApp booking...');
      const response = await api.post('/api/v1/whatsapp/booking', data);
      
      console.log('✅ WhatsApp booking created');
      return response.data;
    } catch (error: any) {
      console.error('❌ WhatsApp booking error:', error.message);
      
      // Generar URL de WhatsApp manualmente como fallback
      const whatsappNumber = '+14707484747';
      const message = `Hola! Necesito un viaje:\n\n📍 Origen: ${data.pickup_address}\n📍 Destino: ${data.dropoff_address}\n\n¿Pueden ayudarme?`;
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      return {
        success: true,
        booking_id: 'fallback-' + Date.now(),
        whatsapp_url: whatsappUrl,
      };
    }
  }

  /**
   * Generar link de WhatsApp para compartir viaje
   */
  generateWhatsAppShareLink(tripData: {
    pickup_address: string;
    dropoff_address: string;
    driver_name?: string;
    estimated_time?: string;
  }): string {
    const whatsappNumber = '+14707484747';
    const message = `🚕 Compartiendo mi viaje de JoltCab:\n\n📍 Origen: ${tripData.pickup_address}\n📍 Destino: ${tripData.dropoff_address}${tripData.driver_name ? `\n👤 Conductor: ${tripData.driver_name}` : ''}${tripData.estimated_time ? `\n⏱️ Tiempo estimado: ${tripData.estimated_time}` : ''}`;
    
    return `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Calcular distancia entre dos puntos (Haversine)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
  }
}

export const aiService = new AIService();

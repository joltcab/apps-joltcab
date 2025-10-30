import { IAIProvider, ChatResponse, ChatHistoryResponse } from './IAIProvider';

/**
 * Proveedor alternativo de ejemplo (OpenAI, Claude, Custom API, etc.)
 * Puedes duplicar esta clase y adaptarla para cualquier otro proveedor de IA
 */
export class CustomAIProvider implements IAIProvider {
  name = 'Custom AI';
  private apiKey?: string;
  private baseUrl: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async sendMessage(
    message: string,
    userId?: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    try {
      console.log(`💬 [${this.name}] Sending message...`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          userId,
          conversationId,
        }),
      });

      const result = await response.json();

      console.log(`✅ [${this.name}] Response received`);
      return {
        success: true,
        response: result.response || result.message || result.content,
        conversationId: result.conversationId || result.conversation_id,
        timestamp: result.timestamp || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`❌ [${this.name}] Error:`, error.message);
      throw error;
    }
  }

  async getHistory(
    userId: string,
    conversationId?: string,
    limit?: number
  ): Promise<ChatHistoryResponse> {
    try {
      console.log(`📋 [${this.name}] Getting chat history...`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (conversationId) params.append('conversationId', conversationId);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/history?${params}`, {
        method: 'GET',
        headers,
      });

      const result = await response.json();

      console.log(`✅ [${this.name}] History retrieved`);
      return {
        success: true,
        messages: result.messages || result.data || [],
      };
    } catch (error: any) {
      console.error(`❌ [${this.name}] History error:`, error.message);
      return {
        success: false,
        messages: [],
      };
    }
  }
}

/**
 * Proveedor Fallback simple (sin backend)
 * Respuestas predefinidas para cuando no hay conexión
 */
export class FallbackAIProvider implements IAIProvider {
  name = 'Fallback AI';

  async sendMessage(message: string): Promise<ChatResponse> {
    console.log(`💬 [${this.name}] Using fallback response`);
    
    // Respuestas básicas predefinidas
    const responses: Record<string, string> = {
      'hola': '¡Hola! 👋 Soy tu asistente de JoltCab. ¿En qué puedo ayudarte?',
      'ayuda': 'Puedo ayudarte con:\n• Reservar un viaje\n• Información sobre tarifas\n• Estado de tu viaje\n• Contactar soporte',
      'precio': 'Las tarifas varían según la distancia y demanda. Usa el calculador en la app para obtener un precio exacto.',
      'viaje': 'Para reservar un viaje, ve a la pantalla "Book Ride" y selecciona tu origen y destino.',
    };

    const lowerMessage = message.toLowerCase();
    let response = 'Lo siento, el servicio de chat no está disponible. Por favor contacta a support@joltcab.com';

    // Buscar coincidencias en las respuestas predefinidas
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    return {
      success: true,
      response,
      timestamp: new Date().toISOString(),
    };
  }

  async getHistory(): Promise<ChatHistoryResponse> {
    return {
      success: false,
      messages: [],
    };
  }
}

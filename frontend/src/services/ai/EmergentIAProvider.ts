import { IAIProvider, ChatResponse, ChatHistoryResponse } from './IAIProvider';

// URLs base para Emergent IA
const EMERGENT_IA_URL = 'https://admin.joltcab.com/api/v1';
const EMERGENT_IA_URL_DEV = 'https://0ei9df5g.up.railway.app/api/v1';

export class EmergentIAProvider implements IAIProvider {
  name = 'Emergent IA';
  private baseUrl: string;

  constructor(useDev: boolean = false) {
    this.baseUrl = useDev ? EMERGENT_IA_URL_DEV : EMERGENT_IA_URL;
  }

  async sendMessage(
    message: string,
    userId?: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    try {
      console.log(`💬 [${this.name}] Sending message...`);
      const response = await fetch(`${this.baseUrl}/emergentIA/chat/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId,
        }),
      });

      const result = await response.json();

      if (result.success || result.response) {
        console.log(`✅ [${this.name}] Response received`);
        return {
          success: true,
          response: result.response || result.message,
          conversationId: result.conversationId,
          timestamp: result.timestamp || new Date().toISOString(),
        };
      }

      throw new Error('Failed to get AI response');
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
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (conversationId) params.append('conversationId', conversationId);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/emergentIA/chat/getHistory?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ [${this.name}] History retrieved`);
        return result;
      }

      throw new Error('Failed to get history');
    } catch (error: any) {
      console.error(`❌ [${this.name}] History error:`, error.message);
      return {
        success: false,
        messages: [],
      };
    }
  }
}

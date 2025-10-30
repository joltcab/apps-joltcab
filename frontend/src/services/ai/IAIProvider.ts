// Interfaz base para cualquier proveedor de IA
export interface IAIProvider {
  name: string;
  sendMessage(message: string, userId?: string, conversationId?: string): Promise<{
    success: boolean;
    response: string;
    conversationId?: string;
    timestamp: string;
  }>;
  getHistory?(userId: string, conversationId?: string, limit?: number): Promise<{
    success: boolean;
    messages: any[];
  }>;
}

// Tipos comunes
export interface ChatMessage {
  message: string;
  userId?: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  conversationId?: string;
  timestamp: string;
}

export interface ChatHistoryRequest {
  userId?: string;
  conversationId?: string;
  limit?: number;
}

export interface ChatHistoryResponse {
  success: boolean;
  messages: any[];
}

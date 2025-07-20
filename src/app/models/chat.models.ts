export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatSettings {
  webhookUrl: string;
  openaiApiKey: string;
  products: string[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  welcomeMessage: string;
  chatTitle: string;
  chatIcon: string;
  botName: string;
  userPlaceholder: string;
}

export interface LeadData {
  name: string;
  phone: string;
  product: string;
  questions: Array<{
    question: string;
    answer: string;
    timestamp: Date;
  }>;
}

export type ChatStep = 
  | 'collect-name'
  | 'collect-phone' 
  | 'collect-product'
  | 'ask-question'
  | 'answer-question'
  | 'ask-continue'
  | 'completed';

export interface AdminConfig {
  password: string;
}

export interface WebhookResponse {
  "תשובה": string;
  "thread_Id_cmd_gen": string;
  "סיום שיחה": string;
}
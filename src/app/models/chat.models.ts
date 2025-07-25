export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  buttons?: string[];
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatSettings {
  webhookUrl: string;
  chatWebhookUrl: string;
  settingsWebhookUrl: string;
  summaryWebhookUrl: string;
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
  collectName: boolean;
  collectPhone: boolean;
  collectProduct: boolean;
  nameLabel: string;
  phoneLabel: string;
  productLabel: string;
  adminaName: string;
  adminPhone: string;
  showCredit: boolean;
  creditText: string;
  creditUrl: string;
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
  | 'completed';

export interface AdminConfig {
  password: string;
}

export interface WebhookResponse {
  "תשובה": string;
  "thread_Id_cmd_gen": string;
  "סיום שיחה": string;
}
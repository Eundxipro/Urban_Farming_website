
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  topic?: string;
  timestamp?: string;
}


import type { Message } from './types';

export const INITIAL_CHAT_MESSAGES: Message[] = [
  {
    id: 'ai-initial',
    sender: 'ai',
    text: 'Mulai diskusi dengan AI.', // This text is mainly for ID, the component handles the actual message display
  }
];

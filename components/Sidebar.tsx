
import React from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface SidebarProps {
  chatHistory: Message[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ chatHistory, onSendMessage, onClearChat, isLoading }) => {
  return (
    <aside className="w-1/3 max-w-md flex-shrink-0 bg-white rounded-lg shadow-md flex flex-col" aria-label="Chat Panel">
      <header className="bg-blue-600 text-white p-4 rounded-t-lg text-center">
        <h1 className="text-xl font-bold">Gemini Asisten</h1>
        <p className="text-sm opacity-90">Koneksi ke Repositori (Simulasi)</p>
      </header>

      <div className="flex-grow p-4 overflow-y-auto" role="log">
        <div className="flex flex-col gap-4">
          {chatHistory.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      <footer className="p-4 border-t border-gray-200">
        <ChatInput onSendMessage={onSendMessage} onClearChat={onClearChat} isLoading={isLoading} />
      </footer>
    </aside>
  );
};

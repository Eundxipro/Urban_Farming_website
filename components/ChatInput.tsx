
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onClearChat, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik perintah Anda di sini..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
            rows={3}
            disabled={isLoading}
            aria-label="Chat Input"
        />
        <div className="flex gap-2">
            <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="flex-grow bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
                {isLoading ? 'Mengirim...' : 'Kirim'}
            </button>
            <button 
                type="button" 
                onClick={onClearChat}
                disabled={isLoading}
                className="flex-grow bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition"
            >
                Bersihkan Chat
            </button>
        </div>
    </form>
  );
};

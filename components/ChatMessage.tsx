
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    // Welcome message with special formatting
    if (message.id === 'ai-initial') {
        return (
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Mulai diskusi dengan AI</h3>
                <p>Anda bisa meminta AI untuk membantu menyusun, mengoreksi, atau merangkum dokumen di sebelah kanan.</p>
                <p className="mt-2 font-medium">Coba perintah: "Ringkas dokumen", "Lanjutkan penulisan", atau "Perbaiki tata bahasa".</p>
            </div>
        );
    }

    const isUser = message.sender === 'user';
    const wrapperClass = isUser ? 'flex justify-end' : 'flex justify-start';
    const bubbleClass = isUser 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-200 text-gray-800';

    return (
        <div className={wrapperClass}>
            <div className={`p-3 rounded-lg max-w-sm shadow-sm ${bubbleClass}`} role="article">
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
            </div>
        </div>
    );
};

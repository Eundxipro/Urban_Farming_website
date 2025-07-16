
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { processCommand } from './services/geminiService';
import { INITIAL_CHAT_MESSAGES } from './constants';
import type { Message } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>(INITIAL_CHAT_MESSAGES);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCommand = useCallback(async (command: string, isUserMessage: boolean) => {
    if (isUserMessage) {
        const newUserMessage: Message = {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: command,
        };
        setChatHistory(prev => [...prev, newUserMessage]);
    }

    setIsLoading(true);

    try {
      const updatedContent = await processCommand(documentContent, command);
      setDocumentContent(updatedContent);

      if (isUserMessage) {
        const newAiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Dokumen telah diperbarui berdasarkan perintah Anda.',
        };
        setChatHistory(prev => [...prev, newAiMessage]);
      }

    } catch (error) {
      console.error('Error processing command:', error);
      const errorAiMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.',
      };
      setChatHistory(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [documentContent]);

  const handleSendMessage = (message: string) => {
      handleCommand(message, true);
  };
  
  const handleDocAction = (command: string) => {
      handleCommand(command, false);
  };

  const handleClearChat = useCallback(() => {
      setChatHistory(INITIAL_CHAT_MESSAGES);
  }, []);
  
  const handleFileUpload = (content: string) => {
      setDocumentContent(content);
      const newAiMessage: Message = {
          id: `ai-upload-${Date.now()}`,
          sender: 'ai',
          text: 'File berhasil diunggah. Kontennya sekarang ada di editor.',
      };
      setChatHistory(prev => [...prev, newAiMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans p-4 gap-4">
      <Sidebar 
        chatHistory={chatHistory} 
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isLoading={isLoading}
      />
      <Editor 
        content={documentContent}
        setContent={setDocumentContent}
        onDocAction={handleDocAction}
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
      />
       <div className="absolute right-6 bottom-6 bg-gray-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-700 transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
      </div>
    </div>
  );
};

export default App;

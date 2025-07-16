
import React, { useRef } from 'react';
import { WandSparklesIcon, UploadIcon } from './icons';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  onDocAction: (command: string) => void;
  onFileUpload: (content: string) => void;
  isLoading: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; text: string; color: string; disabled: boolean }> = ({ onClick, text, color, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
    >
        <WandSparklesIcon className="w-5 h-5" />
        <span>{text}</span>
    </button>
);

export const Editor: React.FC<EditorProps> = ({ content, setContent, onDocAction, onFileUpload, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                onFileUpload(text);
            };
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else if (file.type === 'application/pdf') {
                alert('Fungsi unggah PDF sedang dalam pengembangan. Silakan coba file .txt.');
            } else {
                alert('Hanya file .txt yang didukung saat ini.');
            }

            // Clear the input value to allow re-uploading the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <main className="w-2/3 flex-grow bg-white rounded-lg shadow-md flex flex-col" aria-labelledby="editor-heading">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 id="editor-heading" className="text-xl font-bold text-gray-800">Dokumen Penelitian Anda</h2>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.pdf"
                onChange={handleFileChange}
                aria-hidden="true"
            />
            <button
                onClick={triggerFileSelect}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-semibold"
            >
                <UploadIcon className="w-5 h-5" />
                <span>Unggah Referensi (PDF/TXT)</span>
            </button>
        </header>

        <div className="flex-grow p-1 relative">
             <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Konten dokumen Anda akan muncul di sini. Anda bisa mengetik atau menempelkan teks, atau mengunggah file referensi."
                className="w-full h-full p-4 border-0 rounded-md resize-none focus:ring-0 text-gray-700 leading-relaxed disabled:bg-gray-50"
                disabled={isLoading}
                aria-label="Document Content"
            />
            {isLoading && (
                 <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                 </div>
            )}
        </div>
        
        <footer className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
            <ActionButton text="Ringkas Dokumen" onClick={() => onDocAction('Ringkas Dokumen')} color="bg-purple-500 hover:bg-purple-600" disabled={isLoading || !content} />
            <ActionButton text="Lanjutkan Penulisan" onClick={() => onDocAction('Lanjutkan Penulisan')} color="bg-indigo-500 hover:bg-indigo-600" disabled={isLoading || !content} />
            <ActionButton text="Perbaiki Tata Bahasa" onClick={() => onDocAction('Perbaiki Tata Bahasa')} color="bg-teal-500 hover:bg-teal-600" disabled={isLoading || !content} />
        </footer>
    </main>
  );
};

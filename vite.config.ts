import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Atau plugin Vue jika Anda pakai Vue

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        plugins: [react()], // Biarkan ini sesuai yang sudah ada
        base: '/', // <-- PASTIKAN BARIS INI ADA DAN ISI NYA '/'
        // Bagian 'define' yang lama HARUS DIHAPUS SEPENUHNYA dari sini
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});

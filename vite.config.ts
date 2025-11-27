import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps process.env.API_KEY to the build environment variable
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevents crashes if other process.env access exists
      'process.env': {}
    },
    server: {
      host: true
    }
  };
});
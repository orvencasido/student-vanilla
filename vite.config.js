import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        agreement: resolve(__dirname, 'agreement.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        journey: resolve(__dirname, 'journey.html'),
        messages: resolve(__dirname, 'messages.html'),
        profile: resolve(__dirname, 'profile.html'),
        quest: resolve(__dirname, 'quest.html'),
      },
    },
  },
});

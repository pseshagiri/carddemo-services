import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Forward /api/* to the API Gateway during development.
      // This avoids CORS issues because the browser sees requests as same-origin.
      // API Gateway (port 8080) routes to microservices:
      //   /api/auth/**         → identity-service  (:8081)
      //   /api/customers/**    → customer-service  (:8082)
      //   /api/accounts/**     → account-service   (:8083)
      //   /api/cards/**        → card-service      (:8084)
      //   /api/transactions/** → transaction-service (:8085)
      //   /api/payments/**     → payment-service   (:8086)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

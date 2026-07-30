import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/components/AuthProvider';
import { PremiumProvider } from '@/lib/premium-context';
import { ThemeProvider } from '@/components/ThemeProvider';

// Service Worker Registration for PWA & Push Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('PWA ServiceWorker registered successfully with scope: ', registration.scope);
      },
      (err) => {
        console.log('PWA ServiceWorker registration failed: ', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <App />
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

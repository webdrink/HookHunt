import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GameHost from './framework/core/GameHost';
import { registerSW } from 'virtual:pwa-register';

// Import HookHunt module to ensure it's registered
import './HookHuntModule';

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Only register service worker in production
  // Prefix variable with underscore to acknowledge intentional unused unless future UI prompt is added
  const _updateSW = registerSW({
    onNeedRefresh() {
      // Logic to prompt user to refresh for new content
      console.log('New content available, please refresh.');
    },
    onOfflineReady() {
      // Logic to notify user app is ready for offline use
      console.log('App ready for offline use.');
    },
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GameHost />
  </React.StrictMode>
);

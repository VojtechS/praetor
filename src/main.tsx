import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import '@styles/global.scss';

async function enableMockApi(): Promise<void> {
  if (String(import.meta.env.VITE_USE_MOCK_API) === 'false') {
    return;
  }

  const { worker } = await import('./mocks/browser.ts');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMockApi().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

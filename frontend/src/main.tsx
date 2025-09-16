import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from './slices/store/store.ts';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';
import { pdfjs } from 'react-pdf';

// 👇 ye add karo once globally
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

import { createRoot } from 'react-dom/client';
import '@/styles/reset.css';
import App from './App.tsx';
import mitt from 'mitt';

window.bus = mitt();

createRoot(document.getElementById('root')!).render(<App />);

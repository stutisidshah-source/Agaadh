import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
}

// Simple pub/sub for toasts so we don't need a heavy context provider
type Listener = (toast: ToastOptions) => void;
let listeners: Listener[] = [];

export const toast = (message: string, type: ToastType = 'info') => {
  listeners.forEach(listener => listener({ message, type }));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<(ToastOptions & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastOptions) => {
      const id = Date.now();
      setToasts(prev => [...prev, { ...newToast, id }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
    
    listeners.push(handleToast);
    return () => {
      listeners = listeners.filter(l => l !== handleToast);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`glass-panel px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-8 fade-in duration-300 flex items-center gap-3 border-l-4 ${
            t.type === 'success' ? 'border-l-mid-teal-light text-mid-teal-light' : 
            t.type === 'error' ? 'border-l-red-400 text-red-400' : 
            'border-l-cyan-bright text-cyan-bright'
          }`}
        >
          <span className="font-mono text-sm tracking-wide">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

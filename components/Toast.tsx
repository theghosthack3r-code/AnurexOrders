import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // Corresponds to AppContext timeout
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    // Allow animation to finish before calling onClose
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 w-full max-w-xs p-4 rounded-lg shadow-lg bg-deep-teal text-white flex items-center justify-between transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="font-semibold">{message}</div>
      <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;

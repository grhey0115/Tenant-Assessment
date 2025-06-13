import React, { useEffect, useState } from 'react';

interface NotificationModalProps {
  title: string;
  message: string;
  type: "info" | "success" | "error";
  onClose: () => void;
  isVisible: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  title,
  message,
  type,
  onClose,
  isVisible,
}) => {
  const [modalClasses, setModalClasses] = useState('');
  const [icon, setIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    let classes = 'bg-white p-6 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out border ';
    let currentIcon: React.ReactNode = null;

    if (type === "success") {
      classes += 'border-green-300';
      currentIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else if (type === "error") {
      classes += 'border-red-300';
      currentIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else {
      classes += 'border-blue-300';
      currentIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02M10.5 19.5h3m-6.75-9.75h9.75M18 5.25H6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25z" /></svg>;
    }
    setModalClasses(classes);
    setIcon(currentIcon);

    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div id="modalContent" className={modalClasses} role="alert">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 id="modalTitle" className="font-bold text-xl text-slate-800">{title}</h3>
              <p id="modalMessage" className="text-sm text-slate-600 mt-1">{message}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors duration-150" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 
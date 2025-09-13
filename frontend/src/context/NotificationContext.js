import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext({
  success: (msg) => {},
  error: (msg) => {},
  info: (msg) => {},
});

export const NotificationProvider = ({ children }) => {
  const value = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast.info(msg),
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);

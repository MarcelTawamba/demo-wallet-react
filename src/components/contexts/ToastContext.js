import useI18Language from 'hooks/useI18Language';
import React, { useContext, useState } from 'react';

const ToastContext = React.createContext({
  config: {},
  showToast: () => {},
  methods: {
    showToast: () => {},
    deactivate: () => {},
  },
});

function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined)
    throw new Error('useToast must be used within a ToastProvider');

  return context;
}

function ToastProvider({ children }) {
  const defaultConfig = {
    active: false,
    variant: 'info',
    duration: 3000,
    text: '',
  };
  const { getI18Translation } = useI18Language();

  const [config, setConfig] = useState(defaultConfig);

  const showToast = ({ text, languageContext = {}, ...restArgs }) =>
    !config.active &&
    setConfig({
      ...defaultConfig,
      active: true,
      text: getI18Translation(text, languageContext),
      ...restArgs,
    });

  return (
    <ToastContext.Provider
      value={{
        config,
        showToast,
        methods: {
          showToast,
          deactivate: () => setConfig({ ...config, active: false }),
        },
      }}>
      {children}
    </ToastContext.Provider>
  );
}

export { ToastContext, ToastProvider, useToast };

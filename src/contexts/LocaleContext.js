import React, { createContext, useState, useEffect } from 'react';

export const LocaleContext = createContext();

const translations = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    addTransaction: 'Add Transaction',
    balance: 'Balance',
    income: 'Income',
    expense: 'Expense',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    type: 'Type',
    visualizations: 'Visualizations',
    budgetManagement: 'Budget Management',
    transactionHistory: 'Transaction History',
    dataManagement: 'Data Management',
    notifications: 'Notifications & Reminders',
    offlineMode: 'Offline Mode',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    sync: 'Sync Data',
    lastSync: 'Last Sync',
    settings: 'Settings'
  },
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    addTransaction: 'Agregar Transacción',
    balance: 'Balance',
    income: 'Ingresos',
    expense: 'Gastos',
    description: 'Descripción',
    amount: 'Monto',
    category: 'Categoría',
    date: 'Fecha',
    type: 'Tipo',
    visualizations: 'Visualizaciones',
    budgetManagement: 'Gestión de Presupuesto',
    transactionHistory: 'Historial de Transacciones',
    dataManagement: 'Gestión de Datos',
    notifications: 'Notificaciones y Recordatorios',
    offlineMode: 'Modo Sin Conexión',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    language: 'Idioma',
    sync: 'Sincronizar Datos',
    lastSync: 'Última Sincronización',
    settings: 'Configuración'
  }
};

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const savedLocale = localStorage.getItem('locale');
    return savedLocale || navigator.language.split('-')[0] || 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = (key) => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };

  const value = {
    locale,
    setLocale,
    t,
    availableLocales: Object.keys(translations)
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}; 
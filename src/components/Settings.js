import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LocaleContext } from '../contexts/LocaleContext';
import './Settings.css';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { locale, setLocale, t, availableLocales } = useContext(LocaleContext);

  return (
    <div className="settings-container">
      <h2>{t('settings')}</h2>
      
      <div className="settings-group">
        <h3>{t('language')}</h3>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="settings-select"
        >
          {availableLocales.map(lang => (
            <option key={lang} value={lang}>
              {lang === 'en' ? 'English' : 'Español'}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-group">
        <h3>{isDarkMode ? t('darkMode') : t('lightMode')}</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default Settings; 
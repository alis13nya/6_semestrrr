import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();
  const [count, setCount] = useState(0);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="container mt-3">
      <div className="btn-group" role="group">
        <button
          type="button"
          className={`btn    ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
          data-testid="en"
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
        <button
          type="button"
          className={`btn  me-3 ${i18n.language === 'ru' ? 'btn-primary' : 'btn-outline-primary'}`}
          data-testid="ru"
          onClick={() => handleLanguageChange('ru')}
        >
          Русский
        </button>
      </div>
      <button
        type="button"
        className="btn btn-info  align-self-center me-3"
        data-testid="counter"
        onClick={handleIncrement}
      >
        {t('clicks', { count })}
      </button>
      <button
        type="button"
        className="btn btn-warning me-3"
        data-testid="reset"
        onClick={handleReset}
        
      >
        {t('reset')}
      </button>
    </div>
  );
};

export default App;

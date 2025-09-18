import React, { useContext, useEffect } from 'react';
import './Drawer.css';
import { SearchContext } from '../../contexts/SearchContext';
import Categories from '../Category copy/Categories';
import { useTranslation } from 'react-i18next';

function Drawer() {
  const { openDrawer, setOpenDrawer } = useContext(SearchContext);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'uk', name: 'Українська', country_code: 'ua' },
    { code: 'de', name: 'Deutsch', country_code: 'de' },
    { code: 'en', name: 'English', country_code: 'gb' },
  ];

  // Закриття при натисканні Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpenDrawer]);

  // Заблокувати прокручування при відкритті
  useEffect(() => {
    if (openDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => (document.body.style.overflow = 'auto');
  }, [openDrawer]);

  const isActiveLanguage = (code) => i18n.language.startsWith(code);

  // Закриття при натисканні на сіру зону
  const handleOverlayClick = (event) => {
    // Закрити, тільки якщо клік був саме на overlay
    if (event.target.classList.contains('overlay')) {
      setOpenDrawer(false);
    }
  };

  return (
    <div
      className={`overlay ${openDrawer ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >

      <a
  href="https://t.me/stuttgart4uk" // заміни на свій паблік/чат
  target="_blank"
  rel="noopener noreferrer"
  className="telegram-fab"
>
  <img
    src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png"
    alt="Telegram"
  />
</a>

<a
  href="https://www.instagram.com/your_username" // заміни на свій інстаграм
  target="_blank"
  rel="noopener noreferrer"
  className="instagram-fab"
>
  <img
    src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
    alt="Instagram"
  />
</a>


      <div className={`drawer ${openDrawer ? 'visible' : ''}`}>
        <div className="drawer-header">
          <h1>{t('filter', { defaultValue: 'Фільтр' })}</h1>
          <div className="close-button" onClick={() => setOpenDrawer(false)}>
            ✕
          </div>
        </div>
        <Categories />
        <div className="language-selector">
          {languages.map(({ code, name, country_code }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`language-button ${
                isActiveLanguage(code) ? 'active' : ''
              }`}
            >
              <span
                className={`flag-icon flag-icon-${country_code}`}
                style={{ marginRight: '8px' }}
              ></span>
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Drawer;

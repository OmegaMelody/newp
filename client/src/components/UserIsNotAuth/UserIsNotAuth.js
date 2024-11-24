import React from 'react';
import './UserIsNotAuth.css';
import { useTranslation } from 'react-i18next';

const UserIsNotAuth = ({ onLoginClick }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className='noauth'>
      <div className='message-container'>
        <h3>{t('UserIsNotAuth.UserIsNot', { defaultValue: 'Ви не увійшли у свій акаунт. Щоб мати доступ до профілю, авторизуйтесь' })}</h3>
        
        {/* Обробник onClick прив’язаний тільки до кнопки */}
        <button onClick={onLoginClick} className="super-duper-button">
        {t('UserIsNotAuth.Log in', { defaultValue: 'Авторизуватись' })}
          
        </button>
      </div>
    </div>
  );
};

export default UserIsNotAuth;

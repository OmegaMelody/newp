import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { GoogleLoginButton } from 'react-social-login-buttons';
import './LoginPage.css';
const startURL = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  
  const handleGoogleLogin = () => {
    window.location.href = `${startURL}/auth/google`;
  };

  // Імітація успішної авторизації користувача
  const authenticateUser = async () => {
    // логіка авторизації користувача
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  // Функція для обробки авторизації
  const handleAuthSuccess = async () => {
    await authenticateUser();
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    const savedActiveTab = localStorage.getItem('activeTab');
    localStorage.removeItem('redirectPath');
    localStorage.removeItem('activeTab');
    navigate(redirectPath, { state: { activeTab: savedActiveTab, fromLogin: true } });
  };
  
  

  return (
    <div className="auth-container">
      <h1 className="auth-title">  {t('LoginPage.GoogleL', { defaultValue: 'Авторизуватись' })}</h1>
      <div className="login-button-wrapper">
        <GoogleLoginButton onClick={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
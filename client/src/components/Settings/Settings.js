import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import '../Settings/Settings.css';
import defaultProfilePicture from '../../images/avatar.png';
import UserIsNotAuth from '../UserIsNotAuth/UserIsNotAuth';
import Modal from '../Modal/Modal'; // Імплементуйте модальне вікно
import LoginPage from '../LoginPage/LoginPage';
import { SearchContext } from '../../contexts/SearchContext';

const Setttings = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { showModal, 
    setShowModal } = useContext(SearchContext);
    
    const handleLoginClick = () => {
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
    };
  

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:7888/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      navigate('/Fpage');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div>
        <Header showInput={false} showBack={true} showFilter={false} showProfil={false} />
        <div className="loading">
          <div onLoginClick={() => setShowModal(true)}>
          <UserIsNotAuth onLoginClick={() => setShowModal(true)} />
          {/* <UserIsNotAuth onLoginClick={handleLoginClick}  /> */}

          </div>
          <Modal show={showModal} onClose={() => setShowModal(false)}>
          <LoginPage />
        </Modal>
        </div>
      </div>
    );
  }

  const userProfilePicture = user.picture ? user.picture : defaultProfilePicture;

  return (
    <>
     <Header showInput={false} showBack={true} showFilter={false} showProfil={false} showInst={true} />
      <div className="centered-container">
      
        <h3>testpage</h3>
      </div>
    </>
  );
};

export default Setttings;

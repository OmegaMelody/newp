import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import '../SettingsModal/SettingsModal.css';
import defaultProfilePicture from '../../images/avatar.png';
import UserIsNotAuth from '../UserIsNotAuth/UserIsNotAuth';
import Modal from '../Modal/Modal';
import LoginPage from '../LoginPage/LoginPage';
import { SearchContext } from '../../contexts/SearchContext';
import { useTranslation } from 'react-i18next';

const SettingsModal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal, setShowModal } = useContext(SearchContext);
  const { t, i18n } = useTranslation();

  const handleLoginClick = () => {
    localStorage.setItem('redirectPath', location.pathname);
    navigate('/login');
  };

  if (!user) {
    return (
      <div>
        <Header showInput={false} showBack={true} showFilter={false} showProfil={false} />
        <div className="loading">
          <div onLoginClick={() => setShowModal(true)}>
            <UserIsNotAuth onLoginClick={handleLoginClick} />
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
      <Header
        showInput={false}
        showBack={true}
        showFilter={false}
        showProfil={false}
        showInst={true}
      />
      <div className="centered-container1">
        <div className="profile-page">
          {/* Приберемо заголовок або замінимо його на більш відповідний */}
          {/* <div className="profile-header">
            <h2>Edit Profile</h2>
          </div> */}
          <div className="profile-content">
            <div className="profile-photo-section">
              <img src={userProfilePicture} alt="User Profile" className="profile-photo" />
              <button className="profile-photo-change">Change Profile Photo</button>
            </div>
            <div className="profile-info">
              <div className="profile-info-item">
                <label>{t('SettingsModal.Name', { defaultValue: 'Name' })}</label>
                <input type="text" value={user.name} readOnly />
              </div>
              <div className="profile-info-item">
                <label>{t('SettingsModal.Username', { defaultValue: 'Username' })}</label>
                <input type="text" value={user.username} readOnly />
              </div>
              <div className="profile-info-item">
                <label>{t('SettingsModal.Pronouns', { defaultValue: 'Pronouns' })}Pronouns</label>
                <input type="text" value={user.pronouns} readOnly />
              </div>
              <div className="profile-info-item">
              <label>{t('SettingsModal.Bio', { defaultValue: 'Bio' })}</label>
              <input type="text" value={user.bio} readOnly />
            </div>

              <div className="profile-info-item">
                <label>{t('SettingsModal.Links', { defaultValue: 'Links' })}</label>
                <input type="text" value={user.links} readOnly />
              </div>
            </div>
            <div className="profile-actions">
              <Link to="/switch" className="profile-action-link">
              {t('SettingsModal.Switch', { defaultValue: 'Switch to Professional Account' })}
              </Link>
              <Link to="/create-avatar" className="profile-action-link">
              {t('SettingsModal.Avatar', { defaultValue: 'Create Avatar' })}
              
              </Link>
              <Link to="/personal-info" className="profile-action-link">
              {t('SettingsModal.Personal', { defaultValue: 'Personal Information Settings' })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import './ProfilePage.css';
import defaultProfilePicture from '../../images/avatar.png';
import UserIsNotAuth from '../UserIsNotAuth/UserIsNotAuth';
import Modal from '../Modal/Modal';
import LoginPage from '../LoginPage/LoginPage';
import { SearchContext } from '../../contexts/SearchContext';
import EditRangeSlider from '../slider/editslider'
import StarRating from '../slider/StarRating/StarRating';
import { useTranslation } from 'react-i18next';
import ReviewItem from '../ReviewCard/ReviewItem';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal, setShowModal, customRating, setCustomRating, setRating, currentRating, setCurrentRating } = useContext(SearchContext);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [menuVisible, setMenuVisible] = useState(null);

  const startURL = process.env.REACT_APP_API_URL;

  const handleLoginClick = () => {
    localStorage.setItem('redirectPath', location.pathname);
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${startURL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      navigate('/Fpage');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getReviews = useCallback(async () => {
    if (user && user.id) {
      const response = await fetch(`${startURL}/api/reviews/getUserReviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const jsonData = await response.json();
      setReviews(jsonData);
      setCustomRating(0);
      setRating(0);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getReviews();
    }
  }, [user, getReviews]);

  if (!user) {
    return (
      <div>
        <Header showInput={false} showBack={true} showFilter={false} showProfil={false} />
        <div className="loading">
        {/* <div onClick={() => setShowModal(true)}> */}
          
          <div >
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
  const handleEdit = (reviewId, currentReview, currentRating) => {
    setEditingReviewId(reviewId);
    setNewReviewText(currentReview);
    setCustomRating(currentRating); // Передаємо поточну оцінку до контексту
    setCurrentRating(currentRating); // Установлюємо поточний рейтинг в локальний стан
    setMenuVisible(null);
  };
  


  const handleSaveEdit = async (reviewId) => {
    try {
      const response = await fetch(`${startURL}/api/reviews/editReview`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          newReview: newReviewText,
          newRating: currentRating, // Використовуємо локальний стан для збереження нового рейтингу
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update review');
      }
  
      const result = await response.json();
      console.log('Review updated successfully:', result);
      getReviews();
      setEditingReviewId(null);
    } catch (error) {
      console.error('Error updating review:', error.message);
    }
  };
    

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`${startURL}/api/reviews/deleteReview/${reviewId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
  
      const result = await response.json();
      console.log('Review deleted successfully:', result);
      getReviews();
    } catch (error) {
      console.error('Помилка видалення відгуку:', error);
    }
  };
  const toggleMenu = (reviewId) => {
    setMenuVisible(menuVisible === reviewId ? null : reviewId);
  };

  return (
    <>
      <Header showInput={false} showBack={true} showFilter={false} showProfil={false} showInst={true} />
      <div className="profile-photo-section">
        <img src={userProfilePicture} alt="User Profile" className="profile-photo" />
        <div className="profile-name"><h4>{user.name}</h4></div>
      </div>
      <div className='btnrd'>
        <Link to="/SettingsProfile" className="rem-button-link">
          <button className="rem-button">{t('ProfilPage.Edit account', { defaultValue: 'Редагувати акаунт' })}</button>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          {t('ProfilPage.Sign out of the account', { defaultValue: 'Вийти з акаунту' })}
        </button>
      </div>
     

<div className='yreview'>
  <div className='yr'>
    <h1>{t('ProfilPage.Your feedback', { defaultValue: 'Ваші відгуки' })}</h1>
  </div>
  {reviews.length > 0 ? (
    reviews.map((review, index) => (
      <ReviewItem
        key={index}
        reviewData={review}
        currentUser={user}
        editingReviewId={editingReviewId}
        setEditingReviewId={setEditingReviewId}
        newReviewText={newReviewText}
        setNewReviewText={setNewReviewText}
        currentRating={currentRating}
        setCurrentRating={setCurrentRating}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSaveEdit={handleSaveEdit}
        t={t}
        isProfilePage={true}
      />
    ))
  ) : (
    <div className='noth'>{t('ProfilPage.You havenot', { defaultValue: 'Ви ще не залишили жодного відгуку.' })}</div>
  )}
</div>

    </>
  );
};

export default ProfilePage;

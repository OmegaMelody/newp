import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../../contexts/SearchContext';
import RangeSlider from '../slider/customslider';
import './Rewiev.css';
import StarRatingvis from '../slider/StarRatingvis/StarRatingvis';
import StarRating from '../slider/StarRating/StarRating';
import { useTranslation } from 'react-i18next';
import ReviewItem from '../ReviewCard/ReviewItem';



import UserIsNotAuth from '../UserIsNotAuth/UserIsNotAuth'; // Перевірте правильність шляху до файлу

import UserNotAuthorized from '../userIsNotAuth2.jsx/UserNotAuthorized '; // Імпортуємо потрібний компонент
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../Modal/Modal';
import LoginPage from '../LoginPage/LoginPage';
import EditRangeSlider from '../slider/editslider';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function Rewiev({ itemsid, isAuthenticated }) {
  const { t, i18n } = useTranslation();

  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const { rating, showModal, setShowModal, post, setPost } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [menuVisible, setMenuVisible] = useState(null);


  const [likes, setLikes] = useState({}); // Об'єкт для зберігання лайків
  const [dislikes, setDislikes] = useState({}); // Об'єкт для зберігання дизлайків
  const [userReactions, setUserReactions] = useState({}); //



  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab, customRating, setCustomRating, setRating, currentRating, setCurrentRating} = useContext(SearchContext);

  const startURL = process.env.REACT_APP_API_URL;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (value.length <= 30) {
      setErrorMessage('');
    } else {
      setErrorMessage("Ім'я користувача не повинно перевищувати 30 символів");
    }
  };

  const save = async () => {
    if (userName.length > 30) {
      setErrorMessage("Ім'я користувача не повинно перевищувати 30 символів");
      return;
    }
    setErrorMessage('');

    const data = {
      rating,
      review,
      idMarket: itemsid,
      user_name: user.name,
      user_id: user.id
    };

    try {
      const response = await fetch(`${startURL}/api/reviews/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();
      getReviews();
      setReview('');
    } catch (error) {
      console.error("Помилка надсилання відгуку:", error);
    }
  };

  const getReviews = useCallback(async () => {
    const response = await fetch(`${startURL}/api/reviews/getreviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const jsonData = await response.json();
    setReviews(jsonData);
    setCustomRating(0);
    setRating(0);
  
    // Отримуємо реакції після отримання відгуків
    const reviewIds = jsonData.map(review => review.review_id);
    const reactionsResponse = await fetch(`${startURL}/api/reviews/getReactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds, userId: user?.id }),
    });
    const reactionsData = await reactionsResponse.json();
    const { counts, userReactions } = reactionsData;
  
    // Оновлюємо стани лайків та дизлайків
    const likesData = {};
    const dislikesData = {};
    counts.forEach(count => {
        likesData[count.review_id] = parseInt(count.likes);
        dislikesData[count.review_id] = parseInt(count.dislikes);
    });
  
    setLikes(likesData);
    setDislikes(dislikesData);
    setUserReactions(userReactions);
  }, [id, user]);
  

  const getPostTitle = useCallback(async () => {
    const response = await fetch(`${startURL}/api/post/getPostById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const jsonData = await response.json();
    setPostTitle(jsonData.title);
  }, [id]);

  useEffect(() => {
    getReviews();
    getPostTitle();
  }, [getReviews, getPostTitle]);

  const handleEdit = (reviewId, currentReview, currentRating) => {
    setEditingReviewId(reviewId);
    setNewReviewText(currentReview);
    setCurrentRating(currentRating); // Стан для оцінки
    setCustomRating(currentRating); // Це те, що передається у слайдер
    setMenuVisible(null);
  };

  async function handleSaveReview(reviewId, newReview, newRating) {
    try {
      const response = await fetch(`${startURL}/api/reviews/editReview`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          newReview,
          newRating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update review');
      }

      const result = await response.json();
      console.log('Review updated successfully:', result);
      getReviews();
    } catch (error) {
      console.error('Error updating review:', error.message);
    }
  }

  const handleSaveEdit = (reviewId) => {
    // Використовуйте currentRating при збереженні
    handleSaveReview(reviewId, newReviewText, currentRating);
    setEditingReviewId(null);
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

  const handleLoginClick = () => {
    localStorage.setItem('redirectPath', location.pathname);
    localStorage.setItem('activeTab', activeTab);
    navigate('/login');
  };

  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  const test = () => {
    setShowModal(true);
  };

  const handleLike = async (reviewId) => {
    if (!user) return; // Якщо користувач не авторизований
  
    try {
      if (userReactions[reviewId] === 1) {
        // Якщо лайк вже встановлено, знімаємо його
        await fetch(`${startURL}/api/reviews/removeReaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId, userId: user.id }),
        });
  
        setUserReactions((prev) => ({ ...prev, [reviewId]: null }));
        setLikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 1) - 1 }));
      } else {
        // Якщо лайк не встановлений, додаємо його
        await fetch(`${startURL}/api/reviews/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId, userId: user.id, reactionType: 1 }),
        });
  
        // Якщо раніше був дизлайк, знімаємо його
        if (userReactions[reviewId] === -1) {
          setDislikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 1) - 1 }));
        }
  
        setUserReactions((prev) => ({ ...prev, [reviewId]: 1 }));
        setLikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
      }
    } catch (error) {
      console.error("Помилка при лайку:", error);
    }
  };
  
  
  const handleDislike = async (reviewId) => {
    if (!user) return;
  
    try {
      if (userReactions[reviewId] === -1) {
        // Якщо дизлайк вже встановлено, знімаємо його
        await fetch(`${startURL}/api/reviews/removeReaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId, userId: user.id }),
        });
  
        setUserReactions((prev) => ({ ...prev, [reviewId]: null }));
        setDislikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 1) - 1 }));
      } else {
        // Якщо дизлайк не встановлений, додаємо його
        await fetch(`${startURL}/api/reviews/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewId, userId: user.id, reactionType: -1 }),
        });
  
        // Якщо раніше був лайк, знімаємо його
        if (userReactions[reviewId] === 1) {
          setLikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 1) - 1 }));
        }
  
        setUserReactions((prev) => ({ ...prev, [reviewId]: -1 }));
        setDislikes((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
      }
    } catch (error) {
      console.error("Помилка при дизлайку:", error);
    }
  };
  
  

  return (
    <div className="post-review">
      <div className='Users'>
{isAuthenticated && reviews.filter(r => String(r.user_id) === String(user?.id)).length < 2 ? (
  <>
    <h3>{t('Review.Leave a review', { defaultValue: 'Залиште відгук' })}</h3>
    <div className='slider'>
      <StarRatingvis onClick={() => setShowModal(true)} />
    </div>
  </>
) : (
  <div className='ahtung'>
    {!isAuthenticated && (
      <>
        <h3>{t('Review.Leave a review', { defaultValue: 'Залиште відгук' })}</h3>
        <UserNotAuthorized onLoginClick={handleLoginClick} /> 
      </>
    )}
  </div>
)}


        <Modal show={showModal} onClose={() => setShowModal(false)} itemsid={itemsid} getReviews={getReviews} />
        <div className='uop'>
          <h1>{t('Review.Reviews', { defaultValue: 'Відгуки:' })}</h1>
        </div>
        {reviews && reviews.length > 0 ? (
          reviews.map((elem, index) => (
            elem ? (
              <ReviewItem
                key={index}
                reviewData={elem}
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
                handleLike={handleLike}
                handleDislike={handleDislike}
                userReactions={userReactions}
                likes={likes}
                dislikes={dislikes}
                t={t}
                isProfilePage={false}
              />
            ) : null
          ))
        ) : (
          <div className='reviewsnon'>{t('Review.There are no reviews', { defaultValue: 'Відгуки відсутні.' })}</div>
        )}
      </div>
    </div>
  );
}

export default Rewiev;
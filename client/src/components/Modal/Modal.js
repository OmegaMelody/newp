import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Modal.css';
import IconLabelButtons from '../Sendbtn/Sendbtn';
import { SearchContext } from '../../contexts/SearchContext';
import RangeSlider from '../slider';
import '../../components/Rewiev/Rewiev.css';
import UserIsNotAuth from '../UserIsNotAuth/UserIsNotAuth';
import { AuthContext } from '../../contexts/AuthContext';
import LoginPage from '../LoginPage/LoginPage';
import StarRating from '../slider/StarRating/StarRating';
import { useTranslation } from 'react-i18next';

const Modal = ({ show, onClose, itemsid, getReviews }) => {
  const { t } = useTranslation();
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { rating, setShowModal, setRating } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  if (!show) {
    return null;
  }

  const save = async () => {
    if (rating === 0) {
      setErrorMessage(t('Modal.EnterRating', { defaultValue: 'Будь ласка, оберіть рейтинг.' }));
      return;
    }

    setErrorMessage('');

    const data = {
      rating,
      review,
      idMarket: itemsid,
      user_name: user.name,
      user_id: user.id,
    };

    try {
      const response = await fetch('http://localhost:7888/api/reviews/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();
      getReviews();
      setReview('');
      setShowModal(false);
    } catch (error) {
      console.error("Помилка надсилання відгуку:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <hr />
        <div className="form-outline">
          <div className='slider'>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              editable={true}
            />
          </div>
          {errorMessage && (
            <div className={`error-message ${errorMessage ? 'show' : ''}`}>
              {errorMessage}
            </div>
          )}
          <textarea
            className="form-control"
            rows="3"
            maxLength="300"
            placeholder={t('Review.Enter a review', { defaultValue: 'Введіть відгук' })}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className='Sendbtn' onClick={save}>
            <IconLabelButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

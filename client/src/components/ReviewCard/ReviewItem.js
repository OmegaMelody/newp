// ReviewItem.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../slider/StarRating/StarRating';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './ReviewItem.css';

function ReviewItem({
  reviewData,
  currentUser,
  editingReviewId,
  setEditingReviewId,
  newReviewText,
  setNewReviewText,
  currentRating,
  setCurrentRating,
  handleEdit,
  handleDelete,
  handleSaveEdit,
  handleLike,
  handleDislike,
  userReactions,
  likes,
  dislikes,
  t,
  isProfilePage,
}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className={isProfilePage ? 'Post1' : 'Post'}>
      <div className="post-header">
        <div className='userName'><b>{reviewData.user_name}</b></div>
        {currentUser && String(currentUser.id) === String(reviewData.user_id) && (
          <div className="menu-container">
            <div>
              <button className="menu-button" onClick={toggleMenu}>⋮</button>
            </div>
            {menuVisible && (
              <div className="menu">
                <button onClick={() => handleEdit(reviewData.review_id, reviewData.reviews, reviewData.grades)}>
                  {t('Review.Edit', { defaultValue: 'Редагувати' })}
                </button>
                <button onClick={() => handleDelete(reviewData.review_id)}>
                  {t('Review.Delete', { defaultValue: 'Видалити' })}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <StarRating
        rating={editingReviewId === reviewData.review_id ? currentRating : reviewData.grades}
        onRatingChange={(newRating) => setCurrentRating(newRating)}
        editable={editingReviewId === reviewData.review_id}
      />
      {isProfilePage && !editingReviewId && (
        <div className="PostTitle">
          <Link to={`/post/${reviewData.store_id}`} className="post-link">
            <b>{reviewData.post_title || 'Без назви'}</b>
          </Link>
        </div>
      )}
      {editingReviewId === reviewData.review_id ? (
        <>
          <textarea
            className="form-control"
            rows="3"
            maxLength="300"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
          />
          <div className={isProfilePage ? 'button-container' : 'btnc'}>
            <button className={isProfilePage ? 'savebtn' : 'savebtnr'} onClick={() => handleSaveEdit(reviewData.review_id)}>
              {t('Review.Save', { defaultValue: 'Зберегти' })}
            </button>
            <button className={isProfilePage ? 'cancelbtn' : 'cancelbtnr'} onClick={() => setEditingReviewId(null)}>
              {t('Review.Cancel', { defaultValue: 'Скасувати' })}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='Review'><b>{t('Review.OneR', { defaultValue: 'Відгук:' })}</b> {reviewData.reviews}</div>
          {!isProfilePage && (
            <div className="reaction-buttons">
              <button
                className={`like-button ${userReactions[reviewData.review_id]?.liked ? 'active' : ''}`}
                onClick={() => handleLike(reviewData.review_id)}
              >
                <FaThumbsUp />
                <span className="reaction-count">{likes[reviewData.review_id] || 0}</span>
              </button>
              <button
                className={`dislike-button ${userReactions[reviewData.review_id]?.disliked ? 'active' : ''}`}
                onClick={() => handleDislike(reviewData.review_id)}
              >
                <FaThumbsDown />
                <span className="reaction-count">{dislikes[reviewData.review_id] || 0}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewItem;

import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange, editable }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleRatingChange = (newRating) => {
    if (editable) {
      setCurrentRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
        <FaStar
          key={star}
          size={24}
          style={{
            marginRight: 4,
            cursor: editable ? 'pointer' : 'default',
            color: star <= currentRating ? '#ffc107' : '#e4e5e9',
          }}
          onClick={() => handleRatingChange(star)}
        />
      ))}
    </div>
  );
};


export default StarRating;

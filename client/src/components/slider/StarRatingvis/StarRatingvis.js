import React, { useState, useContext,  } from 'react';
import { FaStar } from 'react-icons/fa';
import { SearchContext } from '../../../contexts/SearchContext';

const StarRatingvis = ({ onClick }) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const { setRating } = useContext(SearchContext);

  const handleRatingClick = (rating) => {

    onClick();  // Відкриває модальне вікно
  };  

  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={30}
          color={star <= (hoveredStar || 0) ? '#ffc107' : '#e4e5e9'}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(null)}
          onClick={() => handleRatingClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRatingvis;

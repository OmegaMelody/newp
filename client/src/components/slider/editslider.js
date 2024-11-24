import React, { useState, useEffect, useCallback, useContext } from 'react'; 
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './styles.module.css';
import { SearchContext } from '../../contexts/SearchContext';

function valuetext(value) {
  return `${value}`;
}

export default function EditRangeSlider({ rating, onRatingChange,  }) {
  const [sliderValue, setSliderValue] = useState(rating);

  useEffect(() => {
    setSliderValue(rating);
  }, [rating]);

  const handleChange = (event, newValue) => {
    setSliderValue(newValue);
    onRatingChange(newValue);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Slider
        value={sliderValue}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={5}
        color="secondary"
      />
      <div>{sliderValue}</div>
    </Box>
  );
}

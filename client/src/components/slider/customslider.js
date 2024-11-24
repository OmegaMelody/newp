import React, { useState, useEffect, useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styled from '@emotion/styled';
import styles from './styles.module.css';
import {SearchContext} from '../../contexts/SearchContext'





function valuetext(value) {


  return `${value}°C`;
}










export default function RangeSlider() {
  
  const [gradesFilter, setGradesFilter] = useState(5 );



  useEffect(() => {
    console.log(gradesFilter);
  }, [gradesFilter]);

  const {
    rating, 
    setRating,
  } = useContext(SearchContext);

  const handleChange = useCallback((event, newValue) => {
    setRating(newValue);
    setGradesFilter(newValue);
  }, [setRating]);

  return (
    <div className={styles.root}>
      <Box sx={{ width: 250 }}>
      <Slider
          onChange={handleChange}
                valueLabelDisplay="auto"

  aria-label="Temperature"
  
  value={rating}
  min={0}
  max={5}
  getAriaValueText={valuetext}
  color="secondary"

/>
        <div ><span className={styles.red} >{rating}</span></div>
      </Box>
    </div>
  );
}

import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LockIcon from '@mui/icons-material/Lock';
import './UserNotAuthorized.css';

const UserNotAuthorized = ({onLoginClick} ) => {
  const { t, i18n } = useTranslation();

  return (
    <Container maxWidth="sm" className="unauthorized-container">
      <Box className="unauthorized-box">
        <LockIcon className="lock-icon" />
        <Typography variant="h4" gutterBottom>
       
        </Typography>
        <Typography variant="body1" gutterBottom>
        {t('Review.Authfor', { defaultValue: 'Ви не увійшли у свій акаунт. Щоб мати змогу залишити відгук - авторизуйтесь.' })} 
        </Typography>
        <div className='btn'>
        <div onClick={onLoginClick}
className='super-duper-button'
         
        >
          {t('UserIsNotAuth.Log in', { defaultValue: 'Авторизуватись' })}
        </div>
        </div>

       
      </Box>
    </Container>
  );
};

export default UserNotAuthorized;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchContext } from '../../contexts/SearchContext';
import Drawer from '../drawer/Drawer';
import './Header.css';
import profileImage from '../../images/images.svg';
import filterImage from '../../images/107799.png';
import arrowImage from '../../images/good-back-button.svg';
import instImage from '../../images/bullet-list.png';

function Header({ showInput, showBack, showFilter, showProfil, showTitle, showInst }) {
  const { setOpenDrawer, openDrawer, post } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleBackClick = () => navigate(-1);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <header className="header">
      <div className="header-container">
        {showBack && (
          <button onClick={handleBackClick} className="back-button" aria-label="Go Back">
            <img src={arrowImage} alt="Go Back" className="icon" />
          </button>
        )}
        {showFilter && (
          <button onClick={toggleDrawer} className="filter-button" aria-label="Toggle Filter Drawer">
            <img src={filterImage} alt="Filter" className="icon" />
          </button>
        )}
        {showProfil && (
          <Link to="/profile" className="profile-button" aria-label="Profile">
            <img src={profileImage} alt="Profile" className="icon" />
          </Link>
        )}
        {showTitle && post?.title && (
          <h3 className="title">{post.title}</h3>
        )}
      </div>
      <Drawer />
    </header>
  );
}

export default Header;

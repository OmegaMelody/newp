// BottomHeader.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BottomHeader.css';
import ListImg from '../../images/bullet-list (1).png';
import MapImg from '../../images/map-7.svg';


function BottomHeader() {
  const [showHeader, setShowHeader] = useState(true);
  let lastScrollY = window.pageYOffset;

  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;
    if (currentScrollY > lastScrollY) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bottom-header ${showHeader ? 'show' : 'hide'}`}>
      <div className="bottom-header-container">
      
        <Link to="/" className="nav-link">      
          <img src={MapImg} alt="Filter" className="ListImg" />
        </Link>
        <Link to="/List" className="nav-link">
        <img src={ListImg} alt="Filter" className="ListImg" />

        </Link>
      </div>
    </nav>
  );
}

export default BottomHeader;
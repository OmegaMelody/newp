import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './post-details.css';
import Header from '../Header/Header';
import { SearchContext } from '../../contexts/SearchContext';
import { AuthContext } from '../../contexts/AuthContext';
import Review from '../Rewiev/Rewiev';
import { useTranslation } from 'react-i18next';


// Компонент анімації завантаження
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

function PostDetails() {

  const { t, i18n } = useTranslation();

  const { items, post, setPost } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('description');

  // Очистка стану перед оновленням посту
  useEffect(() => {
    setPost(null); // Очищення стану для показу анімації завантаження
    const foundPost = items.find(item => item.id === id);
    setPost(foundPost);
  }, [id, items, setPost]);
// PostDetails.js
const handleLoginClick = () => {
  localStorage.setItem('redirectPath', location.pathname);
  navigate('/login', { replace: true }); // Використовуємо replace: true
};

  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    if (location.state && location.state.activeTab && location.state.fromLogin) {
      setActiveTab(location.state.activeTab);
    } else if (savedActiveTab && savedActiveTab !== 'reviews') {
      setActiveTab(savedActiveTab);
    } else {
      setActiveTab('description');
    }
  }, [location.state]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  // Показ анімації завантаження, якщо пост ще не завантажився
  if (!post) {
    return <LoadingSpinner />;
  }
  if (!post) {
    return <div>{t('error.noPost', { defaultValue: 'Пост не знайдено' })}</div>;
}

const renderSite = () => {
  if (!post.site) {
    return t('PostDetails.NoSite', { defaultValue: '—' });
  }

  const href = post.site.startsWith('http') ? post.site : `https://${post.site}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link"
    >
      {post.site}
    </a>
  );
};


  return (
    <div className='root'>
      <Header showInput={false} showBack={true} showFilter={false} showProfil={false} showTitle={true} />
      <div className="content-container">
        <div className="buttons">
          <button
            onClick={() => handleTabChange('description')}
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
          >
            {t('Postbtn.Description', { defaultValue: 'Опис' })}
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          >
           {t('Postbtn.Reviews', { defaultValue: 'Відгуки' })}  
          </button>
        </div>
        {activeTab === 'description' && (
          <div className="post-details">
            <div>
              <img src={post.picture} alt={post.title}
              onError={(e) => {
                e.target.onerror = null; // запобігає нескінченному циклу
                e.target.src = 'https://www.agrolet.com.ua/wp-content/uploads/2023/01/404_agrolet_ukraine-scaled.jpg'; // посилання на альтернативну картинку
                }}
              
              className='img'  style={{ width: '400px', height: '220px' }} />
            </div>
            <div className='title1'>
              <div><b>   {t('PostDetails.Name', { defaultValue: 'Назва' })}</b> {post.title}</div>
              <div><b>{t('PostDetails.Adress', { defaultValue: 'Адреса:' })}</b> {post.adresa}</div>
              <div> <b>{t('PostDetails.Site', { defaultValue: 'Сайт:' })}</b> {renderSite()}</div>

              <div><b>{t('PostDetails.Type', { defaultValue: 'Тип:' })}</b> {post.type}</div>
              <div><b>{t('PostDetails.Description', { defaultValue: 'Опис:' })}</b> <p>{post.description}</p></div>
              <div>{post.content}</div>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && <Review itemsid={id} isAuthenticated={!!user} />}
      </div>
    </div>
  );
}

export default PostDetails;

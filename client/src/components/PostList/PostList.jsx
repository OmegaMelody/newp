import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostList.css'; // Імпорт CSS-файлу
import Input from '../input/input';

import { useTranslation } from 'react-i18next';

function PostList({ title, picture, id, adresa, type }) {
  const navigate = useNavigate(); // Використання useNavigate
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    navigate(`/post/${id}`); // Використання navigate для переходу до сторінки з відповідним id
  };
    const truncateText = (text, length = 50) => text.length > length ? `${text.substring(0, length)}...` : text;

  return (
    <div className='PostList'>
      <main>
        <section>
        <hr />
          <ul className="way-list">
            <li className="post-item">
              <div className="post-content"onClick={handleClick}>
                <div className="image-container" >
                  <img src={picture} alt={title}    onError={(e) => {
                  e.target.onerror = null; // запобігає нескінченному циклу
                  e.target.src = 'https://www.agrolet.com.ua/wp-content/uploads/2023/01/404_agrolet_ukraine-scaled.jpg'; // посилання на альтернативну картинку
                  }}style={{ width: '150px', height: '90px' }} />
                </div>
                <div>
                <div className="title">{title}</div>
                  <div className="adresa"><b>{t('PostList.Adress')}</b> {adresa}</div>
                  <div className="type1">
                    <b>{t('PostList.Type')}</b> {t(`PostList.types.${type}`, { defaultValue: type })}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default PostList;

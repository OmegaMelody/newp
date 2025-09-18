import React, { useState } from 'react';
import styles from './Filters.module.css';
import { useTranslation } from 'react-i18next';

function Filters({ onFilter }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  const options = [
    { id: 'top3', label: t('filters.top3', { defaultValue: 'Актуальні' }) },
    { id: 'kids', label: t('filters.kids', { defaultValue: 'Для дітей' }) },
    { id: 'parks', label: t('filters.parks', { defaultValue: 'Парки' }) },
    { id: null, label: t('filters.all', { defaultValue: 'Всі' }) }
  ];

  const handleClick = (id) => {
    setActive(id);
    onFilter(id);
  };

  return (
    <div className={styles.container}>
      {options.map(opt => (
        <button
          key={opt.id ?? 'all'}
          className={`${styles.btn} ${active === opt.id ? styles.active : ''}`}
          onClick={() => handleClick(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default Filters;

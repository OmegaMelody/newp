import React, { useState, useContext, useEffect } from 'react';
import styles from './Categories.module.css';
import { SearchContext } from '../../contexts/SearchContext';
import { useTranslation } from 'react-i18next';

function Categories() {
  const { t } = useTranslation();

  const { checkedCategories, setCheckedCategories, categories } = useContext(SearchContext);

  const translatedCategories = categories.map(category => ({
    id: category.id,
    label: t(`categories.${category.id}`, { defaultValue: category.type })
  }));

  // handleClick — універсальна логіка
const handleClick = (clickedCategoryId) => {
  if (clickedCategoryId === 'all') {
    setCheckedCategories(allSelected ? [] : categories.map(c => c.id));
  } else {
    if (allSelected) {
      // було вибране "Всі" → очищаємо і залишаємо лише обрану
      setCheckedCategories([clickedCategoryId]);
    } else {
      setCheckedCategories(current =>
        current.includes(clickedCategoryId)
          ? current.filter(id => id !== clickedCategoryId) // вимикаємо
          : [...current, clickedCategoryId] // вмикаємо
      );
    }
  }
};



  // Чи вибрані всі
  const allSelected = checkedCategories.length === categories.length;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.category} ${allSelected ? styles.selected : ''}`}
        onClick={() => handleClick('all')}
      >
        {t('categories.all', { defaultValue: 'Всі' })}
      </div>

      {translatedCategories.map((elem) => (
        <div
          key={elem.id}
          className={`
            ${styles.category} 
            ${!allSelected && checkedCategories.includes(elem.id) ? styles.selected : ''}
          `}
          onClick={() => handleClick(elem.id)}
        >
          {elem.label}
        </div>
      ))}
    </div>
  );
}

export default Categories;

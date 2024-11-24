import React, { useState, useContext, useEffect } from 'react';
import styles from './Categories.module.css';
import { SearchContext } from '../../contexts/SearchContext';
import { useTranslation } from 'react-i18next';

function Categories() {
  const { t } = useTranslation();

  const [allSelected, setAllSelected] = useState(false);
  const { checkedCategories, setCheckedCategories, categories } = useContext(SearchContext);

  const translatedCategories = categories.map(category => ({
    id: category.id,
    label: t(`categories.${category.id}`, { defaultValue: category.type })
  }));

  const handleClick = (clickedCategoryId) => {
    if (clickedCategoryId === 'all') {
      if (allSelected) {
        setAllSelected(false);
        setCheckedCategories([]);
      } else {
        setAllSelected(true);
        setCheckedCategories(categories.map(category => category.id));
      }
    } else {
      setCheckedCategories(currentCheckedCategories =>
        currentCheckedCategories.includes(clickedCategoryId)
          ? currentCheckedCategories.filter(id => id !== clickedCategoryId)
          : [...currentCheckedCategories, clickedCategoryId]
      );
      setAllSelected(false);
    }
  };

  useEffect(() => {
    if (checkedCategories.length === categories.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [checkedCategories, categories.length]);

  return (
    <div>
      <div
        className={`${styles.all} ${allSelected ? styles.selected : ''}`}
        onClick={() => handleClick('all')}
      >
        {t('categories.all', { defaultValue: 'Всі' })}
      </div>
      {translatedCategories.map((elem) => (
        <div
          key={elem.id}
          className={`${styles.category} ${checkedCategories.includes(elem.id) ? styles.selected : ''}`}
          onClick={() => handleClick(elem.id)}
        >
          {elem.label}
        </div>
      ))}
    </div>
  );
}

export default Categories;

import React, { useEffect, useContext, useCallback, useState } from 'react';
import PostList from '../PostList/PostList';
import Header from '../Header/Header';
import { SearchContext } from '../../contexts/SearchContext';
import './List.css';
import Input from '../input/input';
import { useTranslation } from 'react-i18next';

function List() {
    const { t, i18n } = useTranslation();

    const {
        categoryId,
        setCategoryId,
        checkedCategories,
        setCheckedCategories,
        items,
        setItems,
        categories,
        searchValue,
        setSearchValue,
        showBack, showBack1,
        cameFromList
    } = useContext(SearchContext);

    const [loading, setLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [error, setError] = useState(null); // Додано обробку помилок

    const noData = ':(';

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    const startURL = process.env.REACT_APP_API_URL;

    const getAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null); // Очистка попередніх помилок
            const response = await fetch(`${startURL}/api/places/getAllData`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setItems(jsonData);
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [setItems]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
            if (currentScrollTop > 400) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className='List'>
            <Header showInput={true} showFilter={true} cameFromList={cameFromList} />
            <div className='Inp'>
                <Input />
            </div>

            {loading ? (
                <div>{t('loading', { defaultValue: 'Завантаження...' })}</div>
            ) : error ? ( // Додав вивід помилок
                <div className="error">{t('error', { defaultValue: 'Помилка завантаження: ' })}{error}</div>
            ) : (
                Array.isArray(filteredItems) && filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <PostList key={item.id} title={item.title} picture={item.picture} id={item.id} adresa={item.adresa} type={item.type} items1={filteredItems} />
                    ))
                ) : (
                    <div className='noData'>
                        {t('Fsearch.FFsearch', { defaultValue: 'За запитом "' })}
                        <span className="noDatared">{searchValue}</span>
                        {t('Fsearch.SFsearch', { defaultValue: '" нічого не знайдено :D' })}
                    </div>
                )
            )}

            <button id="scrollButton" className={showScrollButton ? 'show' : 'hide'} onClick={scrollToTop}>
                ↑
            </button>
        </div>
    );
}

export default List;

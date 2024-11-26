  import { useEffect, createContext, useState } from "react";

  export const SearchContext = createContext();

  export const SearchProvider = ({ children }) => {
    const categoriesData = [
      { id: 'rest', type: 'Відпочити' },
      { id: 'historical', type: 'Історичні' },
      { id: 'eat', type: 'Поїсти' },
      { id: 'museum', type: 'Музей' },
      { id: 'forChildren', type: 'Для дітей' },
      { id: 'romantic', type: 'Романтичні' },
      { id: 'park', type: 'Парк' }
  ];      const [categories, setCategories] = useState(categoriesData);
      const [cameFromList, setCameFromList] = useState(true);
      const [searchValue, setSearchValue] = useState('');
      const [items, setItems] = useState([]);
      const [openDrawer, setOpenDrawer] = useState(false); // Початкове значення для openDrawer
      const [showFilter, setShowFilter] = useState(true);
      const [categoryId, setCategoryId] = useState(0);
      const [sortType, setSortType] = useState(0);
      const [checkedCategories, setCheckedCategories] = useState(categoriesData.map(category => category.id));
      const [GetAll, setGetAll] = useState();
      const [rating, setRating] = useState(0); // Corrected to use useState for rating
      const [showModal, setShowModal] = useState(false);
      const [activeTab, setActiveTab] = useState('description');
      const [post, setPost] = useState(null);
      const [customRating, setCustomRating]= useState(0)
      const [currentRating, setCurrentRating] = useState(0);

      const startURL = process.env.REACT_APP_API_URL;


      useEffect(() => {
          const fetchData = async () => {
            const response = await fetch(`${startURL}/api/getFilteredCategory2/getFilteredCategory2`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ checkedCategories, searchValue })
            });
            const jsonData = await response.json();
            setItems(jsonData);
          };
          fetchData();
        }, [checkedCategories, searchValue]);


      return(
          <SearchContext.Provider value={{
              searchValue,
              setSearchValue,
              items,
              setItems,
              openDrawer,
              setOpenDrawer,
              showFilter,
              setShowFilter,
              categoryId,
              setCategoryId,
              sortType,
              setSortType,
              checkedCategories,
              setCheckedCategories,
              categories,
              setCategories,
              categoriesData,
              GetAll,
              setGetAll,
              cameFromList,
              rating,
              setRating,
              showModal, 
              setShowModal,
              activeTab, 
              setActiveTab,
              post, 
              setPost,
              customRating, 
              setCustomRating,
              currentRating, 
              setCurrentRating
            }}>
              {children}
            </SearchContext.Provider>
      )

  }






  // <AuthProvider >
  //     <LoginPage />
  // </AuthProvider>
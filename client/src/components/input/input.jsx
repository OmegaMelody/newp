import React, { useRef } from 'react';
import { SearchContext } from '../../contexts/SearchContext';
import debounce from 'lodash.debounce';
import './input.css'; // Import the updated CSS file
import { FaSearch } from 'react-icons/fa'; // Using react-icons for the search icon

function Input() {
  const { setSearchValue } = React.useContext(SearchContext);
  const [value, setValue] = React.useState('');
  const inputRef = useRef();

  const updateSearchValue = React.useCallback(
    debounce((str) => {
      setSearchValue(str);
    }, 250),
    []
  );

  const onChangeInput = (event) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  return (
    <div className="input-container">
      <div className="search-icon-container">
        <FaSearch className="search-icon" />
      </div>
      <input
        ref={inputRef}
        className="input-field"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={value}
        onChange={onChangeInput}
      />
    </div>
  );
}

export default Input;

import React from 'react';
import Header from '../Header/Header';
import Map from '../Map/index';
import { SearchContext } from '../../contexts/SearchContext';

function Fpage() {
  const { cameFromList, setCameFromList } = React.useContext(SearchContext); 

  return (
    <div>
      {/* Передача значення cameFromList у вигляді пропсу до Header */}
      <Header  showFilter={true} showProfil={true}/>
      {/* <Header showInput={true} showFilter={true} showBack={true} /> */}
 {/* Тут змінено значення cameFromList на true */} 
      <Map />
    </div>
  );
}

export default Fpage;

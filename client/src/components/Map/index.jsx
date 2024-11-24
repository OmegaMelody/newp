
import React, { useCallback, useContext, useMemo  } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api';
import styles from './styles.module.css';
import { SearchContext } from '../../contexts/SearchContext';
import blueCircle from '../../images/Simple_red_circle.svg.png'
import { mapConfig } from './config';
const containerStyle = {
  width: '100%',
  height: '100vh', // Забезпечує повне заповнення екрану
};
const center = {
  lat: 48.7773649,
  lng: 9.1806206
};

const options = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' },
      ],
    },
  ],
};

const clusterStyles = [
  {
    textColor: 'white',
    url: blueCircle,
    height: 50,
    width: 50,
    textSize: 14,
  },
  {
    textColor: 'white',
    url: blueCircle,
    height: 60,
    width: 60,
    textSize: 16,
  },
  {
    textColor: 'white',
    url: blueCircle,
    height: 70,
    width: 70,
    textSize: 18,
  },
];

// const clusterStyles = [
//   {
//     textColor: 'white',
//     url: blueCircle, // Шлях до вашого зображення для малих кластерів
//     height: 50,
//     width: 50,
//     textSize: 14,
//   },
//   {
//     textColor: 'white',
//     url: blueCircle, // Шлях до вашого зображення для середніх кластерів
//     height: 60,
//     width: 60,
//     textSize: 16,
//   },
//   {
//     textColor: 'white',
//     url: blueCircle, // Шлях до вашого зображення для великих кластерів
//     height: 70,
//     width: 70,
//     textSize: 18,
//   },
// ];


function Map() {
    const { items, checkedCategories } = useContext(SearchContext);
    const navigate = useNavigate();
    const { googleMapsApiKey, defaultCenter, defaultZoom } = mapConfig;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        language: "uk",
        region: "ua"
    });
    const filteredItems = useMemo(
      () => items.filter(item => checkedCategories.includes(item.type)),
      [items, checkedCategories]
    );
    
    const markerOnclick = useCallback((elem) => {
        elem.id && navigate(`/post/${elem.id}`);
    }, [navigate]);

    if (!isLoaded) {
      return <div>Loading map...</div>;
    }



    if (!isLoaded) {
      return <div>Failed to load the map. Please check your internet connection or API key.</div>;
    }
    

    return isLoaded ? (
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={defaultZoom}
              options={options}
            >
                <MarkerClusterer options={{ styles: clusterStyles,
                      gridSize: 20, // Наприклад, зменште значення для покращення відображення

                 }}>
                    {(clusterer) =>
                        filteredItems.map(item => {
                            const { id, latitude, longitude, markerpng } = item;
                            return (
                                <Marker
                                    key={id}
                                    position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
                                    onClick={() => markerOnclick(item)}
                                    icon={{
                                        url: markerpng,
                                        scaledSize: new window.google.maps.Size(70, 60),
                                    }}
                                    // clusterer={clusterer}
                                />
                            );
                        })
                    }
                </MarkerClusterer> 
            </GoogleMap>
        </div>
    ) : <></>;
}

export default Map;

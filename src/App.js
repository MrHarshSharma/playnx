import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import Card from './components/Card';
import { useEffect } from 'react';
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useRef, useState } from "react";
import { myPlaces } from './constants/places';
import { render } from '@testing-library/react';

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

function App() {
  const handleBook = () => {
    alert("Booking confirmed!");
  };
  const [height, setHeight] = useState(window.innerHeight);

  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const loadObject = {
    map: true,
    // layer: 'raster', // Optional Default Vector
    // version: '3.0', // // Optional, other version 3.5 also available with CSP headers
    // libraries: ['polydraw'], //Optional for Polydraw and airspaceLayers
    // plugins:['direction'] // Optional for All the plugins
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          renderMap({ latitude, longitude })
        
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };
  const renderMap = async ({ latitude, longitude }) => {

    await mapplsClassObject.initialize("ca1c04dd9fe5f56403f6119b97707e66", loadObject, () => {
      const newMap = mapplsClassObject.Map({
        id: "map",
        properties: {
          center: [latitude, longitude],
          zoom: 10,
        },
      });

      mapplsClassObject.Marker({
        map: newMap,
        position: { "lat": latitude, "lng": longitude },
        draggable: false,
        "description": "noida",
        "icon":'images/mappointer.png',
        // "icon-size": .75,
      });

      myPlaces.suggestedLocations.map((place, key) => {
        mapplsClassObject.Marker({
          map: newMap,
          position: { "lat": place.latitude, "lng": place.longitude },
          draggable: false,
        });
      })




      newMap.on("load", () => {
        setIsMapLoaded(true);
      });


      mapRef.current = newMap;
    });
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    getLocation()

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };

   

  }, []);
  return (
    <Layout>
      <div className='z-0'>
        <div
          id="map"
          style={{ width: "100%", height: `${height-200}px`, display: "inline-block" }}
          className='z-0'
        >
          {isMapLoaded}
        </div>
      </div>
      <div className='-mt-10 z-10 relative ' >
        <div className="">
       
          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto flex space-x-4 pb-4" >
            {myPlaces.suggestedLocations.map((place, key) => (
              <Card
                key={key}
                name={place.placeName}
                location={place.placeAddress}
                time="10:00 AM - 11:00 AM"
                onBook={handleBook}
              />
            ))}



            {/* Add more cards as needed */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;

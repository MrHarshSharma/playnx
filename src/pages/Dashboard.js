import React from "react";
import { auth, db } from "../firebaseConfig";
import Layout from '../components/Layout';
import Card from '../components/Card';
import { createRef, useEffect } from 'react';
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useRef, useState } from "react";
import { myPlaces } from '../constants/places';
import { render } from '@testing-library/react';
import { useAtom } from 'jotai';
import { countAtom, logedUser } from "../store";
import { useAtomDevtools } from "jotai-devtools";
import Searchbar from "../components/Searchbar";
import { toast } from "react-toastify";
import BookingForm from "../components/BookingForm";
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";


const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const Dashboard = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useAtom(countAtom);
  const [logUser, setLogUser] = useAtom(logedUser)
  useAtomDevtools(countAtom, "Count Atom");
  useAtomDevtools(logedUser, "logedUser");
  const [height, setHeight] = useState(window.innerHeight);
  const mapRef = useRef(null);
  const [selectedEloc, setSelectedEloc] = useState(null);
  const cardRefs = useRef({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    players: "",
    date: "",
    time: "",
    sport: "",
    location:''
  });

  const handleBook = (place) => {
    const { latitude, longitude } = place
    mapRef.current.setCenter({ lat: latitude, lng: longitude });
    mapRef.current.setZoom(16);
    setIsOpen(true)
    setFormData((prev) => ({ ...prev, location: place }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log(formData)
    setIsOpen(false); // Close modal on submit

    try {
      // Get a reference to the user's document in the "bookings" collection
      const userDocRef = doc(db, "bookings", logUser.uid);
    
      // Fetch the current document data
      const docSnap = await getDoc(userDocRef);
    
      // Add the new booking to the existing array, along with a timestamp
      const newBooking = {
        ...formData,
        timestamp: Date.now(),  // Add server-side timestamp
      };
    
      if (docSnap.exists()) {
        // If the document exists, update it by adding the new booking
        await updateDoc(userDocRef, {
          bookings: arrayUnion(newBooking),  // Adds new booking while preserving the existing ones
        });
        console.log("Booking successfully added to Firestore with timestamp!");
      } else {
        // If the document does not exist, create a new document with the first booking
        await setDoc(userDocRef, {
          bookings: [newBooking],  // Create a new array with the first booking
        });
        console.log("New booking document created in Firestore!");
      }
    } catch (error) {
      console.error("Error saving booking to Firestore:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

   
  };

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
          console.log(position)
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


  useEffect(() => {
    // Populate the refs after component mounts
    const refs = {};
    myPlaces.suggestedLocations.forEach((place) => {
      refs[place.eLoc] = createRef();
    });
    cardRefs.current = refs;
  }, [myPlaces]);

  const scrollCard = (place) => {
    const { eLoc, placeName } = place
    console.log(placeName)
    setSelectedEloc(eLoc);

    // Scroll the corresponding card into view

    document.getElementById(eLoc).scrollIntoView({
      behavior: 'smooth',
      block: 'center',  // Scroll the element to the center of the viewport
      inline: 'center'
    });

  }
  const renderMap = async ({ latitude, longitude }) => {

    await mapplsClassObject.initialize("ca1c04dd9fe5f56403f6119b97707e66", loadObject, () => {
      const newMap = mapplsClassObject.Map({
        id: "map",
        properties: {
          center: [latitude, longitude],
          zoom: 10,
          fullscreenControl: false
        },
      });


      mapplsClassObject.Marker({
        map: newMap,
        position: { "lat": latitude, "lng": longitude },
        draggable: false,
        "description": "noida",
        "icon": 'images/mappointer.png',
        // "icon-size": .75,
        width: 50
      });

      myPlaces.suggestedLocations.map((place, key) => {

        let markerr = mapplsClassObject.Marker({
          map: newMap,
          position: { "lat": place.latitude, "lng": place.longitude },
          draggable: false,
        });

        markerr.addListener('click', () => scrollCard(place));
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
    // <div>
    //   <h1>Dashboard</h1>
    //   <button onClick={handleLogout}>Logout</button>
    // </div>
    <Layout>
    {isOpen && (
        <BookingForm handleSubmit={handleSubmit} setIsOpen={setIsOpen} formData={formData} setFormData={setFormData} handleChange={handleChange} />
    )}
      <div className='z-0'>
        <div
          id="map"
          style={{ width: "100%", height: `${height}px`, display: "inline-block" }}
          className='z-0'
        >
          {isMapLoaded}
        </div>
      </div>
      <div className='-mt-100 z-10 w-full' style={{ position: 'absolute', bottom: 0 }} >
        <div className="">

          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto flex space-x-4 pb-2 px-2" >
            {myPlaces.suggestedLocations.map((place, key) => (
              <Card
                key={place.placeName}
                id={place.eLoc}
                name={place.placeName}
                location={place.placeAddress}
                time="10:00 AM - 11:00 AM"
                onBook={() => handleBook(place)}
              />
            ))}



            {/* Add more cards as needed */}
          </div>
        </div>
      </div>

      <Searchbar handleLogout={handleLogout} />
    </Layout>
  );
};

export default Dashboard;

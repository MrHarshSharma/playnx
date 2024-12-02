import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { logedUser } from "../store";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Searchbar = ({handleLogout}) => {
    const [logUser, setLogUser] = useAtom(logedUser)
    const [searchedPlace, serSearchedPlace] = useState('')
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setData([])
    const user = logUser; // Get the logged-in user

    if (user) {
      const friendsList = ["StopJSjUJXNT01KhDojloWL5wU82",'cLiE8sF13lQVdD6fFUiknZttFE62']; // Replace with actual user document IDs
      const unsubscribeFunctions = []; // Store unsubscribe functions for cleanup

      // Fetch data for multiple document IDs
      friendsList.forEach((userUid) => {
        const userDocRef = doc(db, "bookings", userUid); // Reference to the user's document

        // Set up onSnapshot listener for each document
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setData((prevData) => [
              ...prevData,
            ...docSnapshot.data().bookings,
            ]);
          } else {
            setData([]); // Document doesn't exist
          }
          setLoading(false); // Set loading to false after data is fetched
        });
        const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
        
        setFilteredData(sortedData);
        // Add unsubscribe function to the array
        unsubscribeFunctions.push(unsubscribe);
      });

      // Cleanup: unsubscribe from all listeners when component unmounts or dependencies change
      return () => {
        unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
      };
    } else {
      setLoading(false);
      console.log("User is not logged in.");
    }
  }, [isPopoverOpen]);


  return (
    <div className="flex items-center justify-center fixed top-2 left-0 right-0">
      <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm w-80">
        {/* Email Icon */}
        <div className="p-2">
            <img src={logUser.photoURL}
            className="w-10 h-10 rounded-full object-cover" onClick={() => setIsPopoverOpen((prev) => !prev)} />
            
        </div>
        {isPopoverOpen && (
          <div className="absolute top-12 left-3 mt-2 w-2/3 bg-white shadow-lg border rounded max-h-64 overflow-y-auto">
            <div className="p-4">
            <span className="right-5 absolute" onClick={()=>handleLogout()}>Logout</span>
              <h3 className="text-lg font-semibold mb-2">Invitations</h3>
              {data.length > 0 ? (
                <ul className="space-y-2">
                  {filteredData.map((item) => (
                    // <div>
                    // {c.bookings.map((item)=>(
                      <li
                      key={item.id}
                      className="p-2 border rounded hover:bg-gray-100"
                      >
                      {item.players || "Unnamed"} players for {item.sport || "Unnamed"} on {item.date || "No Value"} at {item.time || "No Value"}
                      </li>
                      
                      // ))}
                      // </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 px-4 py-2 focus:outline-none text-gray-700 rounded-full"
          value={searchedPlace}
          onChange={(e)=>serSearchedPlace(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Searchbar;

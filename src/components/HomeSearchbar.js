import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { logedUser, userFriendList, userNewRequests } from "../store";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MdLogout } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { appRoutes } from "../constants/appRoutes";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../constants/genericFunctions";
import { AiOutlineSchedule } from "react-icons/ai";

const HomeSearchbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const [logUser, setLogUser] = useAtom(logedUser)
  const [myFriendList, setMyFriendList] = useAtom(userFriendList)
  const [searchedPlace, serSearchedPlace] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFrndReq, setnewFrndReq] = useAtom(userNewRequests)



  useEffect(() => {
    async function getME() {
      let friends = await fetchMe(logUser.uid)
      setMyFriendList(friends)
      console.log(friends)
      console.log("loged user", logUser.uid)
    }
    if (logUser) {
      getME()
    }
  }, [logUser])
  useEffect(() => {

    setData([])
    const user = logUser; // Get the logged-in user

    if (user) {
      // console.log("userrrrrrr", user)
      const friendsList = myFriendList; // Replace with actual user document IDs
      const unsubscribeFunctions = []; // Store unsubscribe functions for cleanup

      // Fetch data for multiple document IDs
      friendsList && friendsList.length > 0 && friendsList.forEach((userUid) => {
        const userDocRef = doc(db, "bookings", userUid.id); // Reference to the user's document

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
        <div className="p-2 relative">
          {newFrndReq.length > 0 && (

            <div className="ml-2 w-3 h-3 absolute bg-green-500 rounded-full right-0 top-1"></div>
          )}
          <img src={logUser?.photoURL}
            className="w-10 h-10 rounded-full object-cover" onClick={() => setIsPopoverOpen((prev) => !prev)} />

        </div>
        {isPopoverOpen && (
          <div className="absolute top-12 left-3 mt-2 w-2/3 bg-white shadow-lg border rounded ">
            <div className="p-4">
              <span className="right-5 absolute flex gap-3 top-5" >
                <span className="relative">
                  {newFrndReq.length > 0 && (
                    <div className="ml-2 w-2 h-2 absolute bg-green-500 rounded-full -right-1 -top-1"></div>
                  )}
                  <AiOutlineSchedule fontSize={20} onClick={() => navigate(appRoutes.MYBOOKINGS)} /> 
                </span>
                <span className="relative">
                  {newFrndReq.length > 0 && (
                    <div className="ml-2 w-2 h-2 absolute bg-green-500 rounded-full -right-1 -top-1"></div>
                  )}
                  <IoPersonAddOutline fontSize={20} onClick={() => navigate(appRoutes.FRIENDS)} />
                </span>
                <MdLogout fontSize={20} onClick={() => handleLogout()} />
              </span>
              <h3 className="text-lg font-semibold mb-2">Invitations</h3>
              {data.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredData.map((item) => (
                    // <div>
                    // {c.bookings.map((item)=>(
                    <li
                      key={item.id}
                      className="p-2 border rounded hover:bg-gray-100"
                    >
                      <div>
                        {item.location.placeName}
                      </div>

                      <div className="mt-2">
                        Need {item.players || "Unnamed"} players for {item.sport || "Unnamed"} on {item.date || "No Value"} at {item.time || "No Value"}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <span className="drop-shadow-lg">Accept</span>
                        <span>Cancle</span>
                      </div>
                    </li>

                    // ))}
                    // </div>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No Notifications</p>
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
          onChange={(e) => serSearchedPlace(e.target.value)}
        />
      </div>
    </div>
  );
};

export default HomeSearchbar;

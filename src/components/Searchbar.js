import { useAtom } from "jotai";
import React, { useState } from "react";
import { logedUser } from "../store";

const Searchbar = ({handleLogout}) => {
    const [logUser, setLogUser] = useAtom(logedUser)
    const [searchedPlace, serSearchedPlace] = useState('')
  return (
    <div className="flex items-center justify-center fixed top-2 left-0 right-0">
      <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm w-80">
        {/* Email Icon */}
        <div className="p-2">
            <img src={logUser.photoURL}
            className="w-10 h-10 rounded-full object-cover"  onClick={()=>handleLogout()}/>
        </div>

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

import React from 'react';

const Card = ({ name, location, time, onBook }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 w-2/3  flex flex-col space-y-4" style={{height:'200px'}}>
    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
    <p className="text-gray-600 truncate overflow-hidden whitespace-nowrap">{location}</p>
    <p className="text-gray-500">{time}</p>
    <button
      onClick={onBook}
      className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Book Now
    </button>
  </div>
  );
};

export default Card;

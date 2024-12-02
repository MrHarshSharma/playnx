import React, { useState } from "react";

const Notification = ({ message, type, onClose }) => {
  const notificationColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center max-w-xs w-full px-4 py-3 rounded-md text-white shadow-lg ${notificationColors[type]}`}
    >
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-white font-bold hover:text-gray-200 focus:outline-none"
      >
        ✖
      </button>
    </div>
  );
};

export default Notification;
import { useAtom } from 'jotai';
import React, { useEffect } from 'react'
import { logedUser } from '../store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function MyBookings() {
    const [logUser, setLogUser] = useAtom(logedUser)
    useEffect(()=>{
        // console.log(logUser)
        if(logUser){

            fetchBookingsForUser(logUser.uid)
        }
    },[logUser])

    const fetchBookingsForUser = async (userId) => {
        try {
            // Reference the document with the given ID
            const docRef = doc(db, "bookings", userId);
    
            // Fetch the document
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                console.log("Bookings data:", docSnap.data());
                console.log(docSnap.data()) // Return the bookings data
            } else {
                console.log("No such document exists!");
                return null; // Handle cases where no document is found
            }
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
            throw error; // Optionally rethrow the error to handle it upstream
        }
    };

  return (
    <div>MyBookings</div>
  )
}

export default MyBookings
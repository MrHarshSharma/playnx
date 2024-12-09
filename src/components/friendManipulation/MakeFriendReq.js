import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../firebaseConfig';
import { useAtom } from 'jotai';
import { logedUser } from '../../store';
import Spinner from '../Spinner';
import SmallSpinner from '../SmallSpinner';

function MakeFriendReq({people}) {

    const [logUser, setLogUser] = useAtom(logedUser)
    const [loading, setLoading] = useState(false)

    async function sendFriendRequest(userId, friendData) {
        setLoading(true)
        try {
            // Reference the document for the user with the given userId
            const userDocRef = doc(db, "users", userId);

            // Update the `friendReq` array with the new friend data
            await updateDoc(userDocRef, {
                friendReq: arrayUnion(friendData), // Add the new friend object to the array
            });

            console.log("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending friend request:", error.message);
        }finally{
           
            setLoading(false)
        }
    }

    const makeFriendRequest = (me) => {
        const myData = {
            id: logUser.uid,
            photoURL: logUser.photoURL,
            displayName: logUser.displayName,
        };

        sendFriendRequest(me.uid, myData);
    }
  return (
    <span className="drop-shadow-lg" onClick={() => makeFriendRequest(people)}>{loading?<SmallSpinner />:"Add"}</span>
  )
}

export default MakeFriendReq
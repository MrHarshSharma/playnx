import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../firebaseConfig';
import { logedUser } from '../../store';
import { useAtom } from 'jotai';
import SmallSpinner from '../SmallSpinner';

function AcceptFriendReq({refreshData, people}) {
    const [loading, setLoading] = useState(false)
  const [logUser, setLogUser] = useAtom(logedUser)

    async function acceptFriendRequest(person) {
        setLoading(true)
        try {
            // Reference to sender and receiver documents
            const userDocRefSender = doc(db, "users", person.id);
            const userDocRefReceiver = doc(db, "users", logUser.uid);

            // Fetch the receiver's document to get the current friendReq array
            const receiverDocSnap = await getDoc(userDocRefReceiver);
            if (receiverDocSnap.exists()) {
                const receiverData = receiverDocSnap.data();
                const currentFriendReq = receiverData.friendReq || []; // Get current friendReq array or empty

                // Filter out the accepted friend request
                const updatedFriendReq = currentFriendReq.filter((req) => req.id !== person.id);

                // Update the friendReq array in receiver's document
                await updateDoc(userDocRefReceiver, {
                    friendReq: updatedFriendReq, // Update with filtered array
                    friendList: arrayUnion(person), // Add the accepted friend to friendList
                });

                // Update the friendList array in sender's document
                await updateDoc(userDocRefSender, {
                    friendList: arrayUnion({
                        id: logUser.uid,
                        photoURL: logUser.photoURL,
                        displayName: logUser.displayName,
                    }), // Add the receiver's info to sender's friendList
                });

                console.log("Friend request accepted successfully!");
            } else {
                console.error("Receiver document does not exist!");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error.message);
        }finally{
            refreshData()
            setLoading(false)
        }
    }

  return (
    <span className="drop-shadow-lg" onClick={() => acceptFriendRequest(people)}>{loading?<SmallSpinner />:"Accept"}</span>
  )
}

export default AcceptFriendReq
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../firebaseConfig';
import SmallSpinner from '../SmallSpinner';
import { useAtom } from 'jotai';
import { logedUser } from '../../store';

function RemoveFriendReq({refreshData, people}) {
    const [logUser, setLogUser] = useAtom(logedUser)
    const [loading, setLoading] = useState(false)
   
    async function removeFriend(person) {
        setLoading(true)
        try {
            // Reference to sender and receiver documents
            const userDocRefSender = doc(db, "users", person.id); // Friend to be removed
            const userDocRefReceiver = doc(db, "users", logUser.uid); // Current logged-in user
    
            // Fetch the sender and receiver documents
            const senderDocSnap = await getDoc(userDocRefSender);
            const receiverDocSnap = await getDoc(userDocRefReceiver);
    
            if (senderDocSnap.exists() && receiverDocSnap.exists()) {
                const senderData = senderDocSnap.data();
                const receiverData = receiverDocSnap.data();
    
                // Filter out the friend from both users' friendList arrays
                const updatedReceiverFriendList = (receiverData.friendList || []).filter(
                    (friend) => friend.id !== person.id
                );
                const updatedSenderFriendList = (senderData.friendList || []).filter(
                    (friend) => friend.id !== logUser.uid
                );
    
                // Update the friendList arrays in both documents
                await updateDoc(userDocRefReceiver, {
                    friendList: updatedReceiverFriendList,
                });
    
                await updateDoc(userDocRefSender, {
                    friendList: updatedSenderFriendList,
                });
    
                console.log("Friend removed successfully!");
            } else {
                console.error("One or both user documents do not exist!");
            }
        } catch (error) {
            console.error("Error removing friend:", error.message);
        } finally {
            refreshData(); // Optional: Refresh the data if needed
            setLoading(false)
        }
    }

  return (
    <span className="drop-shadow-lg" onClick={() => removeFriend(people)}>{loading?<SmallSpinner />:"Remove"}</span>
  )
}

export default RemoveFriendReq
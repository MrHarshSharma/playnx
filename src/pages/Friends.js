import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAtom } from 'jotai';
import { logedUser, userFriendList, userFriendRequests } from '../store';
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { fetchMe } from '../constants/genericFunctions';
import Notifications from '../components/Notification';

function Friends() {
    const [logUser, setLogUser] = useAtom(logedUser)
    const [myFriendList, setMyFriendList] = useState([])
    const [mayknowPeople, setMayKnowPeople] = useState([])
    const [friendReqs, setFriendReqs] = useAtom(userFriendRequests)
    const [activeTab, setActiveTab] = useState("tab1");
    const [updatedMayknowPeople, setUpdatedMayknowPeople] = useState([])
    const [sudoState, setSudoState] = useState(0)
    useEffect(()=>{
        filterKnowPeople()

    },[mayknowPeople, myFriendList])

    const refreshData = () =>{
        setSudoState(prev=>prev+1)
    }

    const filterKnowPeople = () =>{
        if(myFriendList?.length>0){

            const filteredMayknowPeople = mayknowPeople.filter(
                (person) => !myFriendList.some((friend) => friend.id === person.id)
            );
            setUpdatedMayknowPeople(filteredMayknowPeople)
        }else if(!myFriendList){
            setUpdatedMayknowPeople(mayknowPeople)

        }
    }
   
    async function fetchUsersExcludingLoggedIn(loggedInUserId) {
        try {
            // Create a reference to the 'users' collection
            const usersCollection = collection(db, "users");

            // Create a query to fetch documents where the document ID is not equal to loggedInUserId
            const usersQuery = query(usersCollection, where("__name__", "!=", loggedInUserId));

            // Execute the query and get the documents
            const querySnapshot = await getDocs(usersQuery);

            // Map the documents to an array of user data
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id, // Get document ID
                ...doc.data(), // Spread the document data
            }));
            setMayKnowPeople(users)
            console.log("Fetched may know users:", users);
            return users;
        } catch (error) {
            console.error("Error fetching may know users:", error.message);
            return [];
        }
    }

    async function sendFriendRequest(userId, friendData) {
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
            refreshData()
        }
    }

    async function acceptFriendRequest(person) {
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
        }
    }

    useEffect(() => {
        async function fetcchh() {
            const friends = await fetchMe(logUser.uid)
            setMyFriendList(friends)
            console.log(friends)
            
        }

        if(logUser){
            fetcchh()
        }
        fetchUsersExcludingLoggedIn(logUser?.uid);
        
    }, [logUser, sudoState])



    const makeFriendRequest = (me) => {
        const myData = {
            id: logUser.uid,
            photoURL: logUser.photoURL,
            displayName: logUser.displayName,
        };

        sendFriendRequest(me.uid, myData);
    }

    const renderPeople = (action, people) => {
        return (
            <li
                key={people.id}
                className="p-2 border rounded hover:bg-gray-100 flex items-center "
            >
                <div className='flex items-center gap-2'>
                    <img src={people.photoURL}
                        className="w-10 h-10 rounded-full object-cover" />
                    {people.displayName}
                </div>


                <div className="flex gap-2 ml-auto">
                    {action == 'toadd' && (
                        <span className="drop-shadow-lg" onClick={() => makeFriendRequest(people)}>Add</span>

                    )} 
                    
                    {action == 'toaccept' && (
                        <span className="drop-shadow-lg" onClick={() => acceptFriendRequest(people)}>Accept</span>

                    )}
                </div>
            </li>

        )
    }
    return (
        <Layout>
        <Notifications />
            <div className='p-4'>
                <div className="flex items-center justify-center fixed top-7 left-0 right-0">
                    <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm w-80">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 px-4 py-2 focus:outline-none text-gray-700 rounded-full"
                        // value={searchedPlace}
                        // onChange={(e) => serSearchedPlace(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto mt-20">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-300">
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "tab1"
                                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                            onClick={() => setActiveTab("tab1")}
                        >
                            Friends
                        </button>
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "tab2"
                                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                            onClick={() => setActiveTab("tab2")}
                        >
                                Requests
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {activeTab === "tab1" && (
                            <div>
                            {myFriendList?.length > 0 && (
                                <div className='mt-5'>
                                    <span className=''>Friend requests</span>
                                    <ul className="space-y-2 mt-2">
                                        {myFriendList.map((tobefrnd) => (
                                            
                                            renderPeople('toremove', tobefrnd)
                                           
                                        ))}
                                    </ul>
                                </div>
                            )}
                            </div>
                        )}
                        {activeTab === "tab2" && (
                            <div>
                            {friendReqs.length > 0 && (
                                <div className='mt-5'>
                                    <span className=''>Friend requests</span>
                                    <ul className="space-y-2 mt-2">
                                        {friendReqs.map((tobefrnd) => (
                                            renderPeople('toaccept', tobefrnd)
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {updatedMayknowPeople.length > 0 && <div className={'mt-5'}>
                                <span className=''>People you may know</span>
                                <ul className="space-y-2 mt-2">
                                    {updatedMayknowPeople.map((people) => (
            
                                        renderPeople('toadd', people)
            
                                    ))}
                                </ul>
                            </div>}
                            </div>
                        )}
                    </div>
                </div>

             

            </div>
        </Layout>
    )
}

export default Friends
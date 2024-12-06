import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function fetchMe(myId) {
    let data=[]
    try {
        // Create a reference to the 'users' collection
        const usersCollection = await collection(db, "users");
  
        // Create a query to fetch documents where the document ID is not equal to loggedInUserId
        const usersQuery = await query(usersCollection, where("__name__", "==", myId));
  
        // Execute the query and get the documents
        const querySnapshot = await getDocs(usersQuery);
  
        // Map the documents to an array of user data
        const users = await querySnapshot.docs.map(doc => (doc.data()));
         
        data = users?.[0]?.friendList;

        return data
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return [];
    } finally {
        return data
    }

  }

  export async function fetchMyData(myId) {
    let data=[]
    try {
        // Create a reference to the 'users' collection
        const usersCollection = await collection(db, "users");
  
        // Create a query to fetch documents where the document ID is not equal to loggedInUserId
        const usersQuery = await query(usersCollection, where("__name__", "==", myId));
  
        // Execute the query and get the documents
        const querySnapshot = await getDocs(usersQuery);
  
        // Map the documents to an array of user data
        const users = await querySnapshot.docs.map(doc => (doc.data()));
         
        data = users;

        return data
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return [];
    } finally {
        return data
    }

  } 
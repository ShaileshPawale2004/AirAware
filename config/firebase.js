import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDE5Nu7RldnpvypaemDnZ_gB0WdwXI6Mho",
    authDomain: "airaware-d2176.firebaseapp.com",
    projectId: "airaware-d2176",
    storageBucket: "airaware-d2176.appspot.com",
    messagingSenderId: "616443119344",
    appId: "1:616443119344:web:dc5c346108420e1bfd2435",
    measurementId: "G-GP9S21SZ6V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

const storeUser = async (user, password) => {
    try {
        await addDoc(collection(db, "users"), {
            username: user,
            password: password, 
        });
        console.log("User saved!");
    } catch (error) {
        console.error("Error saving user:", error);
    }
};

// Function to retrieve users
const getUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map(doc => doc.data()); // Return user list
    } catch (error) {
        console.error("Error getting users:", error);
        return [];
    }
};


export { db, storeUser, getUsers };

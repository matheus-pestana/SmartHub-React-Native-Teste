import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC4ib3Ulgdpl3fyR0Y0xeZL0FTgqricMoU",
    authDomain: "smarthub-24bf7.firebaseapp.com",
    projectId: "smarthub-24bf7",
    storageBucket: "smarthub-24bf7.appspot.com",
    messagingSenderId: "1064690170638",
    appId: "1:1064690170638:web:89c8e4982dcd1895a3355f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, ref, getDownloadURL };
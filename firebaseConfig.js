// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Add more imports as needed

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4ib3Ulgdpl3fyR0Y0xeZL0FTgqricMoU",
    authDomain: "smarthub-24bf7.firebaseapp.com",
    projectId: "smarthub-24bf7",
    storageBucket: "smarthub-24bf7.appspot.com",
    messagingSenderId: "1064690170638",
    appId: "1:1064690170638:web:89c8e4982dcd1895a3355f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// Add more initializations as needed

export { auth };

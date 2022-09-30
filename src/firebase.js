
import * as firebase from "firebase/app";
import {getAuth} from 'firebase/auth';

import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaKVGoux3o20djdGdCXBGGsarnyePm87E",
  authDomain: "app-uees-app.firebaseapp.com",
  projectId: "app-uees-app",
  storageBucket: "app-uees-app.appspot.com",
  messagingSenderId: "541363763023",
  appId: "1:541363763023:web:ee5b2e28f7743bcbd1773a"
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

//user authentication module for firebase
export const auth = getAuth(app);

//firestore module for firebase
export const db = getFirestore(app);








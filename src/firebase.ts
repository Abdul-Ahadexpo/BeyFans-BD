import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMwMiob_Ujl8vM76RJnQJJsU9-Eq6olfg",
  authDomain: "beyfans-bd.firebaseapp.com",
  projectId: "beyfans-bd",
  storageBucket: "beyfans-bd.firebasestorage.app",
  messagingSenderId: "716444313252",
  appId: "1:716444313252:web:8f5529476715a40a51e831",
  databaseURL: "https://beyfans-bd-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;
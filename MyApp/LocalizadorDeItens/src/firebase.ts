import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBPllw1p_Pp_l1P1iB6yJclg5UrbHbSlCg",
  authDomain: "localizadordeitens.firebaseapp.com",
  projectId: "localizadordeitens",
  storageBucket: "localizadordeitens.firebasestorage.app",
  messagingSenderId: "534238134958",
  appId: "1:534238134958:web:ed85850f41207049ec233f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
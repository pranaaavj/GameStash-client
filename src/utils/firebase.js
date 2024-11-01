import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDnGyDMplaTzYbXlIxwOPY1BYMVCdM7omk',
  authDomain: 'devzone-3f3ea.firebaseapp.com',
  projectId: 'devzone-3f3ea',
  storageBucket: 'devzone-3f3ea.appspot.com',
  messagingSenderId: '318168655108',
  appId: '1:318168655108:web:eb63875442c30ffedf9c51',
  measurementId: 'G-X38MRNKHYB',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup };

import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";


const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_apiKey,
  authDomain:process.env.NEXT_PUBLIC_authDomain,
  projectId:process.env.NEXT_PUBLIC_projectId,
  storageBucket:process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId:process.env.NEXT_PUBLIC_messagingSenderId,
  appId:process.env.NEXT_PUBLIC_appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app)

const storage = getStorage()


export {db,storage}

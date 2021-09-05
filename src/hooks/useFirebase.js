import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4A9p9taE-2qwR99BNfxABeflz0byCQ_w",
  authDomain: "followme-dev-23d59.firebaseapp.com",
  databaseURL:
    "https://followme-dev-23d59-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "followme-dev-23d59",
  storageBucket: "followme-dev-23d59.appspot.com",
  messagingSenderId: "1086021478791",
  appId: "1:1086021478791:web:5cb4cc0218806265344b22",
};

export const getFirebaseInstance = () => {
  if (!firebase.apps.length) {
    return firebase.initializeApp(firebaseConfig);
  }

  return firebase.app();
};

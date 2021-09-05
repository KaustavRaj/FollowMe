import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { getFirebaseInstance } from "../utils/firebase";
import { getDefaultProfile } from "../utils/profile";

const defaultUser = { auth: null, profile: null };

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const fire = getFirebaseInstance();

  useEffect(() => {
    if (fire.auth().currentUser) {
      setUser((prev) => ({ ...prev, auth: fire.auth().currentUser }));
    }

    fire.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("authUser : ", authUser);

        fetchUser(authUser.uid).on("value", (snapshot) => {
          console.log("fetchUser : ", snapshot.toJSON());

          if (!snapshot.exists()) {
            // only set auth user, proceed to choose username screen
            setUser((prev) => ({ ...prev, auth: authUser }));
          } else {
            // set both values, proceed to dashboard screen
            let profile = { id: snapshot.key, ...snapshot.val() };
            setUser((prev) => ({ ...prev, auth: authUser, profile }));
          }
        });
      } else {
        // remove user's profile from state
        setUser((prev) => ({
          ...prev,
          profile: null,
          auth: null,
        }));
      }
    });
  }, []);

  const googleSignIn = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();

    return fire.auth().signInWithPopup(provider);
  };

  const facebookSignIn = async () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");

    return fire.auth().signInWithPopup(provider);
  };

  const logout = async () => fire.auth().signOut();

  const createNewUser = async (username, onError) => {
    if (user.auth) {
      let defaultUser = getDefaultProfile();

      defaultUser.username = username;
      defaultUser.displayName = username;
      defaultUser.avatar = user.auth.photoURL;
      defaultUser.signInProvider =
        user.auth.providerData[0].providerId.split(".")[0];
      defaultUser.createdOn = firebase.database.ServerValue.TIMESTAMP;

      fire
        .database()
        .ref(`/profile/${user.auth.uid}`)
        .set(defaultUser, (error) => {
          if (error) {
            onError(error);
          }
        })
        .on("value", (snapshot) => {
          let profile = { id: snapshot.key, ...snapshot.val() };
          setUser((prev) => ({ ...prev, profile }));
        });
    }
  };

  const fetchUser = (uid) => {
    return fire.database().ref(`/profile/${uid}`);
  };

  const memoisedValue = useMemo(
    () => ({
      user,
      googleSignIn,
      facebookSignIn,
      logout,
      createNewUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={memoisedValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Skeleton, SkeletonCircle, Center, Box, Fade } from "@chakra-ui/react";
import firebase from "firebase";

import Layout from "../components/Layout";
import ProfileView from "../components/ProfileView";
import { getFirebaseInstance } from "../utils/firebase";
import { useUser } from "../contexts/User";

function ProfilePage() {
  const fire = getFirebaseInstance();
  const params = useParams();
  const history = useHistory();
  const { user: currentUser } = useUser();

  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("params : ", params);

    const logViewerAnalytics = (userId) => {
      // don't log if the auth user is viewing his own profile
      // if (currentUser.profile !== null && currentUser.profile.id === userId) {
      //   return;
      // }

      let deviceWidth = window.innerWidth;
      let hostname = "";

      // hostnames parsing from referrer may give error if malformed URL is given
      try {
        hostname = new URL(document.referrer).hostname;
      } catch (e) {}

      let logData = {
        referrer: hostname,
        device:
          deviceWidth > 1200
            ? "desktop"
            : deviceWidth > 720
            ? "tablet"
            : "mobile",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      };

      let startOfTodayTimestamp = new Date();
      startOfTodayTimestamp.setHours(0, 0, 0, 0);
      startOfTodayTimestamp = String(startOfTodayTimestamp.getTime() / 1000);

      // logging data at : /profile/{profileID}/analytics/page/{timestamp}
      try {
        fire
          .database()
          .ref("profile")
          .child(userId)
          .child("analytics/page")
          .child(startOfTodayTimestamp)
          .push()
          .set(logData, (e) => {
            if (e) {
              console.log("Some error occured :");
              console.log(JSON.stringify(e));
            } else {
              console.log("Logged user data : ", JSON.stringify(logData));
            }
          });
      } catch (e) {
        console.warn(e);
      }
    };

    async function fetchUser() {
      return fire
        .database()
        .ref("/profile")
        .orderByChild("username")
        .equalTo(params.profile)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            let [key, value] = Object.entries(snapshot.val())[0];
            setUser({ ...value, id: key });
            logViewerAnalytics(key);
          } else {
            history.push("/404");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    fetchUser();

    return () => fetchUser();
  }, []);

  return (
    <Layout pageTitle={params.profile}>
      {user !== null && user ? (
        <Fade in={true}>
          <ProfileView data={user} />
        </Fade>
      ) : (
        <Center w="100vw" h="100vh" alignItems="flex-start" p="4" pt="20">
          <Box w="full" maxW="xl">
            <Center>
              <SkeletonCircle size="96px" />
            </Center>

            <Center w="full">
              <Skeleton w="200px" height="20px" mt="6" mb="8" />
            </Center>

            <Skeleton height="48px" mt="4" />
            <Skeleton height="48px" mt="4" />
            <Skeleton height="48px" mt="4" />
          </Box>
        </Center>
      )}
    </Layout>
  );
}

export default ProfilePage;

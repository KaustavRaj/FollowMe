import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Skeleton, SkeletonCircle, Center, Box, Fade } from "@chakra-ui/react";

import Layout from "../components/Layout";
import ProfileView from "../components/ProfileView";
import { getFirebaseInstance } from "../utils/firebase";

function ProfilePage() {
  const firebase = getFirebaseInstance();
  const params = useParams();
  const history = useHistory();

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      return firebase
        .database()
        .ref("/profile")
        .orderByChild("username")
        .equalTo(params.profile)
        .once("value")
        .then((snapshot) => {
          let resultLength = Object.keys(snapshot.toJSON()).length;

          if (snapshot.exists() && resultLength) {
            let [key, value] = Object.entries(snapshot.val())[0];
            setUser({ ...value, id: key });
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
    <Layout>
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

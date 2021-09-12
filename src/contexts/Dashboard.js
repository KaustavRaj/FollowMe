import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  useBoolean,
  useToast,
  Spinner,
  Stack,
  Center,
  Heading,
} from "@chakra-ui/react";
import isEqual from "react-fast-compare";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { getFirebaseInstance } from "../utils/firebase";
import { useUser } from "./User";

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState({});
  const [isLoading, setLoading] = useBoolean(true);
  const { user } = useUser();
  const toast = useToast();
  const fire = getFirebaseInstance();
  const db = fire.database().ref(`/profile/${user.profile.id}`);
  const disk = firebase.storage().ref().child(user.profile.id);

  // Utility function
  const onError = (err) => {
    if (err) {
      toast({
        title: "Error",
        description: "An error has occured while saving. Please try again.",
        isClosable: true,
        status: "error",
      });
      console.error(err);
    }
  };

  // Utility function
  const onSuccess = (err) => {
    setLoading.off();
    onError(err);
  };

  useEffect(() => {
    db.on("value", (snapshot) => {
      let value = snapshot.val();

      if (!isEqual(value, dashboard)) {
        setDashboard(value);
        setLoading.off();
      }
    });

    return () => db.off();
  }, []);

  const addCustomLink = (values) => {
    setLoading.on();
    db.child("links/custom").push().set(values, onSuccess);
  };

  const removeCustomLink = (linkId) => {
    setLoading.on();

    let obj = {};
    obj[`links/custom/${linkId}`] = null;

    db.update(obj, onSuccess);
  };

  const updateCustomLink = (linkId, values) => {
    setLoading.on();

    let obj = {};
    obj[`links/custom/${linkId}`] = values;

    db.update(obj, onSuccess);
  };

  const updateLinkPositions = (positions) => {
    let updateObj = {};

    Object.entries(positions).map(([linkId, newPosition]) => {
      updateObj[`links/custom/${linkId}/position`] = newPosition;
    });

    db.update(updateObj, onSuccess);
  };

  const updateBaseTheme = (themeName) => {
    setLoading.on();
    db.update(
      {
        "theme/baseTheme": themeName,
        "theme/customizations": null,
      },
      onSuccess
    );
  };

  const updateCustomButton = (buttonId) => {
    setLoading.on();
    db.update({ "theme/customizations/buttonId": buttonId }, onSuccess);
  };

  const updateBackgroundColor = (backgroundColor) => {
    setLoading.on();
    db.update(
      { "theme/customizations/backgroundColor": backgroundColor },
      onSuccess
    );
  };

  const updateTextColor = (textColor) => {
    setLoading.on();
    db.update({ "theme/customizations/textColor": textColor }, onSuccess);
  };

  const updateSocialLink = (linkType, value) => {
    setLoading.on();
    value = value.length === 0 ? null : value;

    let dbPath = {};
    dbPath[`links/social/${linkType}`] = value;
    db.update(dbPath, onSuccess);
  };

  const memoisedValue = useMemo(
    () => ({
      dashboard,
      isLoading,
      addCustomLink,
      removeCustomLink,
      updateCustomLink,
      updateLinkPositions,
      updateBaseTheme,
      updateCustomButton,
      updateBackgroundColor,
      updateTextColor,
      uploadAvatar,
      removeAvatar,
      updateProfileTitle,
      updateBio,
      updateSocialLink,
    }),
    [isLoading, user]
  );

  return (
    <DashboardContext.Provider value={memoisedValue}>
      {Object.keys(dashboard).length > 0 ? (
        children
      ) : (
        <Center w="100vw" h="100vh">
          <Stack spacing={4}>
            <Center>
              <Spinner size="xl" />
            </Center>
            <Center>
              <Heading size="md">Loading your dashboard</Heading>
            </Center>
          </Stack>
        </Center>
      )}
    </DashboardContext.Provider>
  );
}

export const useDashboard = (props) => {
  return useContext(DashboardContext);
};

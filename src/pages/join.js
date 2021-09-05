import React, { Fragment, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { IconButton, Spinner } from "@chakra-ui/react";
import {
  Stack,
  Center,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  Text,
  Box,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useUser } from "../contexts/User";
import useQuery from "../hooks/useQuery";
import Layout from "../components/Layout";
import { useNotification } from "../contexts/Notification";

const providers = [
  {
    name: "Google",
    icon: FcGoogle,
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    color: "#4267B2",
  },
];

function JoinPage() {
  const query = useQuery();
  const history = useHistory();
  const { user, createNewUser, googleSignIn, facebookSignIn } = useUser();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user.auth !== null) {
      history.push("/join?next=chooseUsername");
    }
  }, [user]);

  const initialFormValues = {
    username: "",
  };

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too short username!")
      .max(25, "Too long username!")
      .required("Username must be between 3-25 characters"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    createNewUser(values.username, (error) => {
      console.log("createNewUser error : ", error);

      setSubmitting(false);
      showNotification({ status: "error", message: "Username already exists" });
    });
  };

  const signInWithProvider = async (providerName) => {
    if (providerName === "Google") {
      await googleSignIn();
    } else if (providerName === "Facebook") {
      await facebookSignIn();
    }
  };

  const ChooseProviderScreen = () => (
    <Fragment>
      <Center>
        <Text mb="4">Join using anyone of the given providers</Text>
      </Center>
      <SimpleGrid spacing="2" columns={1}>
        {providers.map((provider, i) => (
          <Button
            key={`${provider.name}_${i}`}
            variant="outline"
            size="lg"
            onClick={() => signInWithProvider(provider.name)}
          >
            <Icon as={provider.icon} color={provider.color} />
            <Text ml="3">{provider.name}</Text>
          </Button>
        ))}
      </SimpleGrid>
    </Fragment>
  );

  const ChooseUsernameScreen = () => (
    <Fragment>
      <Center>
        <Text mb="4">Pick a username</Text>
      </Center>

      <Formik
        validationSchema={RegisterSchema}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
      >
        {({ props }) => (
          <Form>
            <Stack spacing="4">
              <Field name="username">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isInvalid={
                        form.touched.username &&
                        form.errors.username !== undefined
                      }
                    >
                      <InputGroup>
                        <InputLeftAddon children={`followme/`} />
                        <Input
                          id="username"
                          placeholder="yourusername"
                          {...field}
                        />
                        <InputRightElement>
                          {form.isValidating || form.isSubmitting ? (
                            <Spinner size="sm" />
                          ) : form.errors.username && form.touched.username ? (
                            <SmallCloseIcon color="red.500" />
                          ) : (
                            form.touched.username && (
                              <IconButton
                                type="submit"
                                variant="ghost"
                                icon={
                                  <Icon
                                    w={6}
                                    h={6}
                                    as={IoArrowForwardCircleOutline}
                                  />
                                }
                              />
                            )
                          )}
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.username}
                      </FormErrorMessage>
                    </FormControl>
                  );
                }}
              </Field>
            </Stack>
          </Form>
        )}
      </Formik>
    </Fragment>
  );

  return (
    <Layout pageTitle="Login">
      <Center
        minW="full"
        bg={{ base: "white", md: "gray.100" }}
        style={{ minHeight: "100vh" }}
      >
        <Box
          w="xl"
          p={{ base: "2", md: "12" }}
          bg="white"
          boxShadow={{ base: "none", md: "md" }}
          rounded="3xl"
        >
          <Stack spacing="4">
            <Center>
              <Text mb="2" fontSize="2xl">
                FollowMe account
              </Text>
            </Center>

            {query.next === "chooseUsername" ? (
              <ChooseUsernameScreen />
            ) : (
              <ChooseProviderScreen />
            )}
          </Stack>
        </Box>
      </Center>
    </Layout>
  );
}

export default JoinPage;

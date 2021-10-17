import React from "react";
import { Center, Text, Heading, Button, Box } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import Layout from "../components/Layout";

function NotFoundPage() {
  const history = useHistory();

  return (
    <Layout pageTitle="404">
      <Center h="100vh">
        <Box>
          <Heading textAlign="center" mb="4">
            404
          </Heading>
          <Text textAlign="center">
            The page you're looking for doesn't exist
          </Text>
          <Center mt="8">
            <Button colorScheme="purple" onClick={() => history.push("/")}>
              Back to Home
            </Button>
          </Center>
        </Box>
      </Center>
    </Layout>
  );
}

export default NotFoundPage;

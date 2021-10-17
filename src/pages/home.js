import {
  Box,
  Flex,
  Center,
  Text,
  Heading,
  Button,
  Spacer,
  Icon,
  HStack,
  Stack,
  Image,
  Avatar,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useHistory, Link } from "react-router-dom";
import { IoMdColorWand } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";
import { CgFeed } from "react-icons/cg";

import { useUser } from "../contexts/User";
import Layout from "../components/Layout";

const siteBenefits = [
  {
    key: "benefit_1",
    title: "Customize",
    description:
      "Make your FollowMe pop. Embody your brand through custom themes, buttons and colors.",
    icon: IoMdColorWand,
  },
  {
    key: "benefit_2",
    title: "Analytics",
    description:
      "Gain valuable insight into your traffic and discover which content is performing with your audience.",
    icon: BsGraphUp,
  },
  {
    key: "benefit_3",
    title: "Feed",
    description:
      "Tired of logging into social media apps everytime? Get all your social media feeds at one place.",
    icon: CgFeed,
  },
];

function BenefitCard({ title, description, icon }) {
  return (
    <Box maxW="300px" p={6} rounded="xl" border="1px" borderColor="gray.400">
      <HStack spacing={3}>
        <Icon as={icon} w={8} h={8} />
        <Heading fontSize="2xl">{title}</Heading>
      </HStack>

      <Text mt={4}>{description}</Text>
    </Box>
  );
}

export default function HomePage() {
  const buttonSize = useBreakpointValue({ base: "sm", lg: "md" });
  const history = useHistory();
  const { user } = useUser();

  return (
    <Layout>
      <Flex
        bg="white"
        w="full"
        py={4}
        px={6}
        pos="fixed"
        top={0}
        align="center"
      >
        <Link to="/">
          <Flex align="center">
            <Image
              src="icon.png"
              alt="app logo"
              h={{ base: 8, lg: 10 }}
              w={{ base: 8, lg: 10 }}
            />
            <Text ml={2} fontSize="lg" fontWeight="semibold">
              FollowMe
            </Text>
          </Flex>
        </Link>

        <Spacer />

        {user.profile !== null ? (
          <Link to="/dashboard">
            <Avatar
              bg="green.500"
              src={user.profile.avatar}
              size={buttonSize}
              rounded="full"
              objectFit="contain"
            />
          </Link>
        ) : (
          <Button
            colorScheme="purple"
            size={buttonSize}
            onClick={() => history.push("/join")}
          >
            Join now !
          </Button>
        )}
      </Flex>

      <Center mt={{ base: 20, lg: 36 }} p={8} flexDir="column">
        <Heading fontWeight="normal" size="3xl" align="center">
          The Only Link You’ll Ever Need
        </Heading>
        <Text fontSize="xl" mt={6} align="center">
          Connect audiences to all of your content with just one link
        </Text>

        <SimpleGrid
          mt={{ base: 12, lg: 20 }}
          spacing={8}
          columns={{ base: 1, lg: 3 }}
          justifyContent="center"
        >
          {siteBenefits.map((benefit) => (
            <BenefitCard {...benefit} />
          ))}
        </SimpleGrid>
      </Center>
    </Layout>
  );
}

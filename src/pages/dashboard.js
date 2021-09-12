import React, { useRef, useState, useCallback } from "react";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import {
  Avatar,
  Container,
  Flex,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Stack,
  Text,
  Switch,
  Button,
  Spacer,
  Center,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  IconButton,
  List,
  ListItem,
  useClipboard,
  useBreakpointValue,
  createIcon,
  chakra,
  Image,
  useDisclosure,
  Circle,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { IoTrashOutline } from "react-icons/io5";
import { HiPencil } from "react-icons/hi";

import MobileView from "../components/MobileView";
import useWindowDimensions from "../hooks/useWindowDimentions";
import { DashboardProvider, useDashboard } from "../contexts/Dashboard";
import AddNewLink from "../components/AddNewLink";

const CircleIcon = createIcon({
  displayName: "CircleIcon",
  viewBox: "0 0 200 200",
  path: (
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  ),
});

const ScrollContent = ({ children }) => {
  const { height } = useWindowDimensions();
  const marginTop = useBreakpointValue({ base: 120, sm: 65 }) || 0;

  return (
    <SimpleBar style={{ maxHeight: height - marginTop }}>{children}</SimpleBar>
  );
};

function SectionCard(props) {
  return (
    <Stack spacing={4}>
      <HStack spacing={4}>
        {props.icon && (
          <Box
            bg="white"
            paddingX="6px"
            rounded="lg"
            border="2px"
            borderColor="purple.500"
          >
            <Icon as={props.icon} color="purple.500" w={3} h={3} />
          </Box>
        )}
        <Text as="strong" fontSize={18}>
          {props.title}
        </Text>
      </HStack>
      <Box
        bg={props.noBg ? "transparent" : "white"}
        py="4"
        px="6"
        color="gray.600"
      >
        {props.children}
      </Box>
    </Stack>
  );
}

function CustomLink({ linkData }) {
  const { dashboard, removeCustomLink, updateCustomLink, updateLinkPositions } =
    useDashboard();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateLink = (values) => {
    if (typeof values === "object") {
      values["position"] = linkData.position;
      updateCustomLink(linkData.id, values);
    }

    onClose();
  };

  const deleteLink = () => {
    removeCustomLink(linkData.id);
  };

  const neighbours = () => {
    let list = {};
    let inverted = {};

    Object.entries(dashboard.links.custom).forEach(([linkId, value]) => {
      list[linkId] = value.position;
      inverted[value.position] = linkId;
    });

    let linkPosition = list[linkData.id];
    let neighbours = {
      above: inverted[linkPosition - 1],
      below: inverted[linkPosition + 1],
    };

    return neighbours;
  };

  const moveUp = () => {
    const surround = neighbours();

    if (surround.above) {
      let updateObj = {};
      updateObj[linkData.id] = linkData.position - 1;
      updateObj[surround.above] = linkData.position;
      updateLinkPositions(updateObj);
    }
  };

  const moveDown = () => {
    const surround = neighbours();

    if (surround.below) {
      let updateObj = {};
      updateObj[linkData.id] = linkData.position + 1;
      updateObj[surround.below] = linkData.position;
      updateLinkPositions(updateObj);
    }
  };

  return (
    <Flex alignItems="center" bg="white" boxShadow="md" color="gray.500" py="3">
      <Center h="full">
        <Stack mx={1} h="full" spacing={8}>
          <IconButton size="xs" variant="ghost" onClick={moveUp}>
            <ChevronUpIcon w={6} h={6} cursor="pointer" />
          </IconButton>
          <IconButton size="xs" variant="ghost" onClick={moveDown}>
            <ChevronDownIcon w={6} h={6} cursor="pointer" />
          </IconButton>
        </Stack>
      </Center>

      <Divider
        orientation="vertical"
        bg="red"
        rounded
        border="1px"
        borderColor="gray.400"
        zIndex={100}
        h={20}
      />

      <Stack flex="1" px="4" spacing="4">
        <Flex>
          <Box>
            <Text as="strong">{linkData.title}</Text>
            <Text>{linkData.url}</Text>
          </Box>
          <Spacer />
          <Switch colorScheme="green" isChecked={linkData.show} />
        </Flex>

        <Flex justify="space-between" align="center">
          <IconButton size="xs" variant="ghost" onClick={onOpen}>
            <Icon cursor="pointer" as={HiPencil} w={5} h={5} />
          </IconButton>
          <Text>{`link #${linkData.position + 1}`}</Text>
          <IconButton size="xs" variant="ghost" onClick={deleteLink}>
            <Icon cursor="pointer" as={IoTrashOutline} w={5} h={5} />
          </IconButton>
        </Flex>
      </Stack>

      <AddNewLink
        title={`Edit Link #${linkData.position + 1}`}
        isOpen={isOpen}
        onSave={updateLink}
        existing={linkData}
      />
    </Flex>
  );
}

function AppearanceSection() {
  const {
    dashboard,
    updateBaseTheme,
    updateCustomButton,
    updateBackgroundColor,
    updateTextColor,
  } = useDashboard();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [bgColorPickerOpen, setBgColorPickerOpen] = useBoolean(false);

  const bgColor = () => {
    let custom = dashboard.theme.customizations;
    if (custom && custom.backgroundColor) {
      return custom.backgroundColor;
    }
    return;
  };

  const textColor = () => {
    let theme = combineThemeWithCustomizations(dashboard);
    return theme.background.textColor;
  };

  const bgImage = (theme) =>
    theme.background.coverType === "gradient"
      ? theme.background.gradient
      : `url('${theme.background.image}')`;

  const onSaveColor = (color) => {
    console.log(
      `color : ${
        typeof color === "object" ? color.hex : color
      }, bgColorPickerOpen : ${bgColorPickerOpen}`
    );

    if (color) {
      if (bgColorPickerOpen && color.hex !== bgColor()) {
        updateBackgroundColor(color.hex || null);
      } else if (!bgColorPickerOpen && color.hex !== textColor()) {
        updateTextColor(color.hex || null);
      }
    }

    onClose();
  };

  const onOpenPicker = (isBgColor) => {
    if (isBgColor) {
      setBgColorPickerOpen.on();
    } else {
      setBgColorPickerOpen.off();
    }

    onOpen();
  };

  const DisplayButton = ({ id, theme }) => (
    <Box
      w="full"
      h="10"
      border="2px"
      borderColor={theme.borderColor}
      bg={theme.bg}
      rounded={theme.rounded}
      cursor="pointer"
      style={
        theme.shadow
          ? {
              boxShadow: `${theme.shadow.shadowPos} rgba(0, 0, 0, 0.36)`,
            }
          : null
      }
      onClick={() => updateCustomButton(id)}
    >
      {"    "}
    </Box>
  );

  const DisplayTheme = ({ name, theme, onlyBg }) => (
    <Flex
      flexDir="column"
      h="64"
      cursor="pointer"
      onClick={() => updateBaseTheme(name)}
    >
      <Center
        w="full"
        p="4"
        rounded="md"
        bgImg={bgImage(theme)}
        flex="1"
        border="1px"
        borderColor="gray.300"
      >
        <Stack w="full" spacing="2">
          {/* This are for buttons inside the custom themes */}
          {!onlyBg &&
            [1, 2, 3].map((value) => (
              <Box
                key={`Button-${name}-${value}`}
                w="full"
                h="6"
                border="2px"
                borderColor={theme.link.borderColor}
                color={theme.link.textColor}
                bg={theme.link.backgroundColor}
                rounded={theme.link.roundCorners}
                cursor="pointer"
                _hover={{
                  bg: theme.link.onHover.backgroundColor,
                  color: theme.link.onHover.textColor,
                }}
              >
                {"    "}
              </Box>
            ))}
        </Stack>
      </Center>
      <Text textAlign="center">{name}</Text>
    </Flex>
  );

  return (
    <ScrollContent>
      <Box px="4" py="8">
        <List spacing="8">
          <ListItem>
            <SectionCard title="Themes">
              <SimpleGrid spacing={6} columns={{ base: 2, lg: 3 }}>
                {Object.entries(defaults.themes).map(([name, theme]) => (
                  <DisplayTheme key={name} name={name} theme={theme} />
                ))}
              </SimpleGrid>

              <ColorPicker
                bgColorPickerOpen={bgColorPickerOpen}
                isOpen={isOpen}
                onSave={onSaveColor}
                initColor={bgColor()}
              />
            </SectionCard>
          </ListItem>

          <ListItem>
            <SectionCard title="Buttons">
              <Stack spacing="6">
                {Object.entries(defaults.buttons).map(([title, rowButtons]) => (
                  <Stack spacing="2" key={`rowButtons_${title}`}>
                    <Text>{title}</Text>
                    <SimpleGrid spacing={6} columns={{ base: 2, lg: 3 }}>
                      {rowButtons.map((customButton) => (
                        <DisplayButton
                          id={customButton.id}
                          key={customButton.id}
                          theme={{
                            borderColor: customButton.bg
                              ? "transparent"
                              : "blackAlpha.500",
                            bg: customButton.bg
                              ? "blackAlpha.500"
                              : "transparent",
                            rounded: customButton.border,
                            shadow: customButton.shadow,
                          }}
                        />
                      ))}
                    </SimpleGrid>
                  </Stack>
                ))}
              </Stack>
            </SectionCard>
          </ListItem>
        </List>
      </Box>
    </ScrollContent>
  );
}

function LinksSection() {
  const { dashboard, addCustomLink } = useDashboard();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addLink = (values) => {
    if (typeof values === "object") {
      let position = 0;
      if (
        typeof dashboard.links === "object" &&
        typeof dashboard.links.custom === "object"
      ) {
        position = Object.keys(dashboard.links.custom).length;
      }

      values["position"] = position;
      addCustomLink(values);
    }

    onClose();
  };

  const rearrangeCustomLinks = (linksFromProfile) => {
    if (linksFromProfile) {
      let list = Object.entries(linksFromProfile).map(([linkId, value]) => ({
        ...value,
        id: linkId,
      }));

      list.sort((link1, link2) => link1.position - link2.position);

      return list;
    }
    return [];
  };

  return (
    <ScrollContent>
      <Box flex="1" p="8">
        <Button colorScheme="purple" w="100%" mb="8" onClick={onOpen}>
          Add New Link
        </Button>

        <List spacing="4">
          {typeof dashboard.links === "object" &&
            rearrangeCustomLinks(dashboard.links.custom).map(
              (eachCustomLink) => (
                <ListItem key={eachCustomLink.id}>
                  <CustomLink linkData={eachCustomLink} />
                </ListItem>
              )
            )}
        </List>

        <AddNewLink isOpen={isOpen} onSave={addLink} />
      </Box>
    </ScrollContent>
  );
}

function AdminPage() {
  const { user, logout } = useUser();
  const { dashboard, isLoading } = useDashboard();
  const profileURL = `${process.env.REACT_APP_URL}/${user.profile.username}`;
  const { hasCopied, onCopy } = useClipboard(profileURL);

  const signOut = async () => {
    await logout();
  };

  return (
    <Layout pageTitle="Admin">
      <Container
        minW="full"
        p="0"
        d="flex"
        bg="gray.100"
        style={{
          minHeight: "100vh",
        }}
      >
        {/* Desktop screen - left bar */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDir="column"
          px="2"
          py="4"
          bg="white"
          minH="full"
          borderRightWidth={1}
          d={{ base: "none", md: "flex" }}
        >
          <Circle h={12} w={12}></Circle>

          <Stack spacing="4" display="flex" align="center">
            <Menu>
              <MenuButton>
                <Avatar
                  h={12}
                  w={12}
                  bg="green.500"
                  src={dashboard.avatar}
                  rounded="full"
                  objectFit="contain"
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={signOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>

        <Flex flex="1" flexDir={{ base: "column", md: "row" }}>
          {/* Mobile screen - top nav bar */}
          <Flex bg="white" p="4" w="full" d={{ base: "flex", md: "none" }}>
            <Image src="icon.png" alt="app logo" height={8} width={8} />
            <Flex ml={3} as="strong" align="center">
              FollowMe
            </Flex>
            <Spacer />
            <Menu>
              <MenuButton>
                <HamburgerIcon w={6} h={6} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onCopy}>Copy Profile URL</MenuItem>
                <MenuItem onClick={signOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Divider d={{ base: "block", md: "none" }} />

          <Box flex="1" borderRightWidth={1}>
            <Tabs defaultIndex={1}>
              <TabList
                bg="white"
                pt={1}
                px={{ base: "2", lg: "0" }}
                d="flex"
                justifyContent={{ base: "space-between", lg: "flex-start" }}
              >
                <Tab px={{ base: "2", lg: "4" }} py="4">
                  Links
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <LinksSection />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Render Mobile View */}
          <Box flex="1" d={{ base: "none", md: "flex" }} flexDir="column">
            <Flex
              w="100%"
              bg="white"
              p="3.5"
              alignItems="center"
              borderBottomWidth={1}
              borderLeftWidth={1}
            >
              <Text fontSize="md">
                <chakra.strong>My FollowMe:</chakra.strong>{" "}
                <u>
                  <chakra.a href={profileURL}>{profileURL}</chakra.a>
                </u>
              </Text>
              <Spacer />
              <Button variant="outline" size="sm" onClick={onCopy}>
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
            </Flex>

            <Center pos="relative" flex="1">
              <MobileView data={dashboard} isLoading={isLoading} />
            </Center>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
}

const AdminPageWrapper = () => {
  return (
    <DashboardProvider>
      <AdminPage />
    </DashboardProvider>
  );
};

export default AdminPageWrapper;

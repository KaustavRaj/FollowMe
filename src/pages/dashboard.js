import React, {
  useRef,
  useState,
  useCallback,
  Fragment,
  useEffect,
} from "react";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import {
  Avatar,
  Container,
  Flex,
  Box,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tooltip,
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  List,
  ListItem,
  LinkOverlay,
  LinkBox,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  SimpleGrid,
  useClipboard,
  useBreakpointValue,
  createIcon,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Square,
  Heading,
  Image,
  useToast,
  useBoolean,
  useDisclosure,
  useControllableState,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { AxisOptions, Chart } from "react-charts";

import {
  HamburgerIcon,
  ViewOffIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  WarningTwoIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  IoTrashOutline,
  IoImageOutline,
  IoBarChartOutline,
  IoAt,
} from "react-icons/io5";
import { HiPencil } from "react-icons/hi";
import { FaSmile, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { TiSocialAtCircular } from "react-icons/ti";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import equal from "fast-deep-equal";

import { useUser } from "../contexts/User";
import ColorPicker from "../components/ColorPicker";
import Layout from "../components/Layout";
import MobileView from "../components/MobileView";
import useWindowDimensions from "../hooks/useWindowDimentions";
import defaults from "../defaults";
import { DashboardProvider, useDashboard } from "../contexts/Dashboard";
import {
  combineThemeWithCustomizations,
  viewableAnalytics,
} from "../utils/helpers";
import AddNewLink from "../components/AddNewLink";
import EditPopup from "../components/EditPopup";
import useURL from "../hooks/useURL";

import dummyAnalytics from "../utils/dummyAnalytics";

// const data = require("../data/profile.json");
const socialLinksInfo = require("../data/socialLinks.json");

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

const CountTag = ({ title, count, color }) => (
  <HStack>
    <CircleIcon w={3} h={3} color={color} />
    <Text>{`${title}: ${count || "-"}`}</Text>
  </HStack>
);

const ScrollContent = ({ children, topMargin }) => {
  const { height } = useWindowDimensions();
  const extraTopMargin = topMargin || 0;
  const marginTop =
    useBreakpointValue({
      base: 120 + extraTopMargin,
      sm: 65 + extraTopMargin,
    }) || 0;

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
    return "-";
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

  const changeBgColor = (color) => {
    color = color.trim();
    color = color === "" ? null : color;
    updateBackgroundColor(color);
  };

  const changeTextColor = (color) => {
    color = color.trim();
    color = color === "" ? null : color;
    updateTextColor(color);
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
              {/* Custom themes  */}
              <SimpleGrid spacing={6} columns={{ base: 2, lg: 3 }}>
                {Object.entries(defaults.themes).map(([name, theme]) => (
                  <DisplayTheme key={name} name={name} theme={theme} />
                ))}
              </SimpleGrid>

              {/* 
              <Text fontWeight="bold" fontSize="18" mt="12">
                Fixed colors
              </Text>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} mt="4">
                <Stack>
                  <Text>Background color</Text>
                  <HStack
                    spacing="4"
                    cursor="pointer"
                    onClick={() => onOpenPicker(true)}
                  >
                    <Square
                      rounded="md"
                      size="40px"
                      bg={bgColor() || "transparent"}
                      border="2px"
                      borderColor="gray.400"
                    ></Square>
                    <Center
                      rounded="md"
                      border="2px"
                      borderColor="gray.300"
                      w="full"
                      px={2}
                      py={1.5}
                    >
                      {bgColor() || "None"}
                    </Center>
                  </HStack>
                </Stack>

                <Stack>
                  <Text>Text color</Text>
                  <HStack
                    spacing="4"
                    cursor="pointer"
                    onClick={() => onOpenPicker(false)}
                  >
                    <Square
                      rounded="md"
                      size="40px"
                      bg={textColor() || "Transparent"}
                      border="2px"
                      borderColor="gray.400"
                    ></Square>
                    <Center
                      rounded="md"
                      border="2px"
                      borderColor="gray.300"
                      w="full"
                      px={2}
                      py={1.5}
                    >
                      {textColor() || "None"}
                    </Center>
                  </HStack>
                </Stack>
              </SimpleGrid> */}

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

          <ListItem>
            <SectionCard title="Colors">
              <Stack spacing="6">
                <Stack>
                  <Heading size="sm">Background color</Heading>
                  <Editable
                    defaultValue={bgColor()}
                    border="1px"
                    rounded="md"
                    onSubmit={changeBgColor}
                    placeholder={bgColor()}
                  >
                    <EditablePreview px="4" py="2" />
                    <EditableInput px="4" py="2" />
                  </Editable>
                </Stack>

                <Stack>
                  <Heading size="sm">Text color</Heading>
                  <Editable
                    defaultValue={textColor()}
                    border="1px"
                    rounded="md"
                    onSubmit={changeTextColor}
                    placeholder={textColor()}
                  >
                    <EditablePreview px="4" py="2" />
                    <EditableInput px="4" py="2" />
                  </Editable>
                </Stack>
              </Stack>
            </SectionCard>
          </ListItem>
        </List>
      </Box>
    </ScrollContent>
  );
}

function SettingsSection() {
  const MAX_BIO_LENGTH = 80;
  const [bio, setBio] = useState("");
  const [editingType, setEditingType] = useState(null);
  const {
    dashboard,
    updateProfileTitle,
    updateBio,
    updateSocialLink,
    uploadAvatar,
    removeAvatar,
  } = useDashboard();
  const fileUploadRef = useRef();
  const toast = useToast();

  const _onUpdateLink = (linkType, linkValue) => {
    setEditingType(null);

    console.log("type of : ", typeof linkValue);

    if (typeof linkValue === "string") {
      console.log(`link data => ${linkType} : ${linkValue.length}`);
      updateSocialLink(linkType, linkValue);
    }
  };

  const saveBio = useCallback((event) => {
    let typed = event.target.value;
    if (typed.length <= MAX_BIO_LENGTH) {
      setBio(typed);
    }
  }, []);

  const getSocialLink = (linkType) => {
    return dashboard.links && dashboard.links.social
      ? dashboard.links.social[linkType]
      : "";
  };

  const getLinkTitle = useCallback((linkType) => {
    let link = socialLinksInfo.find((value) => value.type === linkType);
    return link.title;
  }, []);

  const getHeightAndWidthFromDataUrl = (dataURL) =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({
          height: img.height,
          width: img.width,
        });
      };
      img.src = dataURL;
    });

  const ConnectAccounts = () => {
    const connectedAccounts = new Set(
      Object.keys({
        facebook: "",
      })
    );

    const providers = [
      {
        id: "facebook",
        name: "Facebook",
        icon: FaFacebook,
        color: "#4267B2",
      },
      {
        id: "instagram",
        name: "Instagram",
        icon: FaInstagram,
        color: "#E1306C",
      },
      {
        id: "twitter",
        name: "Twitter",
        icon: FaTwitter,
        color: "#1DA1F2",
      },
    ];

    return (
      <SectionCard title="Connect social accounts" icon={ViewIcon}>
        <Stack>
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              size="lg"
              disabled={connectedAccounts.has(provider.id)}
            >
              <Icon as={provider.icon} color={provider.color} w={6} h={6} />
              <Text ml="3">
                {connectedAccounts.has(provider.id)
                  ? `${provider.name} connected`
                  : `Connect ${provider.name}`}
              </Text>
            </Button>
          ))}
        </Stack>
      </SectionCard>
    );
  };

  return (
    <ScrollContent>
      <Box px="4" py="8">
        <List spacing="8">
          <ListItem>
            <SectionCard title="Profile" icon={EditIcon}>
              <Stack spacing="4" mb="4">
                <HStack spacing="4">
                  <Avatar
                    h={24}
                    w={24}
                    bg="green.500"
                    src={dashboard.avatar}
                    rounded="full"
                    objectFit="contain"
                    cursor="pointer"
                  />

                  <SimpleGrid
                    flex="1"
                    columns={{ base: 1, md: 2 }}
                    spacing={{ base: 2, md: 4 }}
                  >
                    <input
                      type="file"
                      ref={fileUploadRef}
                      style={{ display: "none" }}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                      onChange={(event) => {
                        let files = event.target.files;

                        if (files.length > 0) {
                          let uploadedFile = files[0];

                          if (uploadedFile.size > 5 * 1024 * 1024) {
                            toast({
                              title: "Error",
                              description:
                                "Avatar's file size must be within 5 MB",
                              isClosable: true,
                              status: "error",
                            });
                          } else {
                            getHeightAndWidthFromDataUrl(
                              URL.createObjectURL(uploadedFile)
                            )
                              .then(({ width, height }) => {
                                if (width <= 512 && height <= 512) {
                                  console.log("upload file : ", uploadedFile);
                                  uploadAvatar(uploadedFile);
                                } else {
                                  toast({
                                    title: "Error",
                                    description:
                                      "Avatar's both height and width can be atmost 512px",
                                    isClosable: true,
                                    status: "error",
                                  });
                                }
                              })
                              .catch(console.warn);
                          }
                        }
                      }}
                    ></input>
                    <Button
                      w="full"
                      colorScheme="purple"
                      onClick={() => fileUploadRef.current.click()}
                    >
                      Pick an image
                    </Button>
                    <Button w="full" colorScheme="gray" onClick={removeAvatar}>
                      Remove
                    </Button>
                  </SimpleGrid>
                </HStack>

                <Stack spacing="1">
                  <Text fontSize={14}>Profile Title</Text>
                  <Input
                    placeholder={`${dashboard.displayName}`}
                    onBlur={(event) => {
                      let val = event.target.value;
                      if (val.length > 0 && val !== dashboard.displayName) {
                        updateProfileTitle(val);
                      }
                    }}
                  />
                </Stack>

                <Stack spacing="1">
                  <Text fontSize={14}>Bio</Text>
                  <Textarea
                    value={bio}
                    onChange={saveBio}
                    onBlur={() => updateBio(bio)}
                    placeholder={
                      dashboard.bio
                        ? JSON.parse(dashboard.bio)
                        : "Enter a bio description to appear on your FollowMe"
                    }
                  />
                  <Text fontSize={12} color="gray.800" align="right">
                    {bio.length}/{MAX_BIO_LENGTH}
                  </Text>
                </Stack>
              </Stack>
            </SectionCard>
          </ListItem>

          <ListItem>
            <SectionCard title="Social Links" icon={FaSmile}>
              <List spacing="8">
                {socialLinksInfo.map((eachLink) => (
                  <ListItem key={eachLink.type}>
                    <Stack spacing="1">
                      <Text fontSize={14}>{eachLink.title}</Text>
                      <Flex w="100%">
                        <Flex
                          flex={1}
                          align="center"
                          paddingX="3"
                          border="1px"
                          borderColor="gray.300"
                          borderRight="0px"
                          borderTopLeftRadius={5}
                          borderBottomLeftRadius={5}
                        >
                          {getSocialLink(eachLink.type)}
                        </Flex>
                        <IconButton
                          icon={<EditIcon />}
                          onClick={() => {
                            setEditingType(eachLink.type);
                          }}
                        />
                      </Flex>
                    </Stack>
                  </ListItem>
                ))}
              </List>

              <EditPopup
                isOpen={editingType !== null}
                title="Edit social link"
                label={editingType ? getLinkTitle(editingType) : ""}
                linkType={editingType}
                onSave={_onUpdateLink}
                placeholder={editingType ? getSocialLink(editingType) : ""}
              />
            </SectionCard>
          </ListItem>

          <ListItem>
            <ConnectAccounts />
          </ListItem>
        </List>
      </Box>
    </ScrollContent>
  );
}

/*

Analytics contents : 
1) select box - today (default), yesterday, last week, last month, overall
2) page view count
3) total link clicks count
4) horizontal bar graph with all custom links - sort by click count - mention them by link#1 - on hover, show the link title
5) horizontal bar graph with all social links - sort by click count - mention them by link type - on hover, show the link title
6) list of top 10 link referrers [including "Others" category]

*/

function AnalyticsSection() {
  // const analytics = dummyAnalytics();
  const { dashboard } = useDashboard();
  const [viewFor, setViewFor] = useState("today");
  const data = !!dashboard.analytics ? dashboard.analytics[viewFor] : undefined;

  console.log("[rendered]");

  const changeViewFor = (event) => {
    setViewFor(event.target.value);
  };

  const Timeline = () => (
    <Select
      w="full"
      maxWidth="400px"
      mb={4}
      onChange={changeViewFor}
      defaultValue={viewFor}
    >
      <option value="today">Today</option>
      <option value="lastWeek">Last Week</option>
      <option value="lastMonth">Last Month</option>
      <option value="overall">Overall</option>
    </Select>
  );

  const Counters = () => {
    let views = data.pageViews || 0;
    let clicks = data.totalClicks || 0;

    return (
      <StatGroup mt={8}>
        <Stat>
          <StatLabel>Page views</StatLabel>
          <StatNumber>{views}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total clicks</StatLabel>
          <StatNumber>{clicks}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Average CTR</StatLabel>
          <StatNumber>{views > 0 ? Math.round(clicks / views) : 0}%</StatNumber>
        </Stat>
      </StatGroup>
    );
  };

  const PageTrends = () => {
    const pageTrendsdata = !!data.pageTrends && {
      labels: data.pageTrends.map(({ label }) => label),
      datasets: [
        {
          label: "views",
          data: data.pageTrends.map(({ views }) => views),
          backgroundColor: "#FC8181",
          borderColor: "#FC8181",
          fill: false,
          lineTension: 0.5,
        },
        {
          label: "clicks",
          data: data.pageTrends.map(({ clicks }) => clicks),
          backgroundColor: "#805AD5",
          borderColor: "#805AD5",
          fill: false,
          lineTension: 0.2,
        },
      ],
    };

    return (
      <Box mt={8} w="full">
        <Heading size="md">Page popularity</Heading>
        {!!data.pageTrends && (
          <Line
            data={pageTrendsdata}
            options={{
              plugins: {
                legend: {
                  display: true,
                },
              },
            }}
          />
        )}
      </Box>
    );
  };

  const CustomRanks = () => {
    const customLinksdata = !!data.customLinks && {
      labels: data.customLinks.map(
        ({ linkId }) => `link#${dashboard.links.custom[linkId].position}`
      ),
      datasets: [
        {
          data: data.customLinks.map(({ clicks }) => clicks),
          backgroundColor: "#FC8181",
          borderColor: "#FC8181",
          fill: false,
          lineTension: 0.5,
        },
      ],
    };

    return (
      <Box mt={8} w="full">
        <Heading size="md">Custom links</Heading>
        {!!data.customLinks && (
          <Bar
            data={customLinksdata}
            options={{
              indexAxis: "y",
              barThickness: 10,
              borderRadius: 10,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        )}
      </Box>
    );
  };

  const SocialRanks = () => {
    const socialLinksdata = !!data.socialLinks && {
      labels: data.socialLinks.map(({ linkType }) => linkType),
      datasets: [
        {
          data: data.socialLinks.map(({ clicks }) => clicks),
          backgroundColor: "#FC8181",
          borderColor: "#FC8181",
          fill: false,
          lineTension: 0.5,
        },
      ],
    };

    return (
      <Box mt={8} w="full">
        <Heading size="md">Social links</Heading>
        {!!data.socialLinks && (
          <Bar
            data={socialLinksdata}
            options={{
              indexAxis: "y",
              barThickness: 10,
              borderRadius: 10,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        )}
      </Box>
    );
  };

  const Referrers = () => {
    const sortByPopularity = (data) => {
      if (Object.keys(data).length === 0) {
        return [];
      }

      let totalCount = Object.values(data).reduce(
        (prev, curr) => prev + curr,
        0
      );
      let error = 100;
      let othersIndex = 0;

      let sorted = Object.entries(data).map(([site, count], index) => {
        let percent = Math.ceil((100 * count) / totalCount);
        error -= percent;

        if (site === "others") {
          othersIndex = index;
        }

        return {
          site,
          count: percent,
        };
      });

      sorted[othersIndex].count += error;

      sorted.sort((siteA, siteB) => {
        let diff = siteA.count - siteB.count;
        if (diff === 0) return 0;
        return -diff / Math.abs(diff);
      });

      return sorted;
    };

    return (
      <Box mt={8} mb={4}>
        <Heading mb={2} size="md">
          Referred websites
        </Heading>

        <List spacing={2} px={2}>
          {!!data.referrers &&
            sortByPopularity(data.referrers).map((sites) => (
              <ListItem p={2} bg="purple.100" rounded="md">
                <Flex>
                  <Text>{sites.site}</Text>
                  <Spacer />
                  <Text>{sites.count}%</Text>
                </Flex>
              </ListItem>
            ))}
        </List>
      </Box>
    );
  };

  return (
    <ScrollContent>
      <Flex flex="1" flexDir="column" px="4" py="8" bg="white">
        {data ? (
          <React.Fragment>
            <Timeline />
            <Counters />
            {data.pageTrends ? <PageTrends /> : null}
            <CustomRanks />
            <SocialRanks />
            <Referrers />
          </React.Fragment>
        ) : (
          <Center p={4}>No Analytics registered yet...</Center>
        )}
      </Flex>
    </ScrollContent>
  );
}

function FeedSection() {
  const connectedAccounts = Object.keys({
    facebook: "",
  }).length;

  const NoAccountsConnected = () => (
    <Center flex="1">
      <HStack
        maxWidth="400px"
        spacing={4}
        p={4}
        rounded="md"
        border="4px"
        borderColor="gray.400"
        my={8}
      >
        <WarningTwoIcon h={6} w={6} color="orange" />
        <Text>
          Connect atleast one of your facebook, instagram or twitter account to
          view the collective feed.
        </Text>
      </HStack>
    </Center>
  );

  const Feed = () => {
    return (
      <Flex flex="1" flexDir="column" pos="relative">
        <Flex
          pos="absolute"
          w="full"
          justify="space-between"
          align="center"
          bg="white"
          boxShadow="md"
          top={0}
          zIndex={100}
          px={4}
          py={4}
        >
          <Heading size="sm">View feeds from</Heading>
          <Select maxW={{ base: "150px", lg: "300px" }} defaultValue="facebook">
            <option value="facebook" style={{ textAlign: "center" }}>
              Facebook
            </option>
            <option value="instagram" style={{ textAlign: "center" }}>
              Instagram
            </option>
            <option value="twitter" style={{ textAlign: "center" }}>
              Twitter
            </option>
          </Select>
        </Flex>

        <Box w="full" h="full">
          <ScrollContent>
            <Flex
              flex="1"
              marginTop="72px"
              flexDir="column"
              px="4"
              py="8"
              bg="white"
            >
              Feed here...
            </Flex>
          </ScrollContent>
        </Box>
      </Flex>
    );
  };

  return connectedAccounts > 0 ? <Feed /> : <NoAccountsConnected />;
}

function AdminPage() {
  const { user, logout } = useUser();
  const { dashboard, isLoading } = useDashboard();
  const profileURL = useURL(user.profile.username);
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
          <Link to="/">
            <Image src="icon.png" alt="app logo" h={10} w={10} />
          </Link>

          <Stack spacing="4" display="flex" align="center">
            <Menu>
              <MenuButton>
                {/* <UserIcon h={12} w={12} fill="green.400" cursor="pointer" /> */}
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

          {/* Links, Appearance, Settings */}
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
                <Tab px={{ base: "2", lg: "4" }} py="4">
                  Appearance
                </Tab>
                <Tab px={{ base: "2", lg: "4" }} py="4">
                  Settings
                </Tab>
                <Tab px={{ base: "2", lg: "4" }} py="4">
                  Analytics
                </Tab>
                <Tab px={{ base: "2", lg: "4" }} py="4">
                  Feed
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <LinksSection />
                </TabPanel>
                <TabPanel p={0}>
                  <AppearanceSection />
                </TabPanel>
                <TabPanel p={0}>
                  <SettingsSection />
                </TabPanel>
                <TabPanel p={0}>
                  <AnalyticsSection />
                </TabPanel>
                <TabPanel p={0}>
                  <FeedSection />
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
                <LinkBox as="u">
                  <Link to={user.profile.username} target="_blank">
                    <LinkOverlay width="max-content">{profileURL}</LinkOverlay>
                  </Link>
                </LinkBox>
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

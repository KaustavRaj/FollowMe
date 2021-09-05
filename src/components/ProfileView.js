import React, { useCallback } from "react";
import {
  Box,
  Wrap,
  WrapItem,
  Container,
  Avatar,
  Flex,
  Center,
  Stack,
  Text,
  Icon,
  Heading,
  Link,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { SocialIcon } from "react-social-icons";

import { combineThemeWithCustomizations } from "../utils/helpers";
const socialLinks = require("../data/socialLinks.json");

function rearrangeCustomLinks(linksFromProfile) {
  if (linksFromProfile) {
    let list = Object.entries(linksFromProfile)
      .map(([linkId, value]) => {
        if (value.show)
          return {
            ...value,
            id: linkId,
          };

        return null;
      })
      .filter((value) => value !== null);

    list.sort((link1, link2) => link1.position - link2.position);

    return list;
  }
  return [];
}

function ProfileView({ data, isPreview, scaleFactor = 1, previewHeight }) {
  const profileTheme = combineThemeWithCustomizations(data);

  const scale = (value, roundOff = true, nTimes = 1) => {
    let result = value * Math.pow(scaleFactor, nTimes);
    return roundOff ? Math.round(result) : result;
  };

  const LinkButton = ({ title, url, position }) => {
    let {
      link: {
        backgroundColor,
        textColor,
        roundCorners,
        borderColor,
        onHover,
        shadow,
      },
    } = profileTheme;

    return (
      <a href={url} key={`${url}-${position}`}>
        <Box
          as="button"
          p={scale(3.5)}
          w="100%"
          border={`${scale(2)}px`}
          textAlign="center"
          fontWeight="semibold"
          bg={backgroundColor}
          color={textColor}
          rounded={roundCorners}
          borderColor={borderColor}
          _hover={{
            backgroundColor: onHover.backgroundColor,
            color: onHover.textColor,
          }}
          style={
            shadow
              ? {
                  boxShadow: `${shadow.shadowPos} rgba(0, 0, 0, 0.36)`,
                }
              : null
          }
        >
          {title}
        </Box>
      </a>
    );
  };

  const SocialLinks = () => {
    const getSocialLink = useCallback((linkType, value) => {
      let displayLink = socialLinks.find((obj) => obj.type === linkType);
      return displayLink.prepend + value;
    }, []);

    return data.links &&
      typeof data.links === "object" &&
      Object.keys(data.links).length > 0 ? (
      <Container maxW="2xl">
        <Stack mt={scale(2)} spacing={scale(8)}>
          <Stack spacing={scale(4)}>
            {rearrangeCustomLinks(data.links.custom).map((eachCustomLink) => (
              <LinkButton {...eachCustomLink} />
            ))}
          </Stack>

          <Center>
            <Wrap spacing={isPreview ? 2 : { base: 4, md: 6, lg: 8 }}>
              {typeof data.links.social === "object" &&
                Object.entries(data.links.social).map(([linkType, value]) => (
                  <Link href={getSocialLink(linkType, value)} isExternal>
                    <WrapItem key={linkType}>
                      <SocialIcon
                        network={linkType}
                        bgColor="transparent"
                        fgColor={profileTheme.background.textColor}
                        style={{ height: scale(44), width: scale(44) }}
                      />
                    </WrapItem>
                  </Link>
                ))}
            </Wrap>
          </Center>
        </Stack>
      </Container>
    ) : null;
  };

  return (
    <Container
      centerContent
      flex="1"
      minW="full"
      px={scale(0)}
      py={scale(4)}
      bgImage={
        profileTheme.background.coverType === "gradient"
          ? profileTheme.background.gradient
          : `url('${profileTheme.background.image}')`
      }
      color={profileTheme.background.textColor}
      style={{
        minHeight: isPreview ? previewHeight : "100vh",
      }}
      fontSize={scale(16, true, isPreview ? 1.5 : 1)}
    >
      <Flex direction="column" align="center" mt={scale(4)} mb={scale(5)}>
        <Avatar
          bg="green.500"
          src={data.avatar}
          size={isPreview ? "lg" : "xl"}
          mb={scale(4)}
          rounded="full"
          objectFit="contain"
        />
        <Heading
          size={isPreview ? "xs" : "md"}
          ml={scale(3)}
          mr={scale(3)}
          mb={scale(4)}
          fontWeight="bold"
          isTruncated
        >
          {data.displayName}
        </Heading>
        {data.bio ? (
          <Text maxW="500px" py={scale(2)} px={scale(8)} mb={scale(4)}>
            {JSON.parse(data.bio)}
          </Text>
        ) : null}
      </Flex>

      <SocialLinks />
    </Container>
  );
}

ProfileView.propTypes = {
  data: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
  scaleFactor: PropTypes.number,
  previewHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ProfileView;

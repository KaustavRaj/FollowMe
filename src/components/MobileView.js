import React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import ProfileView from "./ProfileView";

function MobileView({ data, isLoading }) {
  const ASPECT_RATIO = 360 / 640;
  const MOBILE_HEIGHT = 500;

  return (
    <Box
      w={ASPECT_RATIO * MOBILE_HEIGHT}
      h={MOBILE_HEIGHT}
      border="8px"
      borderRadius="40"
      borderColor="black"
      overflow="hidden"
      pos="relative"
    >
      <SimpleBar
        style={{
          maxHeight: MOBILE_HEIGHT,
          height: "100%",
        }}
      >
        <ProfileView
          data={data}
          previewHeight={MOBILE_HEIGHT - 16}
          isPreview
          scaleFactor={0.8}
        />
      </SimpleBar>

      {isLoading ? (
        <Box pos="absolute" top={0} right={0} p={4}>
          <Spinner />
        </Box>
      ) : null}
    </Box>
  );
}

export default MobileView;

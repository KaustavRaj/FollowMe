import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const [initialRender, setInitialRender] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    }

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (initialRender) {
      handleResize();
      setInitialRender(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

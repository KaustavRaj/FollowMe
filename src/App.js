import "./styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

import { UserProvider } from "./contexts/User";
import BaseRouter from "./components/Routes";
import theme from "./utils/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <BaseRouter />
      </UserProvider>
    </ChakraProvider>
  );
}
export default App;

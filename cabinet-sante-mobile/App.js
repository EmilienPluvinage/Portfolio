import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import { PatientsProvider } from "./contexts/PatientsContext";
import { ConfigurationProvider } from "./contexts/ConfigContext";
import Drawer from "./Drawer";

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#1098AD",
    },
  };
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <PaperProvider theme={theme}>
        <ConfigurationProvider>
          <PatientsProvider>
            <AuthProvider>
              <Drawer />
            </AuthProvider>
          </PatientsProvider>
        </ConfigurationProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewPatient from "./NewPatient";
import Main from "./Main";
import Header from "./Header";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Drawer.Navigator initialRouteName="Main">
          <Drawer.Screen name="NewPatient" component={NewPatient} />
          <Drawer.Screen name="Main" component={Main} />
        </Drawer.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

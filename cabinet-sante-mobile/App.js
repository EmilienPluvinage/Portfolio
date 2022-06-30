import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewPatient from "./NewPatient";
import Main from "./Main";
import { StatusBar, StyleSheet } from "react-native";
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <PaperProvider>
        <Drawer.Navigator
          initialRouteName="Main"
          screenOptions={{
            drawerInactiveBackgroundColor: "rgb(60,60,60)",
            drawerInactiveTintColor: "#ffffff",
            drawerActiveTintColor: "#ffffff",
            drawerActiveBackgroundColor: "#22b8cf",
            drawerStyle: { backgroundColor: "rgb(30,30,30)" },
            sceneContainerStyle: styles.container,
          }}
        >
          <Drawer.Screen name="NewPatient" component={NewPatient} />
          <Drawer.Screen name="Main" component={Main} />
        </Drawer.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(30,30,30)",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 5,
  },
});

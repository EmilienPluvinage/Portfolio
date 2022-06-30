import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewPatient from "./NewPatient";
import Main from "./Main";
import { StatusBar, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
            drawerActiveBackgroundColor: "#1098AD",
            drawerStyle: { backgroundColor: "rgb(30,30,30)" },
            sceneContainerStyle: styles.container,
            headerTintColor: "#1098AD",
            headerStyle: {
              backgroundColor: "rgb(30,30,30)",
              shadowColor: "transparent",
            },
          }}
        >
          <Drawer.Screen
            name="Main"
            component={Main}
            options={{
              drawerLabel: "Agenda",
              headerTitle: "Mon Cabinet Santé",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="NewPatient"
            component={NewPatient}
            options={{
              drawerLabel: "Nouveau Patient",
              headerTitle: "Nouveau Patient",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-add-outline" color={color} size={size} />
              ),
            }}
          />
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

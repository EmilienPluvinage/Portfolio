import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import NewPatient from "./NewPatient";
import NewAppointment from "./NewAppointment";
import Main from "./Main";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Login from "./Login";

import { useLogin, useLogging } from "./contexts/AuthContext";

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        inactiveTintColor="#ffffff"
        label="Déconnexion"
        onPress={() => props.setLogin(false)}
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" color={color} size={size} />
        )}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const loggedIn = useLogin().login;
  const logging = useLogging();

  return (
    <>
      {loggedIn ? (
        <Drawer.Navigator
          drawerContent={(props) => (
            <CustomDrawerContent {...props} setLogin={logging} />
          )}
          initialRouteName="Main"
          screenOptions={{
            drawerInactiveBackgroundColor: "rgb(30,30,30)",
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
              headerTitle: "Patient",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-add-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="NewAppointment"
            component={NewAppointment}
            options={{
              drawerLabel: "Consultation",
              headerTitle: "Consultation",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation, route }) => ({
              drawerItemPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Redirect
                navigation.navigate("NewAppointment", { appointmentId: 0 });
              },
            })}
          />
        </Drawer.Navigator>
      ) : (
        <Login />
      )}
    </>
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

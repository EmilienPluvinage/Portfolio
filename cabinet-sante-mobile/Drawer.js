import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import NewPatient from "./NewPatient";
import NewAppointment from "./NewAppointment";
import Main from "./Main";
import Reminders from "./Reminders";
import Balance from "./Balance";
import NewPayement from "./NewPayement";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Login from "./Login";
import { Badge } from "react-native-paper";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { BalanceByPatient } from "./Functions/Functions";
import { useState } from "react";

function CustomDrawerContent(props) {
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;
  const [label, setLabel] = useState("Mettre à jour");

  async function refresh() {
    try {
      setLabel("Mettre à jour (en cours)");
      await updateContext(token);
      setLabel("Mettre à jour");
    } catch (e) {
      return e;
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 15 }}>
        <Text style={{ color: "#1098AD", marginLeft: 58 }}>
          Mon Cabinet Santé
        </Text>
      </View>

      <DrawerItemList {...props} />
      <DrawerItem
        inactiveTintColor="#ffffff"
        label={label}
        onPress={() => refresh()}
        icon={({ color, size }) => (
          <Ionicons name="refresh-outline" color={color} size={size} />
        )}
      />
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
  // data from context
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const reminders = usePatients().reminders;
  const patients = usePatients().patients;
  const payements = usePatients().payements;
  const appointments = usePatients().appointments;
  const sharedBalance = usePatients().sharedBalance;

  let count = 0;
  for (const patient of patients) {
    if (
      BalanceByPatient(patient?.id, appointments, sharedBalance, payements) < 0
    ) {
      count++;
    }
  }
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
                // Redirect with appointmentId=0 which means it's a new appointment
                navigation.navigate("NewAppointment", { appointmentId: 0 });
              },
            })}
          />
          <Drawer.Screen
            name="NewPayement"
            component={NewPayement}
            options={{
              drawerLabel: "Paiement",
              headerTitle: "Paiement",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="logo-euro" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Reminders"
            component={Reminders}
            options={{
              drawerLabel: ({ focused }) => (
                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.drawerLabelText}>Rappels</Text>
                  <Badge
                    style={{
                      backgroundColor: !focused ? "#1098AD" : "rgb(30,30,30)",
                    }}
                  >
                    {reminders.length}
                  </Badge>
                </View>
              ),
              headerTitle: "Rappels",
              drawerIcon: ({ color, size }) => (
                <Ionicons
                  name="alert-circle-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Balance"
            component={Balance}
            options={{
              drawerLabel: ({ focused }) => (
                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.drawerLabelText}>Renouveler</Text>
                  <Badge
                    style={{
                      backgroundColor: !focused ? "#1098AD" : "rgb(30,30,30)",
                    }}
                  >
                    {count}
                  </Badge>
                </View>
              ),
              headerTitle: "Solde",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="card-outline" color={color} size={size} />
              ),
            }}
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
  drawerLabelText: {
    color: "white",
    fontWeight: "500",
    marginRight: 10,
  },
});

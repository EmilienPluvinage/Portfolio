import { StyleSheet, View } from "react-native";
import { Card, Avatar, Paragraph, IconButton, Menu } from "react-native-paper";
import { useConfig } from "./contexts/ConfigContext";
import { useState } from "react";
import Confirmation from "./Confirmation";
import { REACT_APP_API_DOMAIN } from "@env";
import { deleteAppointment } from "./Functions/Functions";
import { useLogin } from "./contexts/AuthContext";
import { useUpdatePatients } from "./contexts/PatientsContext";
import Duplicate from "./Duplicate";

function DropdownMenu({
  appointmentId,
  navigation,
  setSnackbarMsg,
  setShowSnackbar,
}) {
  const [duplicate, setDuplicate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [callback, setCallback] = useState();
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;

  function updateAppointment(id) {
    setVisible(false);
    navigation.navigate("NewAppointment", { appointmentId: appointmentId });
  }

  async function clickOnDeleteAppointment(id) {
    setVisible(false);
    setCallback(() => () => removeAppointment(id));
    setConfirmation(true);
  }

  async function removeAppointment(id) {
    try {
      const result = await deleteAppointment(id, token, REACT_APP_API_DOMAIN);

      if (result) {
        await updateContext(token);
        setSnackbarMsg("Le rendez-vous a bien été supprimé.");
        setShowSnackbar(true);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
      <Duplicate
        appointmentId={appointmentId}
        open={duplicate}
        setOpen={setDuplicate}
      />
      <Confirmation
        open={confirmation}
        setOpen={setConfirmation}
        callback={callback}
      />
      <View style={styles.dropdownMenu}>
        <Menu
          visible={visible}
          contentStyle={{ backgroundColor: "rgb(60,60,60)" }}
          onDismiss={() => setVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              color="#ffffff"
              onPress={() => setVisible(true)}
            />
          }
        >
          <Menu.Item
            titleStyle={{ color: "white" }}
            title="Modifier"
            onPress={() => {
              updateAppointment(appointmentId);
            }}
          />
          <Menu.Item
            titleStyle={{ color: "white" }}
            title="Dupliquer"
            onPress={() => {
              setVisible(false);
              setDuplicate(true);
            }}
          />

          <Menu.Item
            titleStyle={{ color: "white" }}
            onPress={() => clickOnDeleteAppointment(appointmentId)}
            title="Supprimer"
          />
        </Menu>
      </View>
    </>
  );
}

export default function Event({
  appointmentId,
  start,
  end,
  title,
  appointmentTypeId,
  patients,
  navigation,
  setSnackbarMsg,
  setShowSnackbar,
}) {
  const appointmentTypes = useConfig().appointmentTypes;
  const appointmentType = appointmentTypes.find(
    (type) => type.id === appointmentTypeId
  )?.type;
  const color = appointmentTypes.find(
    (type) => type.id === appointmentTypeId
  )?.color;
  function capitalLetter(string) {
    switch (string) {
      case "Cours Duo":
        return "D";
      case "Cours Tapis":
        return "T";
      case "Cours Machine":
        return "M";
      case "Cours Privé":
        return "P";
      default:
        return string[0];
    }
  }
  return (
    <Card style={styles.items}>
      <Card.Title
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardTitle}
        title={`${start} - ${end}`}
        subtitle={title}
        left={(props) => (
          <Avatar.Text
            {...props}
            size={50}
            label={capitalLetter(appointmentType)}
            style={{ backgroundColor: color }}
            color="white"
          />
        )}
        right={(props) => (
          <DropdownMenu
            appointmentId={appointmentId}
            navigation={navigation}
            setSnackbarMsg={setSnackbarMsg}
            setShowSnackbar={setShowSnackbar}
          />
        )}
      />
      <Card.Content style={styles.cardContent}>
        <Paragraph style={styles.paragrah}>{patients}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    alignItems: "flex-start",
  },
  cardTitle: {
    marginLeft: 10,
    color: "#ffffff",
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
  },
  paragrah: {
    color: "#ffffff",
  },
  dropdownMenu: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "center",
  },
});

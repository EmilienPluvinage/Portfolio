import { StyleSheet, View } from "react-native";
import { Card, Avatar, Paragraph, IconButton, Menu } from "react-native-paper";
import { useConfig } from "./contexts/ConfigContext";
import { useState } from "react";
import Confirmation from "./Confirmation";
import { REACT_APP_API_DOMAIN } from "@env";
import { deleteAppointment } from "./Functions/Functions";
import { useLogin } from "./contexts/AuthContext";
import { useUpdatePatients } from "./contexts/PatientsContext";

function DropdownMenu({ appointmentId, navigation }) {
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
    try {
      const result = await deleteAppointment(id, token, REACT_APP_API_DOMAIN);
      setVisible(false);
      if (result) {
        setConfirmation(true);
        await updateContext(token);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
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
            onPress={() => updateAppointment(appointmentId)}
            title="Modifier"
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
          <DropdownMenu appointmentId={appointmentId} navigation={navigation} />
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

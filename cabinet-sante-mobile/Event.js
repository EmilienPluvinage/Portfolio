import { StyleSheet, View } from "react-native";
import { Card, Avatar, Paragraph, IconButton, Menu } from "react-native-paper";
import { useConfig } from "./contexts/ConfigContext";
import { useState } from "react";

function DropdownMenu({ appointmentId }) {
  const [visible, setVisible] = useState(false);
  return (
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
          onPress={() => console.log("Modifier %i", appointmentId)}
          title="Modifier"
        />
        <Menu.Item
          titleStyle={{ color: "white" }}
          onPress={() => console.log("Supprimer %i", appointmentId)}
          title="Supprimer"
        />
      </Menu>
    </View>
  );
}

export default function Event({
  appointmentId,
  start,
  end,
  title,
  appointmentTypeId,
  patients,
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
        right={(props) => <DropdownMenu appointmentId={appointmentId} />}
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

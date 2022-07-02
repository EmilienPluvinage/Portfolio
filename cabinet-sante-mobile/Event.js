import { StyleSheet } from "react-native";
import { Card, Avatar, Paragraph, IconButton } from "react-native-paper";
import { useConfig } from "./contexts/ConfigContext";

export default function Event({
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
        right={(props) => (
          <IconButton
            {...props}
            icon="dots-vertical"
            color="#ffffff"
            onPress={() => console.log("Open Event Details")}
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
});

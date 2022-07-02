import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Avatar,
  Paragraph,
  IconButton,
  Switch,
} from "react-native-paper";

export default function Patient({ patientId, fullname, removePatient }) {
  const [present, setPresent] = useState(true);
  const [payed, setPayed] = useState(false);

  return (
    <Card style={styles.items}>
      <Card.Title
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardTitle}
        title={fullname}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.switchView}>
          <Switch
            value={present}
            onValueChange={setPresent}
            color={styles.switchColor.color}
          />
          <Paragraph style={styles.paragrah}>Présent</Paragraph>
        </View>
        <View style={styles.switchView}>
          <Switch
            value={payed}
            onValueChange={setPayed}
            color={styles.switchColor.color}
          />
          <Paragraph style={styles.paragrah}>Payé</Paragraph>
        </View>
        <IconButton
          icon="delete"
          color="#ffffff"
          onPress={() => removePatient(patientId)}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
  },
  paragrah: {
    color: "#ffffff",
    marginLeft: 10,
  },
  switchView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  switchColor: {
    color: "#1098AD",
  },
});

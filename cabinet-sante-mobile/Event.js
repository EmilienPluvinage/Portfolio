import { StyleSheet } from "react-native";
import { Card, Avatar, Paragraph } from "react-native-paper";

export default function Event() {
  return (
    <Card style={styles.items}>
      <Card.Title
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardTitle}
        title="9:00 - 10:00"
        subtitle="Respirez profondément"
        left={(props) => <Avatar.Text {...props} size={50} label="T" />}
      />
      <Card.Content style={styles.cardContent}>
        <Paragraph style={styles.paragrah}>
          Emilien Pluvinage, Florence Jacquet, Jean Pluvinage.
        </Paragraph>
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

import { StyleSheet } from "react-native";
import { Card, Avatar, Paragraph, IconButton } from "react-native-paper";

export default function Event({
  start,
  end,
  title,
  appointmentTypeId,
  patients,
}) {
  return (
    <Card style={styles.items}>
      <Card.Title
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardTitle}
        title={`${start} - ${end}`}
        subtitle={title}
        left={(props) => <Avatar.Text {...props} size={50} label="T" />}
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

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  Card,
  IconButton,
  Searchbar,
  Divider,
} from "react-native-paper";

export default function Confirmation({ open, setOpen, callback }) {
  const [loading, setLoading] = useState(false);

  async function click() {
    // setLoading(true);
    await callback();
    // setLoading(false);
    setOpen(false);
  }
  return (
    <>
      <Portal>
        <Modal visible={open} onDismiss={() => setOpen(false)}>
          <Card style={styles.items}>
            <Card.Title
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardTitle}
              title={`Êtes-vous sûr(e)?`}
            />
            <Card.Content>
              <View style={styles.cardContent}>
                <Button
                  mode="outlined"
                  style={{ borderColor: "gray" }}
                  onPress={() => setOpen(false)}
                >
                  Non
                </Button>
                <Button mode="contained" onPress={click} loading={loading}>
                  Oui
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardTitle: {
    color: "lightgray",
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    margin: 20,
  },
});

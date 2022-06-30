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
} from "react-native-paper";

export default function PatientSearch({ addPatient }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Button
        color="#1098AD"
        mode="outlined"
        onPress={() => setOpen(true)}
        contentStyle={{
          backgroundColor: "#E3FAFC",
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#1098AD",
        }}
      >
        ajouter un patient
      </Button>

      <Portal>
        <Modal visible={open} onDismiss={() => setOpen(false)}>
          <Card style={styles.items}>
            <Card.Title
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardTitle}
              title={`Ajouter un patient`}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close-circle-outline"
                  color="lightgray"
                  onPress={() => setOpen(false)}
                />
              )}
            />
            <Card.Content style={styles.cardContent}>
              <Searchbar
                placeholder="Rechercher"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    justifyContent: "center",
    flexDirection: "row",
  },
  cardTitle: {
    color: "lightgray",
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    margin: 20,
  },
  searchBar: {
    flex: 1,
  },
});

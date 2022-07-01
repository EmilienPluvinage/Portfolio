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

export default function PatientSearch({ patientsList, addPatient }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (searchQuery !== "") {
    // we filter the data based on the search query
    patientsList = patientsList.filter((patient) =>
      patient.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function compare(a, b) {
    if (a.fullname < b.fullname) {
      return -1;
    }
    if (a.fullname > b.fullname) {
      return 1;
    }
    return 0;
  }

  patientsList.sort(compare);
  patientsList = patientsList.slice(0, 5);

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
                  icon="close"
                  color="lightgray"
                  onPress={() => setOpen(false)}
                />
              )}
            />
            <Card.Content style={styles.cardContent}>
              <View style={styles.searchView}>
                <Searchbar
                  placeholder="Rechercher"
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={styles.searchBar}
                />
              </View>
              <View>
                {patientsList.map((patient, index) => (
                  <View key={"Search" + index}>
                    <View style={styles.patientText}>
                      <Text style={styles.text}>{patient.fullname}</Text>
                      <IconButton
                        icon="plus-circle"
                        color="lightgray"
                        size={26}
                        onPress={() => addPatient(patient)}
                      />
                    </View>
                    {index !== patientsList.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  searchView: {
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
  text: {
    color: "white",
    marginVertical: 15,
    fontSize: 16,
  },
  divider: {
    backgroundColor: "lightgray",
  },
  patientText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

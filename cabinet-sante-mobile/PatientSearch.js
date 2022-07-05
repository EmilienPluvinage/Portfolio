import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  Card,
  IconButton,
  Searchbar,
  Divider,
  TextInput,
} from "react-native-paper";
import { usePatients } from "./contexts/PatientsContext";

export default function PatientSearch({
  patientsList,
  addPatient,
  multi,
  patientId,
}) {
  const patients = usePatients().patients;
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
      {multi ? (
        <Button color="#1098AD" mode="contained" onPress={() => setOpen(true)}>
          Ajouter un patient
        </Button>
      ) : (
        <Pressable onPress={() => setOpen(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.formItem}
              label="Choisir un patient"
              value={patients.find((e) => e.id === patientId)?.fullname}
              type="outlined"
            />
          </View>
        </Pressable>
      )}

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
                        onPress={() => {
                          addPatient(patient);
                          setSearchQuery("");
                          if (!multi) {
                            setOpen(false);
                          }
                        }}
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
  formItem: {
    marginVertical: 10,
  },
});

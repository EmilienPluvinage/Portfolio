import { ScrollView, View, StyleSheet, Text } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Card,
  IconButton,
  DataTable,
} from "react-native-paper";
import { usePatients } from "./contexts/PatientsContext";
import { useState, useEffect } from "react";
import { BalanceByPatient } from "./Functions/Functions";

export default function BalanceDetails({ patientId }) {
  // data from context
  const patients = usePatients().patients;
  const payements = usePatients().payements;
  const appointments = usePatients().appointments;
  const sharedBalance = usePatients().sharedBalance;

  // state
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <Portal>
          <Modal visible={open} onDismiss={() => setOpen(false)}>
            <Card style={styles.items}>
              <Card.Title
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardTitle}
                title={`Détails`}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="close"
                    color="lightgray"
                    onPress={() => setOpen(false)}
                  />
                )}
              />
              <Card.Content>
                <DataTable>
                  <DataTable.Header style={{ borderBottomColor: "lightgray" }}>
                    <DataTable.Title textStyle={styles.dataTableText}>
                      Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={styles.dataTableText}>
                      Variation
                    </DataTable.Title>
                    <DataTable.Title textStyle={styles.dataTableText}>
                      Solde
                    </DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      10/06
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      - 15 €
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      400 €
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      10/06
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      - 15 €
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      400 €
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      10/06
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      - 15 €
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataTableText}>
                      400 €
                    </DataTable.Cell>
                  </DataTable.Row>
                  {
                    // Add my own paginiation
                    // or a scroll view but with smart display becauseit can be massive...
                  }
                </DataTable>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      )}
      <Button onPress={() => setOpen(true)}>Open</Button>
    </>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: "lightgray",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    margin: 20,
  },
  dataTableText: {
    color: "white",
  },
});

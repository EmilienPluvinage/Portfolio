import { ScrollView, View, StyleSheet, Text, SafeAreaView } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Card,
  IconButton,
  DataTable,
} from "react-native-paper";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { useState, useEffect } from "react";
import {
  calculateBalance,
  displayDate,
  displayPrice,
  getUniqueSharedPatients,
  insertPackageIntoArray,
  BalanceByPatient,
} from "./Functions/Functions";
import { Ionicons } from "@expo/vector-icons";

export default function BalanceDetails({ patientId }) {
  // data from context
  const sharedBalance = usePatients().sharedBalance;
  const sharedPatients = getUniqueSharedPatients(sharedBalance, patientId);
  const payements = usePatients().payements.filter(
    (e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1
  );
  let notMissedAppointments = usePatients().appointments;
  let missedAppointments = usePatients().missedAppointments;
  for (const element of notMissedAppointments) {
    element.missed = false;
  }
  for (const element of missedAppointments) {
    element.missed = true;
  }
  const balance = BalanceByPatient(
    patientId,
    notMissedAppointments,
    sharedBalance,
    payements
  );

  let appointments = notMissedAppointments
    .concat(missedAppointments)
    .filter((e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1);

  function compareDate(a, b) {
    let x = new Date(a.start);
    let y = new Date(b.start);

    if (x < y) {
      return 1;
    }
    if (x > y) {
      return -1;
    }
    return 0;
  }

  appointments.sort((a, b) => compareDate(a, b));

  // navigation
  const [open, setOpen] = useState(false);
  const rowsPerPage = 8;
  const [activePage, setPage] = useState(1);

  // used to exclude future appointments into balance calculation
  const today = new Date();

  const packagesData = payements
    .filter((e) => e.eventId === 0)
    .map((obj) => ({
      ...obj,
      dataType: "package",
    }));

  var data = appointments.map((obj) => ({ ...obj, dataType: "event" }));

  packagesData.forEach((e) => insertPackageIntoArray(data, e));

  calculateBalance(data, payements);

  const numberOfPages =
    data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;

  const displayedData = data.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );

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

                  {displayedData.map(
                    (row) =>
                      (row.dataType === "package" || row.payed === 0) && (
                        <DataTable.Row key={row.id}>
                          <DataTable.Cell textStyle={styles.dataTableText}>
                            {displayDate(
                              new Date(
                                row.dataType === "event" ? row.start : row.date
                              )
                            )}
                          </DataTable.Cell>
                          <DataTable.Cell textStyle={styles.dataTableText}>
                            -{" "}
                            {displayPrice(
                              row.dataType === "event" ? row.price : row.amount
                            )}{" "}
                            €
                          </DataTable.Cell>
                          <DataTable.Cell textStyle={styles.dataTableText}>
                            {displayPrice(row.balance)} €
                          </DataTable.Cell>
                        </DataTable.Row>
                      )
                  )}

                  {
                    // Add my own paginiation
                    // or a scroll view but with smart display becauseit can be massive...
                  }
                </DataTable>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Button
                    mode="contained"
                    color="gray"
                    compact={true}
                    onPress={() =>
                      setPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  >
                    <Ionicons
                      name="arrow-back-outline"
                      color={"white"}
                      size={18}
                    />
                  </Button>
                  <Button
                    mode="contained"
                    color="gray"
                    compact={true}
                    style={{ marginHorizontal: 5 }}
                  >
                    <Text style={{ color: "white" }}>{activePage}</Text>
                  </Button>
                  <Button
                    mode="contained"
                    color="gray"
                    compact={true}
                    onPress={() =>
                      setPage((prev) =>
                        prev < numberOfPages ? prev + 1 : prev
                      )
                    }
                  >
                    <Ionicons
                      name="arrow-forward-outline"
                      color={"white"}
                      size={18}
                    />
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      )}

      <Button
        color={balance < 0 ? "#FA5252" : "white"}
        onPress={() => setOpen(true)}
        compact={true}
      >
        {displayPrice(balance)} €
      </Button>
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

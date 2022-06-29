import { StyleSheet, View, ScrollView } from "react-native";

import NewPatient from "./NewPatient";

export default function Main() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <NewPatient />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(30,30,30)",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 5,
  },
});

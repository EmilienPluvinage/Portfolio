import { StyleSheet, View, ScrollView } from "react-native";
import Event from "./Event";

export default function Main() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Event />
        <Event />
        <Event />
        <Event />
        <Event />
        <Event />
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

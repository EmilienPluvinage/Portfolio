import { StyleSheet, Text, View } from "react-native";

export default function Main() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ceci est la future App Cabinet Santé.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(30,30,30)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
});

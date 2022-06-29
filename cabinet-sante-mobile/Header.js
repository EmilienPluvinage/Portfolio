import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { IconButton } from "react-native-paper";

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <IconButton
          icon="menu"
          color="#22b8cf"
          onPress={() => console.log("Pressed")}
        />
      </View>
      <View>
        <Text style={styles.title}>MON CABINET SANTÉ</Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgb(40, 40, 40)",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 20,
  },
  title: {
    color: "#22b8cf",
    padding: 10,
    paddingRight: 20,
    fontSize: 18,
  },
});

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import MyMenu from "./MyMenu";

export default function Header() {
  return (
    <>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <MyMenu />
        </View>
        <View>
          <Text style={styles.title}>MON CABINET SANTÉ</Text>
        </View>
      </View>
    </>
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
    paddingTop: 13,
    color: "#22b8cf",
    padding: 10,
    paddingRight: 20,
    fontSize: 22,
  },
});

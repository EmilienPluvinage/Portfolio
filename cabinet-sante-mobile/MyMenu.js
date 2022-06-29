import { StyleSheet } from "react-native";
import { Menu, IconButton } from "react-native-paper";
import { useState } from "react";

function MenuItem({ page, setPage }) {
  return (
    <Menu.Item
      titleStyle={styles.menuItems}
      onPress={() => setPage(page)}
      title={page}
    />
  );
}

export default function MyMenu() {
  const [open, setOpen] = useState(false);

  function setPage(page) {
    console.log(page);
    setOpen(false);
  }

  return (
    <Menu
      contentStyle={styles.menu}
      style={styles.menu}
      visible={open}
      onDismiss={() => setOpen(false)}
      anchor={
        <IconButton
          icon="menu"
          size={30}
          color="#22b8cf"
          onPress={() => setOpen(true)}
        />
      }
    >
      <MenuItem page="Agenda" setPage={setPage} />
      <MenuItem page="Consultation" setPage={setPage} />
      <MenuItem page="Patient" setPage={setPage} />
      <MenuItem page="Paiement" setPage={setPage} />
    </Menu>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "rgb(50, 50, 50)",
    borderRadius: 6,
  },
  menuItems: {
    color: "#ffffff",
  },
});

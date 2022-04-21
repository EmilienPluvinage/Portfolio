import { Button, Modal, Grid, Text } from "@mantine/core";

export default function CheckForIncorrectPrices({ open, setOpen }) {
  // This component is going to check whether there are any prices that are 0 AND setByUser = false to warn the user.

  function handleClick() {
    console.log("to the prices check");
  }
  return (
    open && (
      <Modal
        centered
        overlayOpacity={0.3}
        opened={open}
        onClose={() => setOpen(false)}
        title={`Attention, certains prix à sont vérifier`}
        closeOnClickOutside={false}
      >
        <Text>
          Certains prix semblent incorrects. Souhaitez-vous les vérifier
          maintenant?
        </Text>
        <Grid
          justify="space-between"
          style={{ marginTop: "10px", marginRight: "50px" }}
        >
          <Grid.Col span={2}>
            <Button variant="default" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button onClick={handleClick}>Vérifier</Button>
          </Grid.Col>
        </Grid>
      </Modal>
    )
  );
}

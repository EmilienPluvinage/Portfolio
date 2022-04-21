import { Button, Modal, Grid, Text } from "@mantine/core";

export default function Confirmation({ text, title, callback, open, close }) {
  function handleClick() {
    callback();
    close();
  }

  return (
    open && (
      <Modal
        centered
        overlayOpacity={0.3}
        opened={open}
        onClose={close}
        title={title}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <Text>{text}</Text>
        <Grid
          justify="space-between"
          style={{ marginTop: "10px", marginRight: "50px" }}
        >
          <Grid.Col span={2}>
            <Button variant="default" onClick={close}>
              Retour
            </Button>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button onClick={handleClick}>Continuer</Button>
          </Grid.Col>
        </Grid>
      </Modal>
    )
  );
}

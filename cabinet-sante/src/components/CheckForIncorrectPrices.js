import { Button, Modal, Grid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import "../styles/styles.css";

export default function CheckForIncorrectPrices({ open, setOpen }) {
  // This component is going to check whether there are any prices that are 0 AND setByUser = false to warn the user.

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
            <Link to="/Verifier-les-prix" className="text-link">
              <Button onClick={() => setOpen(false)}>Vérifier</Button>
            </Link>
          </Grid.Col>
        </Grid>
      </Modal>
    )
  );
}

import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import { useConfig, useUpdateConfig } from "../contexts/ConfigContext";
import {
  Button,
  Center,
  Modal,
  NumberInput,
  Select,
  Table,
} from "@mantine/core";
import { displayPrice } from "../Functions";
import { Check, Pencil, Plus, Trash, X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import Confirmation from "../Confirmation";

export default function PriceScheme() {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig().initData;
  const config = useConfig();
  const [opened, setOpened] = useState(false);
  const [id, setId] = useState(0);
  const [price, setPrice] = useState(0);
  const [pack, setPack] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [patientType, setPatientType] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  const Packageslist =
    config.packages?.length > 0
      ? config.packages.map((e) => {
          return { id: e.id, package: e.package };
        })
      : [];

  const ATList =
    config.appointmentTypes?.length > 0
      ? config.appointmentTypes.map((e) => {
          return { id: e.id, type: e.type };
        })
      : [];

  const PTList =
    config.patientTypes?.length > 0
      ? config.patientTypes.map((e) => {
          return { id: e.id, type: e.type };
        })
      : [];

  const ths = (
    <tr>
      <th>Forfait</th>
      <th>Consultation</th>
      <th>Type de Patient</th>
      <th>Prix</th>
      <th>Modifier</th>
      <th>Supprimer</th>
    </tr>
  );

  const rows = config.priceScheme.map((element) => (
    <tr key={element.id}>
      <td>
        {config.packages.find((e) => e.id === element.packageId)?.package}
      </td>
      <td>
        {
          config.appointmentTypes.find(
            (e) => e.id === element.appointmentTypeId
          )?.type
        }
      </td>

      <td>
        {config.patientTypes.find((e) => e.id === element.patientTypeId)?.type}
      </td>

      <td>{displayPrice(element.price)} €</td>

      <td>
        <Button
          onClick={() => updatePriceScheme(element.id)}
          leftIcon={<Pencil size={18} />}
          compact
          variant="outline"
        >
          Modifier
        </Button>
      </td>
      <td>
        <Button
          onClick={() => handleDeleteClick(element.id)}
          leftIcon={<Trash size={18} />}
          compact
          color="red"
          variant="outline"
        >
          Supprimer
        </Button>
      </td>
    </tr>
  ));

  function updatePriceScheme(id) {
    setId(id);
    var priceScheme = config.priceScheme.find((x) => x.id === id);
    setPack(Packageslist.find((e) => e.id === priceScheme?.packageId)?.package);
    setAppointmentType(
      ATList.find((e) => e.id === priceScheme?.appointmentTypeId)?.type
    );
    setPatientType(
      PTList.find((e) => e.id === priceScheme?.patientTypeId)?.type
    );
    setPrice(id !== 0 ? priceScheme?.price / 100 : 0);
    setOpened(true);
  }

  async function addNewPSRule() {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/AddPriceSchemeRule",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageId: Packageslist.find((e) => e.package === pack)?.id,
            appointmentTypeId: ATList.find((e) => e.type === appointmentType)
              ?.id,
            patientTypeId: PTList.find((e) => e.type === patientType)?.id,
            price: Math.round(price * 100),
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Règle ajoutée",
          message: "La règle de prix a été ajoutée.",
          color: "green",
          icon: <Check />,
        });
        setOpened(false);
        updateConfigData(token);
      } else if (res.error === "already exists") {
        showNotification({
          title: "Cette règle existe déjà",
          message: `Il y a déjà un prix programmé avec ces paramètres. Il s'agit de ${displayPrice(
            res.price
          )} €.`,
          color: "red",
          icon: <X />,
        });
      }
    } catch (e) {
      return e;
    }
  }

  async function updatePSRule() {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/updatePriceSchemeRule",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            packageId: Packageslist.find((e) => e.package === pack)?.id,
            appointmentTypeId: ATList.find((e) => e.type === appointmentType)
              ?.id,
            patientTypeId: PTList.find((e) => e.type === patientType)?.id,
            price: Math.round(price * 100),
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Règle modifiée",
          message: "La règle de prix a été modifiée.",
          color: "green",
          icon: <Check />,
        });
        setOpened(false);
        updateConfigData(token);
      }
    } catch (e) {
      return e;
    }
  }

  async function deletePriceSchemeRule(id) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeletePriceSchemeRule",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Règle supprimée",
          message: "La règle de prix a été supprimée.",
          color: "green",
          icon: <Check />,
        });
        setOpened(false);
        updateConfigData(token);
      }
    } catch (e) {
      return e;
    }
  }

  function submitPSform(event) {
    event.preventDefault();
    if (id === 0) {
      addNewPSRule();
    } else {
      updatePSRule();
    }
  }
  function handleDeleteClick(id) {
    setConfirmation({
      title: "Suppression",
      text: "Êtes vous sûr(e) de vouloir supprimer cette règle de prix?",
      callback: () => deletePriceSchemeRule(id),
    });
    setOpen(true);
  }
  return (
    <>
      <Confirmation
        text={confirmation.text}
        title={confirmation.title}
        callback={confirmation.callback}
        open={open}
        close={() => setOpen(false)}
      />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={id === 0 ? "Ajouter une règle" : "Changer la règle"}
        overlayOpacity={0.3}
        centered
      >
        <form
          onSubmit={submitPSform}
          style={{
            width: "max-content",
            margin: "auto",
          }}
        >
          <Select
            data={Packageslist.map((e) => e.package)}
            value={pack}
            onChange={setPack}
            clearable
            label="Forfaits"
          />

          <Select
            data={ATList.map((e) => e.type)}
            value={appointmentType}
            onChange={setAppointmentType}
            clearable
            label="Consultation"
          />
          <Select
            data={PTList.map((e) => e.type)}
            value={patientType}
            onChange={setPatientType}
            clearable
            label="Type de Patient"
          />

          <NumberInput
            label="Prix"
            min={0}
            precision={2}
            step={0.01}
            value={price}
            onChange={(val) => setPrice(val)}
            hideControls
            required
          />

          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              {id === 0 ? "Ajouter" : "Modifier"}
            </Button>
          </Center>
        </form>
      </Modal>
      <Button
        style={{ marginTop: "20px" }}
        onClick={() => updatePriceScheme(0)}
        leftIcon={<Plus size={18} />}
        compact
        variant="outline"
      >
        Ajouter une règle
      </Button>
      <Table striped verticalSpacing="xs">
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import Confirmation from "../Confirmation";
import {
  TextInput,
  Checkbox,
  Button,
  Modal,
  Select,
  Grid,
  Center,
  ColorPicker,
} from "@mantine/core";
import { Pencil, Check, Trash, Plus, X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useUpdateConfig } from "../contexts/ConfigContext";
import { useEffect } from "react";
import { usePatients } from "../contexts/PatientsContext";
import { capitalize } from "../Functions";

export default function Appointments({ appointmentTypes }) {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig();
  const appointments = usePatients().appointments;
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentTypeMulti, setAppointmentTypeMulti] = useState(0);
  const [appointmentTypeAlert, setAppointmentTypeAlert] = useState(0);
  const [ATSelect, setATselect] = useState("");
  const [ATopened, setATOpened] = useState(false);
  const [appointmentTypeId, setAppointmentId] = useState(0);
  const [color, setColor] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  const ATlist =
    appointmentTypes?.length > 0 ? appointmentTypes.map((e) => e.type) : [];

  useEffect(() => {
    if (appointmentTypes?.length > 0) {
      setATselect(appointmentTypes[0].type);
    }
  }, [appointmentTypes]);

  function submitAppointmentForm(event) {
    event.preventDefault();
    if (appointmentTypeId === 0) {
      addNewType(
        appointmentType,
        appointmentTypeMulti,
        color,
        appointmentTypeAlert
      );
    } else {
      updateAppointmentType(
        appointmentType,
        appointmentTypeMulti,
        color,
        appointmentTypeAlert
      );
    }
    setATOpened(false);
  }

  async function updateAppointmentType(type, multi, color, alert) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdateAppointmentType",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: type,
            multi: multi,
            alert: alert,
            color: color,
            token: token,
            id: appointmentTypeId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: type,
          message: "Le type de consultation a été modifié.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setATselect(appointmentType);
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewType(type, multi, color, alert) {
    if (
      appointmentTypes.findIndex(
        (e) => capitalize(e.type) === capitalize(type)
      ) === -1
    ) {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/AddAppointmentType",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: type,
              multi: multi,
              alert: alert,
              color: color,
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          showNotification({
            title: type,
            message: "Le type de consultation a été ajouté.",
            color: "green",
            icon: <Check />,
          });
          updateConfigData(token);
          setATselect(appointmentType);
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: type,
        message:
          "Le type de consultation ne peut pas être ajouté à nouveau car elle existe déjà.",
        color: "red",
        icon: <X />,
      });
    }
  }

  function handleATForm(event) {
    event.preventDefault();
    setAppointmentType(ATSelect);
    var index = appointmentTypes.findIndex((e) => e.type === ATSelect);
    setAppointmentTypeMulti(appointmentTypes[index].multi);
    setAppointmentTypeAlert(appointmentTypes[index].alert);
    setAppointmentId(appointmentTypes[index].id);
    setColor(appointmentTypes[index].color);
    setATOpened(true);
  }

  function addAppointmentType() {
    setAppointmentType("");
    setAppointmentTypeMulti(false);
    setAppointmentTypeAlert(false);
    setAppointmentId(0);
    setColor("#ffffff");
    setATOpened(true);
  }

  async function deleteAppointmentType() {
    var index = appointmentTypes.findIndex((e) => e.type === ATSelect);
    var title = ATSelect;
    var appointmentTypeId = appointmentTypes[index].id;
    if (appointments.findIndex((e) => e.idType === appointmentTypeId) === -1) {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/DeleteAppointmentType",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: appointmentTypeId,
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          showNotification({
            title: title,
            message: "Le type de consultation a été supprimé.",
            color: "green",
            icon: <Check />,
          });
          updateConfigData(token);
          setATselect(appointmentTypes[0].type);
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: title,
        message:
          "Le type de consultation ne peut pas être supprimé car il est utilisé pour certains rendez-vous.",
        color: "red",
        icon: <X />,
      });
    }
  }

  function handleDeleteClick() {
    setConfirmation({
      title: "Suppression",
      text: "Êtes vous sûr(e) de vouloir supprimer ce type de consultation?",
      callback: () => deleteAppointmentType(),
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
      />{" "}
      <Modal
        opened={ATopened}
        onClose={() => setATOpened(false)}
        title={
          appointmentTypeId === 0
            ? "Ajouter un type de consultation"
            : "Changer le type de consultation"
        }
        overlayOpacity={0.3}
        centered
      >
        <form
          onSubmit={submitAppointmentForm}
          style={{
            width: "max-content",
            margin: "auto",
          }}
        >
          {" "}
          <Center>
            {" "}
            <TextInput
              value={appointmentType}
              style={{ margin: "10px" }}
              onChange={(event) =>
                setAppointmentType(event.currentTarget.value)
              }
              label="Type"
            />
          </Center>
          <Center>
            <Checkbox
              checked={appointmentTypeMulti}
              onChange={(event) =>
                setAppointmentTypeMulti(event.currentTarget.checked)
              }
              label="Collectif"
              style={{ margin: "10px" }}
            />
            <Checkbox
              checked={appointmentTypeAlert}
              onChange={(event) =>
                setAppointmentTypeAlert(event.currentTarget.checked)
              }
              label="Alerte Comptabilité"
              style={{ margin: "10px" }}
            />
          </Center>
          <Center>
            <ColorPicker
              style={{ margin: "10px" }}
              value={color}
              onChange={setColor}
              format="rgba"
            />
          </Center>
          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              {appointmentTypeId === 0 ? "Ajouter" : "Modifier"}
            </Button>
          </Center>
        </form>
      </Modal>
      <div style={{ width: "fit-content" }}>
        <form onSubmit={handleATForm}>
          <Select
            data={ATlist}
            value={ATSelect}
            onChange={setATselect}
            label="Types de consultations"
          ></Select>
          <Center>
            <Grid grow style={{ marginTop: "5px" }}>
              <Grid.Col span={2}>
                <Button
                  size={"xs"}
                  variant="outline"
                  onClick={addAppointmentType}
                >
                  <Plus size={18} />
                </Button>
              </Grid.Col>
              <Grid.Col span={2}>
                <Button
                  size={"xs"}
                  variant="outline"
                  color="red"
                  onClick={handleDeleteClick}
                >
                  <Trash size={18} />
                </Button>
              </Grid.Col>
              <Grid.Col span={2}>
                <Button variant="outline" size={"xs"} type="submit">
                  <Pencil size={18} />
                </Button>
              </Grid.Col>
            </Grid>
          </Center>
        </form>
      </div>
    </>
  );
}

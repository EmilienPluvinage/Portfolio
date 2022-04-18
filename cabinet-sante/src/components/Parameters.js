import "../styles/styles.css";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
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
import { Pencil, Check, Trash, Plus } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useConfig, useUpdateConfig } from "./contexts/ConfigContext";

export default function Parameters() {
  const token = useLogin().token;
  const appointmentTypes = useConfig().appointmentTypes;
  const updateConfigData = useUpdateConfig();
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentTypeMulti, setAppointmentTypeMulti] = useState(0);
  const [ATSelect, setATselect] = useState("");
  const [ATopened, setATOpened] = useState(false);
  const [appointmentTypeId, setAppointmentId] = useState(0);
  const [color, setColor] = useState("");

  const ATlist =
    appointmentTypes?.length > 0 ? appointmentTypes.map((e) => e.type) : [];

  function submitAppointmentForm(event) {
    event.preventDefault();
    updateAppointmentType(appointmentType, appointmentTypeMulti);
    setATOpened(false);
  }

  async function updateAppointmentType(type, multi) {
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

  function handleATForm(event) {
    event.preventDefault();
    setAppointmentType(ATSelect);
    var index = appointmentTypes.findIndex((e) => e.type === ATSelect);
    setAppointmentTypeMulti(appointmentTypes[index].multi);
    setAppointmentId(appointmentTypes[index].id);
    setColor(appointmentTypes[index].color);
    setATOpened(true);
  }

  return (
    <div>
      <h2>Paramètres</h2>
      <Modal
        opened={ATopened}
        onClose={() => setATOpened(false)}
        title="Changer le type de consultation"
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
              label="collectif"
              style={{ margin: "10px" }}
            />
          </Center>
          <Center>
            <ColorPicker
              style={{ margin: "10px" }}
              value={color}
              onChange={setColor}
            />
          </Center>
          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              Modifier
            </Button>
          </Center>
        </form>
      </Modal>
      <div className="main-content">
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
                  <Button size={"xs"} variant="outline">
                    <Plus size={18} />
                  </Button>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button size={"xs"} variant="outline" color="red">
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
      </div>
    </div>
  );
}

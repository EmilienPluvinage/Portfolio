import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import { TextInput, Button, Modal, Select, Grid, Center } from "@mantine/core";
import { Pencil, Check, Trash, Plus } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useUpdateConfig } from "../contexts/ConfigContext";

export default function Parameters({ patientTypes }) {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig();
  const [patientType, setPatientType] = useState("");
  const [PTSelect, setPTselect] = useState("");
  const [PTopened, setPTOpened] = useState(false);
  const [patientTypeId, setPatientTypeId] = useState(0);

  const PTlist =
    patientTypes?.length > 0 ? patientTypes.map((e) => e.type) : [];

  function submitAppointmentForm(event) {
    event.preventDefault();
    if (patientTypeId === 0) {
      addNewType(patientType);
    } else {
      updateType(patientType);
    }
    setPTOpened(false);
  }

  async function updateType(type) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdatePatientType",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: type,
            token: token,
            id: patientTypeId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: type,
          message: "Le type de profil patient a été modifié.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setPTselect(type);
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewType(type) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/AddPatientType",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: type,
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
        setPTselect(type);
      }
    } catch (e) {
      return e;
    }
  }

  function handlePTForm(event) {
    event.preventDefault();
    setPatientType(PTSelect);
    var index = patientTypes.findIndex((e) => e.type === PTSelect);
    setPatientTypeId(patientTypes[index].id);
    setPTOpened(true);
  }

  function addPatientType() {
    setPatientType("");
    setPatientTypeId(0);
    setPTOpened(true);
  }

  async function deletePatientType() {
    var index = patientTypes.findIndex((e) => e.type === PTSelect);
    var title = PTSelect;
    var patientTypeId = patientTypes[index].id;
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeletePatientType",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: patientTypeId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: title,
          message: "Le type de profil patient a été supprimé.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setPTselect(patientTypes[0].type);
      }
    } catch (e) {
      return e;
    }
  }
  return (
    <>
      {" "}
      <Modal
        opened={PTopened}
        onClose={() => setPTOpened(false)}
        title={
          patientTypeId === 0
            ? "Ajouter un type de profil patient"
            : "Changer le type de profil patient"
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
              value={patientType}
              style={{ margin: "10px" }}
              onChange={(event) => setPatientType(event.currentTarget.value)}
              label="Type"
            />
          </Center>
          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              {patientTypeId === 0 ? "Ajouter" : "Modifier"}
            </Button>
          </Center>
        </form>
      </Modal>
      <div style={{ width: "fit-content" }}>
        <form onSubmit={handlePTForm}>
          <Select
            data={PTlist}
            value={PTSelect}
            onChange={setPTselect}
            label="Types de Profil Patient"
          ></Select>
          <Center>
            <Grid grow style={{ marginTop: "5px" }}>
              <Grid.Col span={2}>
                <Button size={"xs"} variant="outline" onClick={addPatientType}>
                  <Plus size={18} />
                </Button>
              </Grid.Col>
              <Grid.Col span={2}>
                <Button
                  size={"xs"}
                  variant="outline"
                  color="red"
                  onClick={deletePatientType}
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

import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import { TextInput, Button, Modal, Select, Grid, Center } from "@mantine/core";
import { Pencil, Check, Trash, Plus, X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useUpdateConfig } from "../contexts/ConfigContext";
import { useEffect } from "react";
import Confirmation from "../Confirmation";
import { capitalize } from "../Functions";

export default function PayementMethods({ parameters }) {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig().initData;
  const [parameter, setParameter] = useState("");
  const [select, setSelect] = useState("");
  const [opened, setOpened] = useState(false);
  const [parameterId, setParameterId] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  const payementMethods = parameters.reduce(
    (acc, item) =>
      item.name === "payementMethod" ? acc.concat(item.value) : acc,
    []
  );

  useEffect(() => {
    if (payementMethods?.length > 0 && select === "") {
      setSelect(payementMethods[0]);
    }
  }, [payementMethods, select]);

  function submitForm(event) {
    event.preventDefault();
    if (parameterId === 0) {
      addNewPM(parameter);
    } else {
      updatePM(parameter);
    }
    setOpened(false);
  }

  async function updatePM(param) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdateParameter",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: param,
            token: token,
            id: parameterId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: param,
          message: "Le paramètre a bien été modifié.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setSelect(param);
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewPM(param) {
    if (
      parameters.findIndex((e) => capitalize(e.value) === capitalize(param)) ===
      -1
    ) {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/AddParameter",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              value: param,
              name: "payementMethod",
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          showNotification({
            title: param,
            message: "Le paramètre a été ajouté.",
            color: "green",
            icon: <Check />,
          });
          updateConfigData(token);
          setSelect(param);
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: param,
        message:
          "Le paramètre ne peut pas être ajouté à nouveau car il existe déjà.",
        color: "red",
        icon: <X />,
      });
    }
  }

  function handlePMForm(event) {
    event.preventDefault();
    setParameter(select);
    var index = parameters.findIndex((e) => e.value === select);
    setParameterId(parameters[index].id);
    setOpened(true);
  }

  function addParameter() {
    setParameter("");
    setParameterId(0);
    setOpened(true);
  }

  async function deletePM() {
    var index = parameters.findIndex((e) => e.value === select);
    var title = select;
    var parameterId = parameters[index].id;

    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeleteParameter",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: parameterId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: title,
          message: "Le paramètre a été supprimé.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setSelect(payementMethods[0]);
      }
    } catch (e) {
      return e;
    }
  }

  function handleDeleteClick() {
    setConfirmation({
      title: "Suppression",
      text: "Êtes vous sûr(e) de vouloir supprimer ce paramètre?",
      callback: () => deletePM(),
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
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          parameterId === 0
            ? "Ajouter une méthode de paiement"
            : "Changer le nom de la méthode de paiement"
        }
        overlayOpacity={0.3}
        centered
      >
        <form
          onSubmit={submitForm}
          style={{
            width: "max-content",
            margin: "auto",
          }}
        >
          {" "}
          <Center>
            {" "}
            <TextInput
              value={parameter}
              style={{ margin: "10px" }}
              onChange={(event) => setParameter(event.currentTarget.value)}
              label="Type"
            />
          </Center>
          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              {parameterId === 0 ? "Ajouter" : "Modifier"}
            </Button>
          </Center>
        </form>
      </Modal>
      <div style={{ width: "fit-content" }}>
        <form onSubmit={handlePMForm}>
          <Select
            data={payementMethods}
            value={select}
            onChange={setSelect}
            label="Méthodes de paiement"
          ></Select>
          <Center>
            <Grid grow style={{ marginTop: "5px" }}>
              <Grid.Col span={2}>
                <Button size={"xs"} variant="outline" onClick={addParameter}>
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

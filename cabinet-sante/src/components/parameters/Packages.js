import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import Confirmation from "../Confirmation";
import {
  TextInput,
  Button,
  Modal,
  Select,
  Grid,
  Center,
  NumberInput,
} from "@mantine/core";
import { Pencil, Check, Trash, Plus, X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useUpdateConfig } from "../contexts/ConfigContext";
import { useEffect } from "react";
import { usePatients } from "../contexts/PatientsContext";

export default function Packages({ packages }) {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig();
  const patients = usePatients().patients;
  const [pack, setPackage] = useState("");
  const [price, setPrice] = useState(0);
  const [packageSelect, setPackageSelect] = useState("");
  const [packageOpened, setPackageOpened] = useState(false);
  const [packageId, setPackageId] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  const Packageslist =
    packages?.length > 0 ? packages.map((e) => e.package) : [];

  useEffect(() => {
    if (packages?.length > 0) {
      setPackageSelect(packages[0].package);
    }
  }, [packages]);

  function submitAppointmentForm(event) {
    event.preventDefault();
    if (packageId === 0) {
      addNewPackage(pack, price);
    } else {
      updatePackage(pack, price);
    }
    setPackageOpened(false);
  }

  async function updatePackage(pack, price) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdatePackage",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package: pack,
            price: Math.round(price * 100),
            token: token,
            id: packageId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: pack,
          message: "Le type de forfait a été modifié.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setPackageSelect(pack);
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewPackage(pack, price) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/AddPackage",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package: pack,
            price: Math.round(price * 100),
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: pack,
          message: "Le forfait a été ajouté.",
          color: "green",
          icon: <Check />,
        });
        updateConfigData(token);
        setPackage(pack);
      }
    } catch (e) {
      return e;
    }
  }

  function handlePackageForm(event) {
    event.preventDefault();
    setPackage(packageSelect);
    var index = packages.findIndex((e) => e.package === packageSelect);
    setPackageId(packages[index].id);
    setPrice(Math.round(packages[index].price) / 100);
    setPackageOpened(true);
  }

  function addPackage() {
    setPackage("");
    setPrice(0);
    setPackageId(0);
    setPackageOpened(true);
  }

  async function deletePackage() {
    var index = packages.findIndex((e) => e.package === packageSelect);
    var title = packageSelect;
    var packageId = packages[index].id;
    if (patients.findIndex((e) => e.packageId === packageId) === -1) {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/DeletePackage",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: packageId,
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          showNotification({
            title: title,
            message: "Le forfait été supprimé.",
            color: "green",
            icon: <Check />,
          });
          updateConfigData(token);
          setPackageSelect(packages[0].package);
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: title,
        message:
          "Le forfait ne peut pas être supprimé car il est utilisé pour certains patients.",
        color: "red",
        icon: <X />,
      });
    }
  }

  function handleDeleteClick() {
    setConfirmation({
      title: "Suppression",
      text: "Êtes vous sûr(e) de vouloir supprimer ce forfait?",
      callback: () => deletePackage(),
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
        opened={packageOpened}
        onClose={() => setPackageOpened(false)}
        title={packageId === 0 ? "Ajouter un forfait" : "Changer le forfait"}
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
              value={pack}
              style={{ margin: "10px" }}
              onChange={(event) => setPackage(event.currentTarget.value)}
              label="Nom du forfait"
              required
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
          </Center>
          <Center>
            <Button style={{ margin: "10px" }} type="submit">
              {packageId === 0 ? "Ajouter" : "Modifier"}
            </Button>
          </Center>
        </form>
      </Modal>
      <div style={{ width: "fit-content" }}>
        <form onSubmit={handlePackageForm}>
          <Select
            data={Packageslist}
            value={packageSelect}
            onChange={setPackageSelect}
            label="Forfaits"
          ></Select>
          <Center>
            <Grid grow style={{ marginTop: "5px" }}>
              <Grid.Col span={2}>
                <Button size={"xs"} variant="outline" onClick={addPackage}>
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

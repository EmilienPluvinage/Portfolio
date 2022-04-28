import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { Check, Link, Search, X } from "tabler-icons-react";
import { Button, Modal, Center, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "./contexts/AuthContext";
import DelinkPatients from "./DelinkPatients";

export default function ShareBalance({ patientId }) {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const patients = usePatients().patients;
  const sharedBalance = usePatients().sharedBalance;
  const updateContext = useUpdatePatients().update;
  const patientName = patients.find((e) => e.id === patientId)?.fullname;
  const patientsList = patients
    .map((e) => {
      return e.fullname;
    })
    .filter((e) => e !== patientName);
  const token = useLogin().token;

  var links = [];

  sharedBalance.forEach((e) => {
    var linkName = "";
    if (e.patientId1 === patientId) {
      linkName = patients.find((f) => f.id === e.patientId2)?.fullname;
      if (links.findIndex((g) => g.fullname === linkName) === -1) {
        links.push({ fullname: linkName, id: e.patientId2 });
      }
    } else if (e.patientId2 === patientId) {
      linkName = patients.find((f) => f.id === e.patientId1)?.fullname;
      if (links.findIndex((g) => g.fullname === linkName) === -1) {
        links.push({ fullname: linkName, id: e.patientId1 });
      }
    }
  });

  async function submitForm() {
    setLoading("loading");

    const linkId = patients.find((e) => e.fullname === search)?.id;
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/LinkPatients",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId1: patientId,
            patientId2: linkId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Nouveau Lien",
          message: `Le solde des patients ${patientName} et ${search} est maintenant lié.`,
          color: "green",
          icon: <Check />,
        });
        updateContext(token);
        setLoading("");
        setSearch("");
        setOpened(false);
      } else {
        showNotification({
          title: "Erreur",
          message: res.error,
          color: "red",
          icon: <X />,
        });
        setLoading("");
      }
    } catch (e) {
      return e;
    }
  }
  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={`Partager le solde de ${patientName}`}
          closeOnClickOutside={false}
        >
          <Center>
            <Select
              limit={5}
              searchable
              clearable
              placeholder="Rechercher un patient"
              data={patientsList}
              icon={<Search size={18} />}
              value={search}
              onChange={setSearch}
            />

            <Button
              loading={loading}
              onClick={() => submitForm()}
              style={{ margin: "10px" }}
            >
              Confirmer
            </Button>
          </Center>
        </Modal>
      )}

      <Button
        onClick={() => setOpened(true)}
        leftIcon={<Link size={18} />}
        style={{ margin: "10px" }}
      >
        Lier
      </Button>
      {links.map((e) => (
        <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
          <DelinkPatients patientId1={e.id} patientId2={patientId} />
        </div>
      ))}
    </>
  );
}

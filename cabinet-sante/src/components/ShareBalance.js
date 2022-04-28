import { useState } from "react";
import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Check, Link, ReportMoney, Search, X } from "tabler-icons-react";

import {
  Button,
  Modal,
  Table,
  Pagination,
  Center,
  Select,
} from "@mantine/core";
import { displayDate, displayPrice } from "./Functions";
import Payement from "./Payement";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "./contexts/AuthContext";

export default function ShareBalance({ patientId }) {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const patients = usePatients().patients;
  const patientName = patients.find((e) => e.id === patientId)?.fullname;
  const patientsList = patients
    .map((e) => {
      return e.fullname;
    })
    .filter((e) => e !== patientName);
  const token = useLogin().token;

  async function submitForm() {
    setLoading("loading");
    console.log(search);
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
    </>
  );
}

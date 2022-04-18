import "../styles/styles.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { usePatients } from "./contexts/PatientsContext";
import {
  List,
  UserPlus,
  Home,
  Logout,
  ChartBar,
  Calculator,
  CalendarStats,
  Settings,
  Search,
  ReportMedical,
} from "tabler-icons-react";
import {
  Center,
  Select,
  Modal,
  Badge,
  Text,
  Grid,
  Button,
} from "@mantine/core";
import { useState } from "react";
import NewAppointment from "./NewAppointment";

function LeftMenu({ modified }) {
  const navigate = useNavigate();
  const patients = usePatients();
  const patientsList = patients.map((e) => {
    return e.fullname;
  });
  const [openedConfirm, setOpenedConfirm] = useState(false);
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const path = useLocation().pathname;
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const iconsStyle = {
    marginRight: "10px",
    position: "relative",
    top: "4px",
  };
  const iconsSize = 18;

  function handleSearch(value) {
    setSearch(value);
    var index = patients.findIndex((e) => e.fullname === value);
    if (index !== -1) {
      navigate("/Nouveau-patient/" + patients[index].id);
    }
  }

  function newPatient() {
    if (modified.current) {
      setOpenedConfirm(true);
    } else {
      navigate("/Nouveau-patient/");
    }
  }
  return (
    loggedIn && (
      <>
        <Modal
          centered
          overlayOpacity={0.3}
          withCloseButton={false}
          opened={openedConfirm}
          onClose={() => setOpenedConfirm(false)}
          closeOnClickOutside={false}
        >
          <Text>
            Les modifications que vous avez effectuées n'ont pas été
            enregistrées. Êtes-vous sûr(e) de vouloir ajouter un nouveau patient
            et annuler les modifications effectuées?
            <Grid
              justify="space-between"
              style={{ marginTop: "10px", marginRight: "50px" }}
            >
              <Grid.Col span={2}>
                <Button
                  variant="default"
                  onClick={() => setOpenedConfirm(false)}
                >
                  Retour
                </Button>
              </Grid.Col>
              <Grid.Col span={2}>
                <Link to="/Nouveau-Patient" className="text-link">
                  <Button onClick={() => setOpenedConfirm(false)}>
                    Continuer
                  </Button>
                </Link>
              </Grid.Col>
            </Grid>
          </Text>
        </Modal>
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={"Consultation"}
          closeOnClickOutside={false}
        >
          {opened && (
            <NewAppointment
              setOpened={setOpened}
              startingTime={0}
              patientId={0}
              appointmentId={0}
            />
          )}
        </Modal>

        <div id="LeftMenu">
          <Center>
            <Select
              limit={5}
              searchable
              clearable
              placeholder="Rechercher un patient"
              data={patientsList}
              icon={<Search size={18} />}
              style={{
                marginTop: "20px",
                marginLeft: "20px",
                marginBottom: "10px",
              }}
              value={search}
              onChange={handleSearch}
            />
          </Center>
          <ul>
            <Link to="/" className="text-link">
              <li className={path === "/" ? "clicked" : ""}>
                <Home size={iconsSize} style={iconsStyle} />
                Accueil
              </li>
            </Link>

            <li
              onClick={newPatient}
              className={path === "/Nouveau-Patient" ? "clicked" : ""}
            >
              <UserPlus size={iconsSize} style={iconsStyle} />
              Nouveau Patient
            </li>

            <li onClick={() => setOpened(true)}>
              <ReportMedical size={iconsSize} style={iconsStyle} />
              Nouvelle Consultation
            </li>
            <Link to="/Listing-Patients" className="text-link">
              <li className={path === "/Listing-Patients" ? "clicked" : ""}>
                <List size={iconsSize} style={iconsStyle} />
                Liste des patients{" "}
                <Badge
                  variant="filled"
                  size="xs"
                  style={{ position: "relative", bottom: "2px" }}
                >
                  {patients.length}
                </Badge>
              </li>
            </Link>
            <Link to="/Agenda" className="text-link">
              <li className={path === "/Agenda" ? "clicked" : ""}>
                <CalendarStats size={iconsSize} style={iconsStyle} />
                Agenda
              </li>
            </Link>
            <Link to="/Comptabilite" className="text-link">
              <li className={path === "/Comptabilite" ? "clicked" : ""}>
                <Calculator size={iconsSize} style={iconsStyle} />
                Comptabilité
              </li>
            </Link>
            <Link to="/Statistiques" className="text-link">
              <li className={path === "/Statistiques" ? "clicked" : ""}>
                <ChartBar size={iconsSize} style={iconsStyle} />
                Statistiques
              </li>
            </Link>
            <Link to="/Parametres" className="text-link">
              <li className={path === "/Parametres" ? "clicked" : ""}>
                <Settings size={iconsSize} style={iconsStyle} />
                Paramètres
              </li>
            </Link>

            <li onClick={() => logging(false)}>
              <Logout size={iconsSize} style={iconsStyle} />
              Déconnexion
            </li>
          </ul>
        </div>
      </>
    )
  );
}

export default LeftMenu;

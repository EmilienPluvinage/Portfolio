import { useState } from "react";
import "../styles/styles.css";
import { capitalize, getFullnameFromId } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useGovData } from "./contexts/GovDataContext";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import {
  Calendar,
  Upload,
  ReportMedical,
  Check,
  ListSearch,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";

import {
  Autocomplete,
  TextInput,
  Button,
  Modal,
  Radio,
  RadioGroup,
  Textarea,
  NumberInput,
  CheckboxGroup,
  Checkbox,
  Select,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import AppointmentDetails from "./AppointmentDetails";
import History from "./History";
import Payement from "./Payement";
import Balance from "./Balance";
import { useConfig } from "./contexts/ConfigContext";

export default function NewPatient() {
  const navigate = useNavigate();
  var autoCompleteCities = useGovData().cities;
  var autoCompleteCountries = useGovData().countries;
  const packages = useConfig().packages;

  const [opened, setOpened] = useState(false);
  const [openedHistory, setOpenedHistory] = useState(false);
  const [loading, setLoading] = useState("");
  const token = useLogin().token;
  const PatientList = usePatients().patients;
  const getPatients = useUpdatePatients().update;
  const [id, setId] = useState(0);
  const params = useParams();
  const initialValues = {
    lastname: "",
    firstname: "",
    birthday: "",
    sex: "",
    mobilephone: "",
    landline: "",
    email: "",
    address: "",
    city: "",
    country: "",
    comments: "",
    maritalStatus: "",
    numberOfChildren: 0,
    job: "",
    GP: "",
    hobbies: "",
    SSNumber: "",
    healthInsurance: "",
    sentBy: "",
    hand: [],
  };
  const maritalStatusData = [
    "Inconnu",
    "Célibataire",
    "Marié(e)",
    "Pacsé(e)",
    "En Couple",
    "Divorcé(e)",
    "Veuf(ve)",
  ];
  const form = useForm({
    initialValues: initialValues,
  });

  if (PatientList.length > 0) {
    if (params?.id !== undefined && params?.id.toString() !== id.toString()) {
      var patient = PatientList.find(
        (e) => e.id.toString() === params.id.toString()
      );
      if (patient !== undefined) {
        setId(patient.id);
        form.setValues({
          firstname: patient.firstname,
          lastname: patient.lastname,
          birthday: patient.birthday !== "" ? new Date(patient.birthday) : "",
          sex: patient.sex,
          mobilephone: patient.mobilephone,
          landline: patient.landline,
          email: patient.email,
          address: patient.address,
          city: patient.city,
          country: patient.country,
          comments: patient.comments,
          maritalStatus: patient.maritalStatus,
          numberOfChildren: parseInt(patient.numberOfChildren),
          job: patient.job,
          GP: patient.GP,
          hobbies: patient.hobbies,
          SSNumber: patient.SSNumber,
          healthInsurance: patient.healthInsurance,
          sentBy: patient.sentBy,
          hand: patient.hand,
        });
      }
    } else if (params?.id === undefined && id !== 0) {
      form.reset();
      form.setFieldValue("birthday", null);
      setId(0);
    }
  }

  async function submitForm(values) {
    setLoading("loading");
    var link =
      process.env.REACT_APP_API_DOMAIN +
      "/" +
      (id === 0 ? "NewPatient" : "UpdatePatient");
    try {
      const fetchResponse = await fetch(link, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: capitalize(values.firstname),
          lastname: capitalize(values.lastname),
          birthday: values.birthday,
          sex: values.sex,
          mobilephone: values.mobilephone,
          landline: values.landline,
          email: values.email,
          address: values.address,
          postcode: values.postcode,
          city: values.city,
          country: values.country,
          comments: values.comments,
          maritalStatus: values.maritalStatus,
          numberOfChildren: values.numberOfChildren,
          job: values.job,
          GP: values.GP,
          hobbies: values.hobbies,
          SSNumber: values.SSNumber,
          healthInsurance: values.healthInsurance,
          sentBy: values.sentBy,
          hand: JSON.stringify(values.hand),
          token: token,
          id: id,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        getPatients(token);
        setId(res.id);
        setLoading("");
        showNotification({
          title:
            id !== 0 ? "Modification enregistrée" : "Nouveau patient ajouté",
          message: "La fiche de votre patient a bien été mise à jour.",
          color: "green",
          icon: <Check />,
        });
        navigate("/Nouveau-Patient/" + res.id);
      }
    } catch (e) {
      return e;
    }
  }

  // for validation
  // pattern="0[0-9]{9}|\+[0-9]{11}"
  // pattern="0[0-9]{9}|\+[0-9]{11}"

  return (
    <>
      {id !== 0 && (
        <>
          <Modal
            centered
            overlayOpacity={0.3}
            opened={openedHistory}
            onClose={() => setOpenedHistory(false)}
            title={"Historique de " + getFullnameFromId(PatientList, id)}
            closeOnClickOutside={false}
            size="50%"
          >
            {" "}
            {openedHistory && <History patientId={id} />}
          </Modal>
          <Modal
            centered
            overlayOpacity={0.3}
            opened={opened}
            onClose={() => setOpened(false)}
            title={"Consultation"}
            closeOnClickOutside={false}
            size="50%"
          >
            {opened && (
              <AppointmentDetails
                setOpened={setOpened}
                patientId={id}
                appointmentId={0}
              />
            )}
          </Modal>
        </>
      )}

      <form
        onSubmit={form.onSubmit((values) => submitForm(values))}
        id="new-patient"
        autoComplete="new-password"
      >
        <div className="nav-patient">
          <Button
            leftIcon={<Upload size={18} />}
            type="submit"
            form="new-patient"
            style={{ margin: "10px" }}
            loading={loading}
          >
            Enregistrer
          </Button>
          {id !== 0 && (
            <>
              <Button
                leftIcon={<ReportMedical size={18} />}
                onClick={() => setOpened(true)}
                style={{ margin: "10px" }}
              >
                Consultation
              </Button>
              <Button
                leftIcon={<ListSearch size={18} />}
                onClick={() => setOpenedHistory(true)}
                style={{ margin: "10px" }}
              >
                Historique
              </Button>
              <Payement patientId={id} payementId={0} />
              <Balance patientId={id} fullDisplay={true} />
            </>
          )}
        </div>
        <h2>État Civil du Patient</h2>
        <div className="main-content">
          <div className="new-patient">
            <div className="form-column">
              <TextInput
                label="Nom"
                name="lastname"
                {...form.getInputProps("lastname")}
                required
                autoComplete="nope"
              />
              <TextInput
                label="Prénom"
                name="firstname"
                {...form.getInputProps("firstname")}
                autoComplete={"" + Math.random()}
              />
              <DatePicker
                label="Date de naissance"
                locale="fr"
                name="birthday"
                {...form.getInputProps("birthday")}
                inputFormat="DD/MM/YYYY"
                placeholder="Choisissez une date"
                icon={<Calendar size={16} />}
                allowFreeInput
              />
              <RadioGroup
                label="Genre"
                name="sex"
                {...form.getInputProps("sex")}
                size={"sm"}
                required
              >
                <Radio value="homme" label="Homme" />
                <Radio value="femme" label="Femme" />
                <Radio value="autre" label="Autre" />
              </RadioGroup>
            </div>
            <div className="form-column">
              <TextInput
                label="Téléphone Portable"
                name="mobilephone"
                {...form.getInputProps("mobilephone")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Téléphone fixe"
                name="landline"
                {...form.getInputProps("landline")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Adresse e-mail"
                name="email"
                {...form.getInputProps("email")}
                size={"sm"}
                autoComplete={"" + Math.random()}
              />
              <Textarea
                label="Remarques"
                name="comments"
                {...form.getInputProps("comments")}
              />
            </div>
            <div className="form-column">
              <Textarea
                label="Adresse postale"
                name="address"
                {...form.getInputProps("address")}
                autoComplete={"" + Math.random()}
              />

              <Autocomplete
                label="Ville"
                name="city"
                placeholder="Saint-Vincent-de-Barbeyrargues (34730)"
                {...form.getInputProps("city")}
                data={autoCompleteCities}
              />
              <Autocomplete
                label="Pays"
                name="country"
                placeholder="France"
                {...form.getInputProps("country")}
                data={autoCompleteCountries}
              />
              <Text size="sm" style={{ marginTop: "10px" }}>
                Forfait en cours:{" "}
                {
                  packages.find(
                    (e) =>
                      e.id ===
                      PatientList.find(
                        (e) => e.id?.toString() === params.id?.toString()
                      )?.packageId
                  )?.package
                }
              </Text>
            </div>
          </div>
        </div>
        <h2>Informations sur le Patient</h2>
        <div className="main-content">
          <div className="new-patient">
            <div className="form-column">
              <Select
                data={maritalStatusData}
                label="Statut Marital"
                name="maritalStatus"
                {...form.getInputProps("maritalStatus")}
                autoComplete={"" + Math.random()}
              />
              <NumberInput
                label="Nombre d'enfants"
                name="numberOfChildren"
                {...form.getInputProps("numberOfChildren")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Profession / Scolarité"
                name="job"
                {...form.getInputProps("job")}
                autoComplete={"" + Math.random()}
              />
            </div>
            <div className="form-column">
              <TextInput
                label="Médecin Traitant"
                name="GP"
                {...form.getInputProps("GP")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Loisirs"
                name="hobbies"
                {...form.getInputProps("hobbies")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Numéro de sécurité sociale"
                name="SSNumber"
                {...form.getInputProps("SSNumber")}
                autoComplete={"" + Math.random()}
              />
            </div>
            <div className="form-column">
              <TextInput
                label="Mutuelle"
                name="healthInsurance"
                {...form.getInputProps("healthInsurance")}
                autoComplete={"" + Math.random()}
              />
              <TextInput
                label="Envoyé par"
                name="sentBy"
                {...form.getInputProps("sentBy")}
                autoComplete={"" + Math.random()}
              />
              <CheckboxGroup
                {...form.getInputProps("hand")}
                label="Préférence manuelle"
                style={{ marginTop: "5px" }}
              >
                <Checkbox value="gauche" label="Gauche" />
                <Checkbox value="droite" label="Droite" />
              </CheckboxGroup>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

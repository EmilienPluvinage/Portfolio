import { useState } from "react";
import "../styles/styles.css";
import { capitalize } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useGovData } from "./contexts/GovDataContext";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { Calendar } from "tabler-icons-react";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { moveToFirst } from "./Functions";
import NewAppointment from "./NewAppointment";

export default function NewPatient() {
  const navigate = useNavigate();
  var cities = useGovData().cities;
  var autoCompleteCities = cities.map(function (a) {
    return a.nom + " (" + a.codesPostaux[0] + ")";
  });
  moveToFirst(autoCompleteCities, "Saint-Clément-de-Rivière (34980)");
  moveToFirst(autoCompleteCities, "Paris (75001)");
  moveToFirst(autoCompleteCities, "Montpellier (34070)");
  moveToFirst(autoCompleteCities, "Teyran (34820)");
  moveToFirst(autoCompleteCities, "Assas (34820)");
  moveToFirst(autoCompleteCities, "Prades-le-Lez (34730)");
  moveToFirst(autoCompleteCities, "Saint-Vincent-de-Barbeyrargues (34730)");
  const [opened, setOpened] = useState(false);
  const token = useLogin().token;
  const PatientList = usePatients();
  const getPatients = useUpdatePatients();
  const [id, setId] = useState(0);
  const params = useParams();

  const form = useForm({
    initialValues: {
      lastname: "",
      firstname: "",
      birthday: "",
      sex: "",
      mobilephone: "",
      landline: "",
      email: "",
      address: "",
      city: "",
      comments: "",
      maritalStatus: "",
      numberOfChildren: 0,
      job: "",
      GP: "",
      hobbies: "",
      SSNumber: "",
      healthInsurance: "",
      sentBy: "",
      hand: "",
    },
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
          comments: patient.comments,
          maritalStatus: patient.maritalStatus,
          numberOfChildren: patient.numberOfChildren,
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
          comments: values.comments,
          maritalStatus: values.maritalStatus,
          numberOfChildren: values.numberOfChildren,
          job: values.job,
          GP: values.GP,
          hobbies: values.hobbies,
          SSNumber: values.SSNumber,
          healthInsurance: values.healthInsurance,
          sentBy: values.sentBy,
          hand: values.hand,
          token: token,
          id: id,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        getPatients(token);
        console.log(res.id);
        setId(res.id);
        showNotification({
          title:
            id !== 0 ? "Modification enregistrée" : "Nouveau patient ajouté",
          message: "La fiche de votre patient a bien été mise à jour.",
          color: "cyan",
        });
        navigate("/Nouveau-Patient/" + res.id);
      }
    } catch (e) {
      return e;
    }
  }

  function ClickOnNewPatient() {
    if (id === 0) {
      showNotification({
        title: "Attention",
        message:
          "Vous êtes déjà en train d'ajouter un nouveau patient et il n'a pas été enregistré. Enregistrez-le avant d'en ajouter un autre.",
      });
    } else {
      // message pour confirmer si pas sauvegardé un patient qu'on modifie (donc dont l'id n'est pas 0)
      navigate("/Nouveau-Patient");
    }
  }

  // for validation
  // pattern="0[0-9]{9}|\+[0-9]{11}"
  // pattern="0[0-9]{9}|\+[0-9]{11}"

  return (
    <>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={opened}
        onClose={() => setOpened(false)}
        title={"Consultation"}
        closeOnClickOutside={false}
      >
        <NewAppointment setOpened={setOpened} patientId={id} startingTime={0} />
      </Modal>
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <div className="nav-patient">
          <Button type="submit" style={{ margin: "10px" }}>
            Enregistrer
          </Button>
          <Button onClick={() => setOpened(true)} style={{ margin: "10px" }}>
            Consultation
          </Button>
          <Button style={{ margin: "10px" }}>Paiement</Button>

          <Button onClick={ClickOnNewPatient} style={{ margin: "10px" }}>
            Nouveau Patient
          </Button>
        </div>
        <h2>1 - État Civil du Patient</h2>
        <div className="main-content">
          <div className="new-patient">
            <div className="form-column">
              <TextInput
                label="Nom"
                name="lastname"
                {...form.getInputProps("lastname")}
                autoComplete="new-password"
                required
              />
              <TextInput
                label="Prénom"
                name="firstname"
                {...form.getInputProps("firstname")}
                autoComplete="new-password"
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
                autoComplete="new-password"
              />
              <TextInput
                label="Téléphone fixe"
                name="landline"
                {...form.getInputProps("landline")}
                autoComplete="new-password"
              />
              <TextInput
                label="Adresse e-mail"
                name="email"
                {...form.getInputProps("email")}
                size={"sm"}
                autoComplete="new-password"
              />
            </div>
            <div className="form-column">
              <Textarea
                label="Adresse postale"
                name="address"
                {...form.getInputProps("address")}
                autoComplete="new-password"
              />

              <Autocomplete
                label="Ville"
                name="city"
                placeholder="Saint-Vincent-de-Barbeyrargues (34730)"
                {...form.getInputProps("city")}
                data={autoCompleteCities}
              />
              <Textarea
                label="Remarques"
                name="comments"
                {...form.getInputProps("comments")}
              />
            </div>
          </div>
        </div>
        <h2>2 - Informations sur le Patient</h2>
        <div className="main-content">
          <div className="new-patient">
            <div className="form-column">
              <TextInput
                label="Statut Marital"
                name="maritalStatus"
                {...form.getInputProps("maritalStatus")}
                autoComplete="new-password"
              />
              <NumberInput
                label="Nombre d'enfants"
                name="numberOfChildren"
                {...form.getInputProps("numberOfChildren")}
                autoComplete="new-password"
              />
              <TextInput
                label="Profession / Scolarité"
                name="job"
                {...form.getInputProps("job")}
                autoComplete="new-password"
              />
            </div>
            <div className="form-column">
              <TextInput
                label="Médecin Traitant"
                name="GP"
                {...form.getInputProps("GP")}
                autoComplete="new-password"
              />
              <TextInput
                label="Loisirs"
                name="hobbies"
                {...form.getInputProps("hobbies")}
                autoComplete="new-password"
              />
              <TextInput
                label="Numéro de sécurité sociale"
                name="SSNumber"
                {...form.getInputProps("SSNumber")}
                autoComplete="new-password"
              />
            </div>
            <div className="form-column">
              <TextInput
                label="Mutuelle"
                name="healthInsurance"
                {...form.getInputProps("healhInsurance")}
                autoComplete="new-password"
              />
              <TextInput
                label="Envoyé par"
                name="sentBy"
                {...form.getInputProps("sentBy")}
                autoComplete="new-password"
              />
              <CheckboxGroup
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

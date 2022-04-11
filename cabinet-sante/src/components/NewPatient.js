import { useState, useEffect } from "react";
import "../styles/styles.css";
import { capitalize } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useGovData } from "./contexts/GovDataContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { Calendar } from "tabler-icons-react";

import {
  Autocomplete,
  TextInput,
  Button,
  Modal,
  Radio,
  RadioGroup,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { moveToFirst } from "./Functions";
import NewAppointment from "./NewAppointment";

export default function NewPatient() {
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
    },
  });
  console.log(form.values);
  useEffect(() => {
    // we prefill the fields if it's an update, leave them empty if it's an addition
    if (PatientList.length > 0) {
      if (params?.id !== undefined) {
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
          });
        }
      } else {
        form.reset();
      }
    }
  }, [params, PatientList]);

  async function submitForm(values) {
    console.log(values);
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
          token: token,
          id: id,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        getPatients(token);
        showNotification({
          title:
            id !== 0 ? "Modification enregistrée" : "Nouveau patient ajouté",
          message: "La fiche de votre patient a bien été mise à jour.",
          color: "cyan",
        });
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
          <Link className="text-link" to="/Nouveau-patient">
            <Button style={{ margin: "10px" }}>Nouveau Patient</Button>
          </Link>
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
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Statut Marital:</td>
                  <td className="td-input">
                    <input type="text" name="maritalStatus" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Nombre d'enfants:</td>
                  <td className="td-input">
                    <input type="number" name="numberOfChildren" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Profession / Scolarité:</td>
                  <td className="td-input">
                    <input type="text" name="job" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Médecin traitant</td>
                  <td className="td-input">
                    <input type="text" name="GP" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Loisirs</td>
                  <td className="td-input">
                    <input type="text" name="hobbies" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Numéro de sécurité sociale:</td>
                  <td className="td-input">
                    <input type="phone" pattern="[0-9]{13}" name="SSNumber" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone fixe:</td>
                  <td className="td-input">
                    <input type="phone" pattern="[0-9]{10}" name="landline" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Mutuelle:</td>
                  <td className="td-input">
                    <input type="text" name="healthInsurance" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Envoyé par:</td>
                  <td className="td-input">
                    <input type="text" name="sentBy" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Préférence Manuelle:</td>
                  <td className="td-input">
                    Gauche : <input type="checkbox" name="gauche" /> Droite :{" "}
                    <input type="checkbox" name="droite" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h2>3 - Antécédents</h2>
        <div className="main-content">
          <p>Remarques</p>
          <div className="new-patient">
            <table>
              <thead>
                <tr>
                  <th colSpan={2}>Actuellement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-label">
                    Maladie <input type="checkbox" name="check-maladie" />
                  </td>
                  <td className="td-input">
                    <input type="text" name="maladie" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">
                    Psychologie{" "}
                    <input type="checkbox" name="check-psychologie" />
                  </td>
                  <td className="td-input">
                    <input type="text" name="psychologie" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">
                    Traitement <input type="checkbox" name="check-traitement" />
                  </td>
                  <td className="td-input">
                    <input type="text" name="traitement" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="form-btn"></div>
      </form>
    </>
  );
}

import { useState, useEffect } from "react";
import "../styles/styles.css";
import { capitalize } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useParams } from "react-router-dom";
import InfoBox from "./InfoBox";

export default function NewPatient() {
  const [open, setOpen] = useState(false);
  const [infoText, setInfoText] = useState("");
  const token = useLogin().token;
  const PatientList = usePatients();
  const getPatients = useUpdatePatients();
  const [id, setId] = useState(0);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  const [mobilephone, setMobilePhone] = useState("");
  const [landline, setLandline] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [comments, setComments] = useState("");

  const params = useParams();

  useEffect(() => {
    // we prefill the fields if it's an update, leave them empty if it's an addition
    if (params?.id !== undefined && PatientList.length > 0) {
      var patient = PatientList.find(
        (e) => e.id.toString() === params.id.toString()
      );
      if (patient !== undefined) {
        setId(patient.id);
        setFirstname(patient.firstname);
        setLastname(patient.lastname);
        setBirthday(patient.birthday);
        setSex(patient.sex);
        setMobilePhone(patient.mobilephone);
        setLandline(patient.landline);
        setEmail(patient.email);
        setAddress(patient.address);
        setPostcode(patient.postcode);
        setCity(patient.city);
        setComments(patient.comments);
      }
    }
  }, [params, PatientList]);

  function handleChange(event, name) {
    switch (name) {
      case "firstname":
        setFirstname(capitalize(event.target.value));
        break;
      case "lastname":
        setLastname(capitalize(event.target.value));
        break;
      case "birthday":
        setBirthday(event.target.value);
        break;
      case "sex":
        setSex(event.target.value);
        break;
      case "mobilephone":
        setMobilePhone(event.target.value);
        break;
      case "landline":
        setLandline(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "address":
        setAddress(event.target.value);
        break;
      case "postcode":
        setPostcode(event.target.value);
        break;
      case "city":
        setCity(event.target.value);
        break;
      case "comments":
        setComments(event.target.value);
        break;
      default:
        break;
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    var link =
      "http://localhost:3001/" + (id === 0 ? "NewPatient" : "UpdatePatient");
    try {
      const fetchResponse = await fetch(link, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          birthday: birthday,
          sex: sex,
          mobilephone: mobilephone,
          landline: landline,
          email: email,
          address: address,
          postcode: postcode,
          city: city,
          comments: comments,
          token: token,
          id: id,
        }),
      });
      const res = await fetchResponse.json();
      getPatients(token);
      if (res.success) {
        setInfoText(
          id === 0
            ? "Patient ajouté avec succès."
            : "Patient modifié avec succès."
        );
        setOpen(true);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <div>
      <InfoBox text={infoText} open={open} setOpen={setOpen} />
      <form onSubmit={submitForm}>
        <div className="nav-patient">
          <div className="btn-patient" onClick={submitForm}>
            Enregistrer
          </div>
          <div className="btn-patient">Consultation</div>
          <div className="btn-patient">Paiement</div>
        </div>
        <h2>1 - État Civil du Patient{" " + firstname + " " + lastname}</h2>
        <div className="main-content">
          <div className="new-patient">
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Nom:</td>
                  <td className="td-input">
                    <input
                      type="text"
                      name="lastname"
                      value={lastname}
                      onChange={(e) => handleChange(e, "lastname")}
                      autoComplete="new-password"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Prénom:</td>
                  <td className="td-input">
                    <input
                      type="text"
                      name="firstname"
                      value={firstname}
                      onChange={(e) => handleChange(e, "firstname")}
                      autoComplete="new-password"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Date de naissance:</td>
                  <td className="td-input">
                    <input
                      type="date"
                      name="birthday"
                      value={birthday}
                      onChange={(e) => handleChange(e, "birthday")}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Genre:</td>
                  <td className="td-input">
                    <label>H</label>
                    <input
                      type="radio"
                      name="sex"
                      value="homme"
                      checked={sex === "homme" && "checked"}
                      onChange={(e) => handleChange(e, "sex")}
                      required
                    />
                    <label>F</label>
                    <input
                      type="radio"
                      name="sex"
                      value="femme"
                      checked={sex === "femme" && "checked"}
                      onChange={(e) => handleChange(e, "sex")}
                    />
                    <label>Autre</label>
                    <input
                      type="radio"
                      name="sex"
                      value="autre"
                      checked={sex === "autre" && "checked"}
                      onChange={(e) => handleChange(e, "sex")}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone portable:</td>
                  <td className="td-input">
                    <input
                      type="phone"
                      pattern="0[0-9]{9}|\+[0-9]{11}"
                      name="mobilephone"
                      onChange={(e) => handleChange(e, "mobilephone")}
                      autoComplete="new-password"
                      value={mobilephone}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone fixe:</td>
                  <td className="td-input">
                    <input
                      type="phone"
                      pattern="0[0-9]{9}|\+[0-9]{11}"
                      name="landline"
                      onChange={(e) => handleChange(e, "landline")}
                      autoComplete="new-password"
                      value={landline}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Adresse e-mail:</td>
                  <td className="td-input">
                    <input
                      type="email"
                      name="email"
                      onChange={(e) => handleChange(e, "email")}
                      autoComplete="new-password"
                      value={email}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Adresse postale:</td>
                  <td className="td-input">
                    <textarea
                      name="address"
                      onChange={(e) => handleChange(e, "address")}
                      autoComplete="new-password"
                      value={address}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Code postal:</td>
                  <td className="td-input">
                    <input
                      type="text"
                      pattern="[0-9]{5}"
                      name="postcode"
                      onChange={(e) => handleChange(e, "postcode")}
                      autoComplete="new-password"
                      value={postcode}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Ville:</td>
                  <td className="td-input">
                    <input
                      type="text"
                      name="city"
                      onChange={(e) => handleChange(e, "city")}
                      autoComplete="new-password"
                      value={city}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Remarques:</td>
                  <td className="td-input">
                    <textarea
                      name="comments"
                      onChange={(e) => handleChange(e, "comments")}
                      value={comments}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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
        <h2>5 - Ajouter une consultation aujourd'hui</h2>
        <div className="main-content">5</div>
        <div className="form-btn"></div>
      </form>
    </div>
  );
}

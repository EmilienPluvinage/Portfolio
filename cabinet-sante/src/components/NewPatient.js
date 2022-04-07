import { useState, useEffect } from "react";
import "../styles/styles.css";
import { capitalize } from "./Functions";
import { useLogin } from "./contexts/AuthContext";

export default function NewPatient({ defaultValue }) {
  const token = useLogin().token;
  const [errorMessage, setErrorMessage] = useState("");
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

  useEffect(() => {
    setFirstname("Emilien");
    setLastname("Pluvinage");
    setBirthday("1990-05-07");
    setMobilePhone("0766277595");
  }, []);

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
    try {
      const fetchResponse = await fetch("http://localhost:3001/NewPatient", {
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
        }),
      });
      const res = await fetchResponse.json();
      console.log(res);
    } catch (e) {
      return e;
    }
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <h2>1 - État Civil du Patient</h2>
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
                  <td
                    className="td-input"
                    onChange={(e) => handleChange(e, "sex")}
                  >
                    <label>H</label>
                    <input type="radio" name="sex" value="homme" required />
                    <label>F</label>
                    <input type="radio" name="sex" value="femme" />
                    <label>Autre</label>
                    <input type="radio" name="sex" value="autre" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone portable:</td>
                  <td className="td-input">
                    <input
                      type="phone"
                      pattern="[0-9]{10}"
                      name="mobilephone"
                      onChange={(e) => handleChange(e, "mobilephone")}
                      value={mobilephone}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone fixe:</td>
                  <td className="td-input">
                    <input
                      type="phone"
                      pattern="[0-9]{10}"
                      name="landline"
                      onChange={(e) => handleChange(e, "landline")}
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
        <div className="form-btn">
          <input type="submit" value="Ajouter" />
        </div>
      </form>
    </div>
  );
}

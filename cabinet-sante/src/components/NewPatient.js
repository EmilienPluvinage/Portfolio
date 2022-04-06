import "../styles/styles.css";
import LoadingBar from "./LoadingBar";

export default function NewPatient() {
  function submitForm(event) {
    event.preventDefault();
    console.log("OK");
  }
  return (
    <div>
      <form onSubmit={submitForm}>
        <h2>1 - État Civil du Patient</h2>
        <div className="main-content">
          <LoadingBar percentage={50} color={"skyblue"} />
          <div className="new-patient">
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Nom:</td>
                  <td className="td-input">
                    <input type="text" name="lastname" required />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Prénom:</td>
                  <td className="td-input">
                    <input type="text" name="firstname" required />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Date de naissance:</td>
                  <td className="td-input">
                    <input type="date" name="birthday" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Genre:</td>
                  <td className="td-input">
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
                    />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Téléphone fixe:</td>
                  <td className="td-input">
                    <input type="phone" pattern="[0-9]{10}" name="landline" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Adresse e-mail:</td>
                  <td className="td-input">
                    <input type="email" name="email" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Adresse postale:</td>
                  <td className="td-input">
                    <textarea name="address" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Code postal:</td>
                  <td className="td-input">
                    <input type="text" pattern="[0-9]{5}" name="postcode" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Ville:</td>
                  <td className="td-input">
                    <input type="text" name="city" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td className="td-label">Remarques:</td>
                  <td className="td-input">
                    <textarea name="comments" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <input type="submit" value="Ajouter" />
        </div>
        <h2>2 - Informations sur le Patient</h2>
        <div className="main-content">2</div>
        <h2>3 - Antécédents</h2>
        <div className="main-content">3</div>
        <h2>4 - Documents</h2>
        <div className="main-content">4</div>
        <h2>5 - Ajouter une consultation aujourd'hui</h2>
        <div className="main-content">5</div>
      </form>
    </div>
  );
}

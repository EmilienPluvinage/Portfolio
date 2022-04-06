import "../styles/styles.css";

export default function NewPatient() {
  return (
    <div>
      <form>
        <h2>1 - État Civil du Patient</h2>
        <div className="main-content">
          <p>
            Nom: <input type="text" name="lastname" />
          </p>
          <p>
            Prénom: <input type="text" name="firstname" />
          </p>
          <p>
            Date de naissance: <input type="text" name="birthday" />
          </p>
          <p>
            Genre: <input type="text" name="sexe" />
          </p>
          <p>
            Téléphone portable: <input type="text" name="mobilephone" />
          </p>
          <p>
            Téléphone fixe: <input type="text" name="landline" />
          </p>
          <p>
            Adresse e-mail: <input type="text" name="email" />
          </p>
          <p>
            Adresse postale: <textarea name="address"> </textarea>
          </p>
          <p>
            Code postal: <input type="text" name="postcode" />
          </p>
          <p>
            Ville: <input type="text" name="city" />
          </p>

          <p>
            Remarques:<textarea name="comments"> </textarea>
          </p>
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

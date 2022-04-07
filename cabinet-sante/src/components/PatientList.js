import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";

export default function PatientList() {
  const patients = usePatients();

  return (
    <div>
      <h2>Liste des Patients ({patients.length})</h2>
      <div className="main-content">
        {patients.map((patient) => (
          <p key={patient.id}>
            {patient.firstname} {patient.lastname} {patient.birthday}{" "}
            {patient.sex} {patient.mobilephone}
          </p>
        ))}
      </div>
    </div>
  );
}

import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Text } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

export default function ReminderWarnings() {
  // data from context
  const reminders = usePatients().reminders;
  const patients = usePatients().patients;

  return (
    <div>
      <h2>Rappels</h2>
      <div className="home-content">
        {reminders.length === 0 ? (
          <Text size="sm">Aucun rappel actuellement</Text>
        ) : (
          reminders.map((element) => (
            <Text size="sm" key={element.id}>
              <AlertCircle
                size={18}
                color="red"
                style={{ position: "relative", top: "4px", right: "5px" }}
              />
              {patients.find((e) => e.id === element.patientId)?.fullname}:{" "}
              <span style={{ fontWeight: 500 }}>{element.description}</span>
            </Text>
          ))
        )}
      </div>
    </div>
  );
}

import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Text } from "@mantine/core";

export default function ReminderWarnings() {
  // data from context
  const reminders = usePatients().reminders;
  const patients = usePatients().patients;

  return (
    <div>
      <h2>Rappels</h2>
      <div className="home-content">
        {reminders.map((element) => (
          <Text size="sm">
            {patients.find((e) => e.id === element.patientId)?.fullname}:{" "}
            {element.description}
          </Text>
        ))}
      </div>
    </div>
  );
}

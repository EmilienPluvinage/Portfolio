import { useState } from "react";
import { Button, Text, Textarea } from "@mantine/core";
import { Check, Plus, Trash } from "tabler-icons-react";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "./contexts/AuthContext";

export default function Reminders({ patientId }) {
  // data from context
  const token = useLogin().token;
  const reminders = usePatients().reminders.filter(
    (e) => e.patientId === patientId
  );
  const updateContext = useUpdatePatients().update;

  // controlled form values
  const [id, setId] = useState(patientId);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState("");

  // if we changed patient, we reset the form
  if (patientId !== id) {
    setId(patientId);
    setDescription("");
  }

  async function addReminder() {
    setLoading("loading");

    // we update the dabase
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/NewReminder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: patientId,
            description: description,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        // we clear the form, update the context and display a notification
        await updateContext(token);
        setDescription("");
        setLoading("");
        showNotification({
          title: "Nouveau rappel",
          message: "Le rappel a bien été ajouté.",
          color: "green",
          icon: <Check />,
        });
      }
    } catch (e) {
      return e;
    }
  }

  async function removeReminder(reminderId) {
    setLoading("loading");
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/RemoveReminder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: reminderId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        // we clear the form, update the context and display a notification
        await updateContext(token);
        setLoading("");
        showNotification({
          title: "Rappel Supprimé",
          message: "Le rappel a bien été supprimé.",
          color: "green",
          icon: <Check />,
        });
      }
    } catch (e) {
      return e;
    }
  }
  return (
    <>
      {patientId !== 0 && (
        <div className="form-column">
          <Text size="sm">Rappel(s)</Text>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Textarea
              style={{ flex: "1" }}
              label="Rappel"
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
            />
            <Button
              variant="outline"
              style={{ marginLeft: "5px", marginTop: "25px" }}
              onClick={addReminder}
              loading={loading}
            >
              <Plus size={16} />
            </Button>
          </div>
          {reminders.map((element) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                compact
                variant="outline"
                color="red"
                onClick={() => removeReminder(element.id)}
                style={{ margin: "5px" }}
              >
                <Trash size={18} />
              </Button>

              <Text
                size="sm"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              >
                {element.description}
              </Text>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

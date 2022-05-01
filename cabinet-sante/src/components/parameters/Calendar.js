import "../../styles/styles.css";
import styled from "styled-components";
import { Button, MultiSelect, NumberInput, Text } from "@mantine/core";
import { useConfig, useUpdateConfig } from "../contexts/ConfigContext";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import { useLogin } from "../contexts/AuthContext";
import { useEffect } from "react";

const Container = styled.div`
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 3px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export default function Calendar() {
  const token = useLogin().token;
  const parameters = useConfig().parameters;
  const [loading, setLoading] = useState("");
  const updateConfigData = useUpdateConfig();
  const [startingHour, setStartingHours] = useState(
    parseInt(parameters.find((e) => e.name === "startingHour")?.value)
  );

  const [finishingHour, setFinishingHour] = useState(
    parseInt(parameters.find((e) => e.name === "finishingHour")?.value)
  );

  const [daysOfTheWeek, setDaysOfTheWeek] = useState(
    parameters.length > 0
      ? JSON.parse(parameters.find((e) => e.name === "daysOfTheWeek")?.value)
      : []
  );

  useEffect(() => {
    if (parameters?.length > 0) {
      setStartingHours(
        parseInt(parameters.find((e) => e.name === "startingHour")?.value)
      );
      setFinishingHour(
        parseInt(parameters.find((e) => e.name === "finishingHour")?.value)
      );
      setDaysOfTheWeek(
        JSON.parse(parameters.find((e) => e.name === "daysOfTheWeek")?.value)
      );
    }
  }, [parameters]);

  const daysOfTheWeekList = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  async function updateParameterByName(value, name) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdateParameterByName",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            value: value,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      return res.success;
    } catch (e) {
      return e;
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    setLoading("loading");
    try {
      await updateParameterByName(startingHour, "startingHour");
      await updateParameterByName(finishingHour, "finishingHour");
      await updateParameterByName(
        JSON.stringify(daysOfTheWeek),
        "daysOfTheWeek"
      );
      showNotification({
        title: "Enregistré",
        message: "Les nouveaux paramètres ont bien été enregistrés",
        color: "green",
        icon: <Check />,
      });
    } catch (e) {
      return e;
    }

    updateConfigData(token);
    setLoading("");
  }

  return (
    <>
      <Container>
        <Text style={{ marginLeft: "10px", marginTop: "5px" }} size="sm">
          Paramètres de calendrier:
          <form onSubmit={submitForm}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "10px",
              }}
            >
              <Button
                loading={loading}
                style={{ marginTop: "25px" }}
                type="submit"
                variant="outline"
              >
                Enregistrer
              </Button>
              <NumberInput
                style={{ marginLeft: "10px" }}
                label="Heure de début"
                name="startingHour"
                value={startingHour}
                onChange={setStartingHours}
                precision={0}
                min={0}
                max={24}
                required
              />
              <NumberInput
                style={{ marginLeft: "10px" }}
                label="Heure de fin"
                name="finishingHour"
                value={finishingHour}
                onChange={setFinishingHour}
                precision={0}
                min={0}
                max={24}
                required
              />
              <MultiSelect
                style={{ marginLeft: "10px", marginRight: "10px" }}
                data={daysOfTheWeekList}
                label="Jours de la semaine à afficher"
                placeholder="Jours de la semaine"
                value={daysOfTheWeek}
                onChange={setDaysOfTheWeek}
                required
              />
            </div>
          </form>
        </Text>
      </Container>
    </>
  );
}

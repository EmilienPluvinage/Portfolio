import "../styles/styles.css";
import { useLogin } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { Table, TextInput, Checkbox, Button } from "@mantine/core";

export default function Parameters() {
  const token = useLogin().token;
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    async function getConfigData(token) {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/GetConfigData",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          setConfigData(res.data);
        }
      } catch (e) {
        return e;
      }
    }
    getConfigData(token);
  }, [token]);

  function setConfigData(data) {
    setAppointmentTypes(data.appointmentTypes);
  }

  function submitAppointmentForm(values) {
    console.log(values);
  }

  function handleAppointmentTypeChange(name, id, event) {
    console.log(event.target.value);

    var temp = appointmentTypes;
    var index = temp.findIndex((e) => e.id === id);
    switch (name) {
      case "type":
        temp[index].type = event.target.value;
        break;
      case "multi":
        temp[index].multi = event.target.value === "on" ? 0 : 1;
        break;
      default:
        break;
    }

    setAppointmentTypes(temp);
  }
  console.log(appointmentTypes[1]);
  return (
    <div>
      <h2>Types de consultations</h2>
      <div className="main-content">
        <form onSubmit={submitAppointmentForm}>
          <Table style={{ width: "fit-content" }}>
            <tbody>
              {appointmentTypes.map((e) => (
                <tr key={e.id + e.type}>
                  <td>
                    <Checkbox
                      checked={e.multi}
                      label="Collectif"
                      name={e.id + "-multi"}
                      onChange={(event) =>
                        handleAppointmentTypeChange("multi", e.id, event)
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      name={e.id + "-type"}
                      value={e.type}
                      onChange={(event) =>
                        handleAppointmentTypeChange("type", e.id, event)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button type="submit">Modifier</Button>
        </form>
      </div>
    </div>
  );
}

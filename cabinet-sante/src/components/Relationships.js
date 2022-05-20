import { useState } from "react";
import { Button, Select, Text } from "@mantine/core";
import { Check, Plus, Trash } from "tabler-icons-react";
import { useConfig } from "./contexts/ConfigContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "./contexts/AuthContext";

export default function Relationships({ patientId }) {
  // data from context
  const token = useLogin().token;
  const relationships = useConfig().relationships;
  const relatives = usePatients().relatives;
  const patients = usePatients().patients;
  const patientsList = patients
    .filter((e) => e.id !== patientId)
    .map((e) => {
      return e.fullname;
    });
  const updateContext = useUpdatePatients().update;

  // we define the list of availables relationships base on the patient sex
  const sex = patients.find((e) => e.id === patientId).sex;
  let relationshipsList = [];
  console.log(relationships);
  switch (sex) {
    case "homme":
      relationships.forEach((e) => {
        if (relationshipsList.findIndex((f) => f === e.parentM) === -1) {
          relationshipsList.push(e.parentM);
        }
        if (relationshipsList.findIndex((f) => f === e.childM) === -1) {
          relationshipsList.push(e.childM);
        }
      });
      break;
    case "femme":
      relationships.forEach((e) => {
        if (relationshipsList.findIndex((f) => f === e.parentF) === -1) {
          relationshipsList.push(e.parentF);
        }
        if (relationshipsList.findIndex((f) => f === e.childF) === -1) {
          relationshipsList.push(e.childF);
        }
      });
      break;
    case "autre":
      relationships.forEach((e) => {
        if (relationshipsList.findIndex((f) => f === e.parentF) === -1) {
          relationshipsList.push(e.parentF);
        }
        if (relationshipsList.findIndex((f) => f === e.childF) === -1) {
          relationshipsList.push(e.childF);
        }
        if (relationshipsList.findIndex((f) => f === e.parentM) === -1) {
          relationshipsList.push(e.parentM);
        }
        if (relationshipsList.findIndex((f) => f === e.childM) === -1) {
          relationshipsList.push(e.childM);
        }
      });
      break;
    default:
      break;
  }

  // controlled form values
  const [relative, setRelative] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState("");

  async function addRelationship() {
    setLoading("loading");
    const relativeId = patients.find((e) => e.fullname === relative)?.id;
    //  we need to find the relationship ID and whose the parent whose the child
    var relationshipId = 0;
    var parentId = 0;
    var childId = 0;
    relationships.forEach((e) => {
      if (e.parentM === relationship || e.parentF === relationship) {
        relationshipId = e.id;
        parentId = patientId;
        childId = relativeId;
      } else if (e.childM === relationship || e.childF === relationship) {
        relationshipId = e.id;
        childId = patientId;
        parentId = relativeId;
      }
    });

    // we update the dabase
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/NewRelative",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            childId: childId,
            patientId: parentId,
            relationshipId: relationshipId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        // we clear the form, update the context and display a notification
        await updateContext(token);
        setRelative("");
        setRelationship("");
        setLoading("");
        showNotification({
          title: "Nouveau lien de parenté",
          message: "Le lien de parenté a bien été ajouté.",
          color: "green",
          icon: <Check />,
        });
      }
    } catch (e) {
      return e;
    }
  }

  async function removeRelationship(relationshipId) {
    setLoading("loading");
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/RemoveRelative",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: relationshipId,
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
          title: "Lien de parenté supprimé",
          message: "Le lien de parenté a bien été supprimé.",
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
        <div className="new-patient" style={{ marginTop: "10px" }}>
          <div className="form-column">
            <Text size="sm">Liens de parenté</Text>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <Select
                style={{ width: "fit-content" }}
                limit={5}
                searchable
                clearable
                label="Patient"
                placeholder="Patient"
                data={patientsList}
                value={relative}
                onChange={setRelative}
              />
              <Select
                style={{ width: "fit-content" }}
                searchable
                clearable
                label="Lien"
                placeholder="Lien"
                data={relationshipsList}
                value={relationship}
                onChange={setRelationship}
              />
              <Button
                variant="outline"
                style={{ marginLeft: "5px", marginTop: "auto" }}
                onClick={addRelationship}
                loading={loading}
              >
                <Plus size={16} />
              </Button>
            </div>
            {relatives.map((element) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {(element.patientId === patientId ||
                  element.childId === patientId) && (
                  <Button
                    compact
                    variant="outline"
                    color="red"
                    onClick={() => removeRelationship(element.id)}
                    style={{ margin: "5px" }}
                  >
                    <Trash size={18} />
                  </Button>
                )}
                <Text
                  size="sm"
                  style={{ marginTop: "auto", marginBottom: "auto" }}
                >
                  {element.patientId === patientId
                    ? (sex === "homme"
                        ? relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.parentM
                        : sex === "femme"
                        ? relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.parentF
                        : relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.parentM +
                          "/" +
                          relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.parentF) +
                      " de " +
                      patients.find((f) => f.id === element.childId)?.fullname
                    : element.childId === patientId
                    ? (sex === "homme"
                        ? relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.childM
                        : sex === "femme"
                        ? relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.childF
                        : relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.childM +
                          "/" +
                          relationships.find(
                            (f) => f.id === element.relationshipId
                          )?.childF) +
                      " de " +
                      patients.find((f) => f.id === element.patientId)?.fullname
                    : null}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

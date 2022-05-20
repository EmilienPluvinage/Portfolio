import { useState } from "react";
import { Button, Select, Text } from "@mantine/core";
import { Check, Plus } from "tabler-icons-react";
import { useConfig } from "./contexts/ConfigContext";
import { usePatients } from "./contexts/PatientsContext";
import { showNotification } from "@mantine/notifications";

export default function Relationships({ patientId }) {
  // data from context
  const token = usePatients().token;
  const relationships = useConfig().relationships;
  const patients = usePatients().patients;
  const patientsList = patients
    .filter((e) => e.id !== patientId)
    .map((e) => {
      return e.fullname;
    });
  const updateContext = usePatients().update;

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
          </div>
        </div>
      )}
    </>
  );
}

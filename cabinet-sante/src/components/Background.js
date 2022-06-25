import "../styles/styles.css";
import { useConfig } from "./contexts/ConfigContext";
import { Button, Select, Text, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import { Check, Plus, Trash } from "tabler-icons-react";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";

export default function Background({ background, setBackground, patientId }) {
  // data from context
  const token = useLogin().token;
  const allPathologies = useConfig().pathologies;
  const pathologies = allPathologies.filter((element) => element.groupId === 0);
  const pathologies2 = allPathologies.filter(
    (element) => element.groupId !== 0
  );
  const hasPathologies = usePatients().pathologies;
  const updateContext = useUpdatePatients().update;
  const [pathology, setPathology] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState("");

  const data = pathologies2.map((element) => {
    return {
      value: element.id,
      group: element.name,
      label: element.pathology,
    };
  });

  useEffect(() => {
    let index = hasPathologies.findIndex((e) => e.pathologyId === pathology);
    if (index !== -1) {
      setDescription(hasPathologies[index].description);
    } else {
      setDescription("");
    }
  }, [pathology, hasPathologies]);

  function handleChange(pathologyId, description) {
    let tempBackground = background.slice(0);
    let index = background.findIndex((e) => e.pathologyId === pathologyId);
    if (index === -1) {
      tempBackground.push({
        pathologyId: pathologyId,
        description: description,
      });
    } else {
      tempBackground[index].description = description;
    }
    setBackground(tempBackground);
  }

  async function addBackground() {
    if (description !== "" && pathology !== 0) {
      setLoading("loading");
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/AddPathology",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              description: description,
              token: token,
              pathologyId: pathology,
              patientId: patientId,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          setLoading("");
          showNotification({
            title: "Nouvel antécédent",
            message: "L'antécédent a bien été ajouté.",
            color: "green",
            icon: <Check />,
          });
          await updateContext(token);
        }
      } catch (e) {
        return e;
      }
    }
  }
  async function removeOnePathology(pathology, patientId) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/RemovePathology",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            pathologyId: pathology,
            patientId: patientId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Antécédent supprimé",
          message: "L'antécédent a bien été supprimé.",
          color: "green",
          icon: <Check />,
        });
        await updateContext(token);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
      <h2>Antécédents</h2>
      <div className="main-content">
        <div className="new-patient">
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(0, 3)
              .map((element) => (
                <Textarea
                  label={element.pathology}
                  key={element.pathology}
                  onChange={(event) =>
                    handleChange(element.id, event.target.value)
                  }
                  value={
                    background.find((e) => e.pathologyId === element.id)
                      ?.description
                  }
                />
              ))}
          </div>
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(3, 6)
              .map((element) => (
                <Textarea
                  label={element.pathology}
                  key={element.pathology}
                  onChange={(event) =>
                    handleChange(element.id, event.target.value)
                  }
                  value={
                    background.find((e) => e.pathologyId === element.id)
                      ?.description
                  }
                />
              ))}
          </div>
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(6)
              .map((element) => (
                <Textarea
                  label={element.pathology}
                  key={element.pathology}
                  onChange={(event) =>
                    handleChange(element.id, event.target.value)
                  }
                  value={
                    background.find((e) => e.pathologyId === element.id)
                      ?.description
                  }
                />
              ))}
          </div>
        </div>
        {patientId !== 0 && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "20px",
              }}
            >
              <Select
                searchable
                clearable
                label="Ajouter un antécédent"
                placeholder="Pathologie"
                data={data}
                value={pathology}
                onChange={setPathology}
              />
              <Textarea
                style={{ marginRight: "5px", marginLeft: "5px", flex: 1 }}
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              <Button
                variant="outline"
                style={{ marginTop: "26px" }}
                onClick={addBackground}
                loading={loading}
              >
                {hasPathologies.find((e) => e.pathologyId === pathology) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}
              </Button>
            </div>
            {hasPathologies.map((pathology) => (
              <Text key={"pathology" + pathology.id}>
                <Button
                  compact
                  variant="outline"
                  color="red"
                  onClick={() =>
                    removeOnePathology(pathology.pathologyId, patientId)
                  }
                  style={{ margin: "5px" }}
                >
                  <Trash size={18} />
                </Button>
                {
                  allPathologies.find((e) => e.id === pathology.pathologyId)
                    ?.pathology
                }{" "}
                : {pathology.description}
              </Text>
            ))}
          </>
        )}
      </div>
    </>
  );
}

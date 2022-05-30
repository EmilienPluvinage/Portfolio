import "../styles/styles.css";
import { useConfig } from "./contexts/ConfigContext";
import { Textarea } from "@mantine/core";

export default function Background({ background }) {
  // data from context
  const pathologies = useConfig().pathologies;

  function handleChange(pathologyId, description) {
    let index = background.findIndex((e) => e.pathologyId === pathologyId);
    if (index === -1) {
      background.push({ pathologyId: pathologyId, description: description });
    } else {
      background[index].description = description;
    }
    console.log(background);
  }

  return (
    <>
      <h2>Antécédents</h2>
      <div className="main-content">
        <div className="new-patient">
          <div className="form-column">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      border: "1px solid lightgray",
                      background: "lightgray",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {pathologies.find((e) => e.groupId === 1)?.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pathologies
                  .filter((e) => e.groupId === 1)
                  .map((element) => (
                    <tr key={element.pathology}>
                      <td style={{ textAlign: "right" }}>
                        {element.pathology}
                      </td>
                      <td>
                        <Textarea
                          rows={1}
                          maxRows={1}
                          minRows={1}
                          style={{ lineHeight: "normal" }}
                          value={
                            background?.find(
                              (e) => e.pathologyId === element.id
                            )?.description
                          }
                          onChange={(event) =>
                            handleChange(element.id, event.currentTarget.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      border: "1px solid lightgray",
                      padding: "5px",
                      background: "lightgray",
                      borderRadius: "5px",
                    }}
                  >
                    {pathologies.find((e) => e.groupId === 5)?.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pathologies
                  .filter((e) => e.groupId === 5)
                  .map((element) => (
                    <tr key={element.pathology}>
                      <td style={{ textAlign: "right" }}>
                        {element.pathology}
                      </td>
                      <td>
                        <Textarea
                          rows={1}
                          maxRows={1}
                          minRows={1}
                          style={{ lineHeight: "normal" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="form-column">
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      border: "1px solid lightgray",
                      padding: "5px",
                      background: "lightgray",
                      borderRadius: "5px",
                    }}
                  >
                    {pathologies.find((e) => e.groupId === 6)?.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pathologies
                  .filter((e) => e.groupId === 6)
                  .map((element) => (
                    <tr key={element.pathology}>
                      <td style={{ textAlign: "right" }}>
                        {element.pathology}
                      </td>
                      <td>
                        <Textarea
                          rows={1}
                          maxRows={1}
                          minRows={1}
                          style={{ lineHeight: "normal" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="form-column">
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      border: "1px solid lightgray",
                      padding: "5px",
                      background: "lightgray",
                      borderRadius: "5px",
                    }}
                  >
                    {pathologies.find((e) => e.groupId === 7)?.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pathologies
                  .filter((e) => e.groupId === 7)
                  .map((element) => (
                    <tr key={element.pathology}>
                      <td style={{ textAlign: "right" }}>
                        {element.pathology}
                      </td>
                      <td>
                        <Textarea
                          rows={1}
                          maxRows={1}
                          minRows={1}
                          style={{ lineHeight: "normal" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="new-patient">
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(0, 3)
              .map((element) => (
                <Textarea label={element.pathology} />
              ))}
          </div>
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(3, 6)
              .map((element) => (
                <Textarea label={element.pathology} />
              ))}
          </div>
          <div className="form-column">
            {pathologies
              .filter((e) => e.groupId === 0)
              .slice(6)
              .map((element) => (
                <Textarea label={element.pathology} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

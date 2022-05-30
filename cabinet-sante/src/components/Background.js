import "../styles/styles.css";
import { useConfig } from "./contexts/ConfigContext";
import { Checkbox, Textarea } from "@mantine/core";

export default function Background() {
  // data from context
  const pathologies = useConfig().pathologies;

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
                    colSpan={3}
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
                        <Checkbox />
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
            <table>
              <thead>
                <tr>
                  <th
                    colSpan={3}
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
                        <Checkbox />
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
                    colSpan={3}
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
                        <Checkbox />
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
                    colSpan={3}
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
                        <Checkbox />
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

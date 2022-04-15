import React, { useEffect, useState } from "react";
import { useLogin } from "./contexts/AuthContext";
import { Pagination, Table, Button, Center } from "@mantine/core";
import { displayDate, displayTime } from "./Functions";
import { Search } from "tabler-icons-react";

export default function History({ patientId }) {
  const token = useLogin().token;
  const rowsPerPage = 10;
  const [historyData, setHistoryData] = useState([]);
  const numberOfPages =
    historyData.length > 0
      ? Math.floor(historyData.length / rowsPerPage) + 1
      : 1;
  const [activePage, setPage] = useState(1);

  useEffect(() => {
    async function getData() {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/GetHistory",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
              patientId: patientId,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          setHistoryData(res.data);
        }
      } catch (e) {
        return e;
      }
    }
    getData();
  }, [token, patientId]);

  return (
    <>
      <Center>
        <Pagination
          style={{ marginBottom: "20px" }}
          page={activePage}
          onChange={setPage}
          total={numberOfPages}
          size={"sm"}
        />
      </Center>
      <Table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{displayDate(new Date(event.start), true)}</td>
              <td>{displayTime(new Date(event.start))}</td>
              <td>{displayTime(new Date(event.end))}</td>
              <td>Type</td>
              <td>Prix</td>
              <td>
                <Button size="xs">
                  <Search size={18} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

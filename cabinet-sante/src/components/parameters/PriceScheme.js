import "../../styles/styles.css";
import { useLogin } from "../contexts/AuthContext";
import { useState } from "react";
import { useConfig, useUpdateConfig } from "../contexts/ConfigContext";
import { Button, Table } from "@mantine/core";
import { displayPrice } from "../Functions";
import { Pencil } from "tabler-icons-react";

export default function Parameters() {
  const token = useLogin().token;
  const updateConfigData = useUpdateConfig();
  const config = useConfig();

  const ths = (
    <tr>
      <th>Forfait</th>
      <th>Consultation</th>
      <th>Type de Patient</th>
      <th>Prix</th>
      <th>Modifier</th>
    </tr>
  );
  console.log(config);

  const rows = config.priceScheme.map((element) => (
    <tr key={element.id}>
      <td>
        {config.packages.find((e) => e.id === element.packageId)?.package}
      </td>
      <td>
        {
          config.appointmentTypes.find(
            (e) => e.id === element.appointmentTypeId
          )?.type
        }
      </td>

      <td>
        {config.patientTypes.find((e) => e.id === element.patientTypeId)?.type}
      </td>

      <td>{displayPrice(element.price)} €</td>

      <td>
        <Button leftIcon={<Pencil size={18} />} compact variant="outline">
          Modifier
        </Button>
      </td>
    </tr>
  ));

  console.log(rows);

  return (
    <>
      <Table striped verticalSpacing="xs">
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

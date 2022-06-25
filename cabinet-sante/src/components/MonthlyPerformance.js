import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { usePatients } from "./contexts/PatientsContext";

const COLORS = [
  "#15AABF",
  "#E64980",
  "#7950F2",
  "#82C91E",
  "#FAB005",
  "#228BE6",
];

export default function ChartDemo() {
  let data = [
    { name: "Janvier" },
    { name: "Février" },
    { name: "Mars" },
    { name: "Avril" },
    { name: "Mai" },
    { name: "Juin" },
    { name: "Juillet" },
    { name: "Août" },
    { name: "Septembre" },
    { name: "Octobre" },
    { name: "Novembre" },
    { name: "Décembre" },
  ];

  // Historical data exported from WebOsteo, from Jan 21 to May 22.
  const history = usePatients().historicalData;
  for (const element of history) {
    let thisDate = new Date(element.date);
    data[thisDate.getMonth()][thisDate.getFullYear()] = element.value / 100;
  }

  // Actual data from our own app, from Jun 22 onwards.

  return (
    <>
      <div style={{ width: "100%", height: 300 }}>
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="2021" stroke={COLORS[0]} />
          <Line type="monotone" dataKey="2022" stroke={COLORS[1]} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      </div>
    </>
  );
}

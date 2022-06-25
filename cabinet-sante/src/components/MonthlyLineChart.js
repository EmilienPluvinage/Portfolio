import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#15AABF",
  "#E64980",
  "#7950F2",
  "#82C91E",
  "#FAB005",
  "#228BE6",
];

export default function MonthlyLineChart({ data }) {
  return (
    <ResponsiveContainer aspect={3.5}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="2021" stroke={COLORS[0]} />
        <Line type="monotone" dataKey="2022" stroke={COLORS[1]} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="name"
          interval="preserveStartEnd"
          tickFormatter={(value) => value.slice(0, 3) + "."}
        />
        <YAxis
          tickFormatter={(value) =>
            new Intl.NumberFormat("fr").format(value) + " €"
          }
        />
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("fr").format(value) + " €"
          }
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

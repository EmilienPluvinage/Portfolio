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
  // looking for the keys in data. We expect "name" for our XAxis and then our dataKeys
  let keys = [];
  for (const element of data) {
    let tempKeys = Object.keys(element);
    for (const key of tempKeys) {
      if (key !== "name") {
        if (keys.findIndex((e) => e === key) === -1) {
          keys.push(key);
        }
      }
    }
  }

  return (
    <ResponsiveContainer aspect={3.5}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {keys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index]}
          />
        ))}
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

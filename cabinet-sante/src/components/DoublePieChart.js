import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {value}
    </text>
  );
};

export default function DoublePieChart({ data1, data2, colors }) {
  return (
    <ResponsiveContainer width={280} aspect={1}>
      <PieChart>
        <Pie
          data={data1}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={50}
          fill={colors[0]}
        >
          {data1.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Pie
          data={data2}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill={colors[1]}
          label={(label) => label.value.toFixed(0) + " €"}
        >
          {data1.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend
          payload={data1.map((item, index) => ({
            id: item.name,
            type: "square",
            value: `${item.name}`,
            color: colors[index % colors.length],
          }))}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "5px",
    maxWidth: "200px",
  },
}));

const shortenString = (str) => {
  if (str.length > 9) {
    return str.slice(0, 9) + "...";
  }
  return str;
};

const fakeData = [
  {
    name: "Page ABCDEFGHIGKLMONOP",
    qr: 4000,
  },
  {
    name: "Product B",
    qr: 3000,
  },
  {
    name: "Product C",
    qr: 2000,
  },
  {
    name: "Product D",
    qr: 2780,
  },
  {
    name: "Product E",
    qr: 1890,
  },
];

const VerticalBar = ({ data, xKey, yKey, barColor }) => {
  let shortNameData = data
    .sort((a, b) => a[yKey] - b[yKey])
    .map((item) => ({
      fullName: item[xKey],
      shortName: shortenString(item[xKey]),
      ...item,
    }));
  console.log(shortNameData);
  const clases = useStyles();
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      console.log("payload", payload);
      const fullName = payload[0].payload[yKey]; // Get the full[xKey]
      const sold = payload[0].payload[xKey]; // Get the full[xKey]

      return (
        <div className={clases.tooltip}>
          <p>{`${yKey}: ${fullName}`}</p>
          <p style={{ color: barColor }}>{`${xKey}: ${sold}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={shortNameData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fullName" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalBar;

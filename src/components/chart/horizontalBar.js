import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
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
  if (str.length > 7) {
    return str.slice(0, 7) + "...";
  }
  return str;
};

const fakeData = [
  {
    name: "Page ABCDEFGHIGKLMONOP",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function HorizontalBar({ data }) {
  const clases = useStyles();
  let shortNameData = data.map((item) => ({
    fullName: item.name,
    shortName: shortenString(item.name),
    ...item,
  }));
  console.log(shortNameData);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      const fullName = payload[0].payload.name; // Get the full name
      const spent = payload[0].payload.spent; // Get the full name

      return (
        <div className={clases.tooltip}>
          <p>{`Customer: ${fullName}`}</p>
          <p style={{ color: "#82ca9d" }}>{`Spent: ${spent}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={shortNameData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey="shortName" type="category" /> <XAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="spent" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

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

const data = [
  {
    name: "Product A",
    uv: 4000,
  },
  {
    name: "Product B",
    uv: 3000,
  },
  {
    name: "Product C",
    uv: 2000,
  },
  {
    name: "Product D",
    uv: 2780,
  },
  {
    name: "Product E",
    uv: 1890,
  },
];

const VerticalBar = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uv" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalBar;

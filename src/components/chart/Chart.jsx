import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fakeData = [
  { month: "January", sale: 1700, purchase: 1200 },
  { month: "February", sale: 1600, purchase: 2100 },
  { month: "March", sale: 800, purchase: 800 },
  { month: "April", sale: 2100, purchase: 1600 },
  { month: "May", sale: 900, purchase: 900 },
  { month: "June", sale: 500, purchase: 1700 },
];

const Chart = ({ aspect, title, data }) => {
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart data={fakeData}>
          <defs>
            <linearGradient id="gradientSale" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#75ec7f" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#75ec7f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientPurchase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fffa6a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fffa6a" stopOpacity={0} />
            </linearGradient>{" "}
          </defs>
          <XAxis dataKey="month" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="purchase"
            stroke="#fffa6a"
            fillOpacity={1}
            fill="url(#gradientPurchase)"
          />
          <Area
            type="monotone"
            dataKey="sale"
            stroke="#75ec7f"
            fillOpacity={1}
            fill="url(#gradientSale)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

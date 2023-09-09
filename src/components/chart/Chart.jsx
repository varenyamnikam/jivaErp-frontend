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

const data = [
  { name: "January", Sale:1700,Purchase: 1200 },
  { name: "February", Sale:1600,Purchase: 2100 },
  { name: "March", Sale:800,Purchase: 800 },
  { name: "April", Sale:2100,Purchase: 1600 },
  { name: "May", Sale:900,Purchase: 900 },
  { name: "June", Sale:500,Purchase: 1700 },
];

const Chart = ({ aspect, title }) => {
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart data={data}>
          <defs>
          <linearGradient id="gradientSale" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#75ec7f" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#75ec7f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientPurchase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fffa6a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fffa6a" stopOpacity={0} />
            </linearGradient>          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Purchase"
            stroke="#fffa6a"
            fillOpacity={1}
            fill="url(#gradientPurchase)"  
          />
          <Area
            type="monotone"
            dataKey="Sale"
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

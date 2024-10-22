import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Route, Redirect } from "react-router-dom";
import Config from "../../Utils/Config";
import { Link, NavLink } from "react-router-dom";
import { Grid } from "@mui/material";

function numberWithCommas(number) {
  // Use toLocaleString to add commas as thousands separators
  return Math.abs(number).toLocaleString();
}

const Widget = ({ type, value }) => {
  let data;

  //temporary
  const diff = 20;
  function onClick(e) {
    const data = e.target.getAttribute("value");
    localStorage.setItem("screenCode", "User Master");
    console.log(e.target, data);
    // if (data == "USER") {
    //   window.location = "/Admin/UserMaster";
    //   // <Redirect to="/Admin/UserMaster" />;
    // }
  }
  switch (type) {
    case "payment":
      data = {
        amount: value,
        title: "PAYMENTS",
        isMoney: true,
        color: { backgroundColor: "#faa9ac" },
        link: "/Admin/UserMaster",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };

      break;
    case "purchase":
      data = {
        amount: value,
        title: "PURCHASE",
        isMoney: true,
        link: "/PurchaseReport/PVReport",
        color: { backgroundColor: "#fffa6a" },
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };

      break;
    case "sale":
      data = {
        amount: value,
        title: "SALE",
        isMoney: true,
        color: { backgroundColor: "#75ec7f" },
        link: "/SaleReport/SaleRegister",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              color: "green",
            }}
          />
        ),
      };
      break;
    case "receipt":
      data = {
        amount: value,
        title: "RECIEPT",
        isMoney: true,
        color: { backgroundColor: "#88fff9" },
        link: "/Admin/UserMaster",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <Link
      to={data.link}
      className="widget"
      value={data.title}
      onClick={onClick}
      style={data.color}
    >
      <Grid container>
        <Grid Item xs={9} sm={9}>
          <span className="title">
            {data.icon} {data.title}
          </span>
        </Grid>

        <Grid
          Item
          xs={12}
          sm={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <span className="counter">
            {data.isMoney && "₹"} {numberWithCommas(data.amount)}
          </span>
        </Grid>
      </Grid>
    </Link>
  );
};

export default Widget;
// <div className="widget">
// <div className="left">
//   <span className="title">
//     {data.icon} {data.title}
//   </span>
// <span className="counter">
//   {data.isMoney && "$"} {amount}
// </span>
//   <span className="link">{data.link}</span>
// </div>
// <div></div>
// <div className="right">
// <div className="percentage positive">
//   <KeyboardArrowUpIcon />
//   {diff} %
// </div>
// </div>
// </div>
//         // <span className="link">{data.link}</span>
// data = {
//   title: "ORDERS",
//   isMoney: false,
//   // link: "View all orders",
//   color: { backgroundColor: "#fffa6a" },

//   link: "ORDERS",
//   icon: (
//     <ShoppingCartOutlinedIcon
//       className="icon"
//       style={{
//         backgroundColor: "rgba(218, 165, 32, 0.2)",
//         color: "goldenrod",
//       }}
//     />
//   ),
// };
// data = {
//   title: "USERS",
//   color: { background: "#fa989c" },
//   isMoney: false,
//   // link: <a href="/Admin/UserMaster">USERS</a>,
//   link: "USERS",
//   icon: (
// <PersonOutlinedIcon
//   className="icon"
//   style={{
//     color: "crimson",
//     backgroundColor: "rgba(255, 0, 0, 0.2)",
//   }}
// />
//   ),
// };
//////////////////////////////v2/////////////////////////////
// <div className="left" style={{ margin: "0px" }}>
// <span className="title" style={{ color: "black" }}>
//   {data.icon} {data.title}
// </span>
// </div>
// <div className="middle">
// <span className="counter" style={{ color: "black" }}>
//   {data.isMoney && "$"} {amount}
// </span>
// </div>
// <div className="right">
// <div
//   className="percentage positive"
//   value={data.title}
//   onClick={onClick}
// >
//   <KeyboardArrowUpIcon />
//   {diff} %
// </div>
// </div>

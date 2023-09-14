// import "./home.scss";
import { useState } from "react";
import "../../components/home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import Circle from "../../components/circularProgress";
import { Grid } from "@material-ui/core";
import VerticalBar from "../../components/chart/VerticalBar";
import HorizontalBar from "../../components/chart/horizontalBar";
import { Typography } from "@mui/material";
import * as roleService from "../../services/roleService";
import Config from "../../Utils/Config";
import { NotifyMsg } from "../../components/notificationMsg";
import Notification from "../../components/Notification";
import AuthHandler from "../../Utils/AuthHandler";

const Home = ({ startDate, endDate, loading, setLoading }) => {
  const [common, setCommon] = useState({
    purchase: 0,
    sale: 0,
    payment: 0,
    receipt: 0,
    purcAndSaleGraph: [],
    topProds: [],
    topCustomers: [],
    latestVouDocs: [],
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const user = AuthHandler.getUser();
  const settings = AuthHandler.getSettings();
  let useBatch = settings.userBatchNo;

  console.log(settings.purchaseLedger, settings.saleLedger);
  const companyDetails = {
    startDate: startDate,
    endDate: endDate,
    purcAcCode: settings.purchaseLedger.qrTotalCode,
    saleAcCode: settings.saleLedger.qrTotalCode,
    userCompanyCode: user.userCompanyCode,
    yearStart: new Date("04/01/23 GMT+0530"),
    branchCode: user.currentBranchCode,
    yearCode: user.currentYearCode,
  };
  if (loading) {
    const handleRes = (res) => {
      console.log(res);
      res.data && setCommon(res.data);
    };
    const url = Config().dashboardUrl;
    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.error(err);
    };
    roleService.axiosPut(url, companyDetails, handleRes, handleErr, () => {
      setLoading(false);
    });
  }
  return (
    <>
      <div className="homeContainer">
        <div className="widgets">
          <Grid container spacing={1} style={{ display: "flex", flexGrow: 1 }}>
            <Grid item xs={12} sm={3}>
              <Widget type="purchase" value={common.purchase} />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Widget type="sale" value={common.sale} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Widget type="payment" value={common.payment} />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Widget type="receipt" value={common.receipt} />
            </Grid>
          </Grid>
        </div>
        <div className="charts">
          <Grid container spacing={2} style={{ display: "flex", flexGrow: 1 }}>
            <Grid item xs={12} sm={12} style={{ marginTop: "20px" }}>
              <Chart
                title="Last 6 Months (Revenue)"
                aspect={5}
                data={common.purcAndSaleGraph}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                boxShadow: "2px 4px 10px 1px rgba(201, 201, 201, 0.47)",
              }}
            >
              <Typography style={{ margin: "10px", marginBottom: "0px" }}>
                Popular Products-
              </Typography>
              <VerticalBar
                data={common.topProds}
                xKey={"name"}
                barColor="#8884d8"
                yKey={"sold"}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              style={{
                boxShadow: "2px 4px 10px 1px rgba(201, 201, 201, 0.47)",
              }}
            >
              <Typography style={{ margin: "10px", marginBottom: "0px" }}>
                Top Customers -
              </Typography>
              <VerticalBar
                data={common.topCustomers}
                xKey={"name"}
                barColor="#82ca9d"
                yKey={"spent"}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <div className="listContainer">
                <div className="listTitle">Latest Transactions</div>
                <Table data={common.latestVouDocs} />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

export default Home;
// <>
// <div className="home">
// <div className="homeContainer">

//   <div className="widgets">
// <Widget type="user" />
// <Widget type="order" />
// <Widget type="earning" />
// <Widget type="balance" />
//   </div>
//   <div className="charts">
// <Featured />
// <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
//   </div>
//   <div className="listContainer">
//     <div className="listTitle">Latest Transactions</div>
//     <Table />
//   </div>
// </div>
// </div>
// </>
// <Grid container spacing={2} style={{ display: "flex", flexGrow: 1 }}>
//
// <Grid item xs={12} sm={4}>
//   <Featured />
// </Grid>
// <Grid item xs={12} sm={8}>
//   <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
// </Grid>
// </Grid>
// <Grid container spacing={2} style={{ display: "flex", flexGrow: 1 }}>
// <Grid item xs={12} sm={3}>
//   <Widget type="user" />
// </Grid>
// <Grid item xs={12} sm={3}>
//   <Widget type="order" />
// </Grid>
// <Grid item xs={12} sm={3}>
//   <Widget type="earning" />
// </Grid>
// <Grid item xs={12} sm={3}>
//   <Widget type="balance" />
// </Grid>
// </Grid>

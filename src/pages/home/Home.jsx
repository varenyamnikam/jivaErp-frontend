// import "./home.scss";
import "../../components/home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import Circle from "../../components/circularProgress";
import { Grid } from "@material-ui/core";

const Home = () => {
  return (
    <>
      <div className="homeContainer">
        <div className="widgets">
          <Grid container spacing={1} style={{ display: "flex", flexGrow: 1 }}>
            <Grid item xs={12} sm={3}>
              <Widget type="user" />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Widget type="order" />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Widget type="earning" />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Widget type="balance" />
            </Grid>
          </Grid>
        </div>
        <div className="charts">
          <Grid container spacing={2} style={{ display: "flex", flexGrow: 1 }}>
            <Grid item xs={12} sm={4}>
              <Featured />
            </Grid>
            <Grid item xs={12} sm={8} style={{ marginTop: "20px" }}>
              <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
            </Grid>
          </Grid>
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
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

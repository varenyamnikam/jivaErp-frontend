import React from "react";
import AuthHandler from "../Utils/AuthHandler";
import { Paper, Card, Typography, makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fdfdff",
  },
  pageHeader: {
    padding: theme.spacing(1),
    paddingBottom: "0",

    display: "flex",
    zIndex: 1,
  },
  pageIcon: {
    display: "inline-block",
    paddingleft: theme.spacing(4),
    color: "#3c44b1",
    height: "40px",
  },
}));

export default function PageHeader(props) {
  const user = AuthHandler.getUserName();

  const classes = useStyles();
  const { title, icon } = props;
  console.log(title);
  return (
    <>
      <section className="content-header" style={{ padding: "0px" }}>
        <div className={classes.pageHeader}>
          <Card className={classes.pageIcon}>{icon}</Card>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div className={classes.pageTitle}>
            <h3>{title}</h3>
          </div>
          <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
            <span className="dropdown-header">
              Welcome{" "}
              <b>
                <span id="lblLoginUName">{user}!</span>
              </b>
            </span>
          </ul>
        </div>
      </section>
    </>
  );
}
<section className="content-header">
  <div className="container-fluid">
    <h2>Branch Master</h2>
  </div>
</section>;

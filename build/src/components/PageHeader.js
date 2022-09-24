import React from 'react'
import AuthHandler from "../Utils/AuthHandler";
import { Paper, Card, Typography, makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fdfdff'
    },
    pageHeader: {
        padding: theme.spacing(1),
        display: 'flex',
        marginBottom: theme.spacing(1),
        zIndex: 1,
    },
    pageIcon: {
        display: 'inline-block',
        paddingleft: theme.spacing(4),
        color: '#3c44b1'
    }
}))

export default function PageHeader(props) {
    const user = AuthHandler.getUserCode();

    const classes = useStyles();
    const { title, icon } = props;
    console.log(title);
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <Paper elevation={0} square className={classes.root}>
                    <div className={classes.pageHeader}>
                        <Card className={classes.pageIcon}>
                            {icon}
                        </Card>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className={classes.pageTitle}>
                            <Typography
                                variant="h4"
                                component="div">
                                {title}</Typography>
                        </div>
                    </div>
                </Paper>
            </ul>

            <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
                <span className="dropdown-header">Welcome <b><span id="lblLoginUName">{user}!</span></b></span>
            </ul>


        </nav >
    )
}

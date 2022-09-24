import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  table: {
    // marginTop: theme.spacing(1),
    borderRight: "1px solid rgba(0,0,0,0.2)",
  },
}));

export default function useTableCell() {
  const classes = useStyles;
  const TableCell = (props) => (
    <TableCell className={classes.table} size="small">
      {props.children}
    </TableCell>
  );
  return {
    TableCell,
  };
}

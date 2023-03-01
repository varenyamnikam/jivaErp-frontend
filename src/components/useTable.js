import React, { useState, useCallback } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Pagination from "@mui/material/Pagination";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    // overflow: "hidden",
    // "&:hover::-webkit-scrollbar-thumb": {
    //   opacity: 0,
    // },
    // "&::-webkit-scrollbar": {
    //   width: 10,
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: theme.palette.grey[500],
    //   borderRadius: 15,
    //   opacity: 1,
    //   transition: "opacity 0.3s",
    // },
    // "&::-webkit-scrollbar-thumb:hover": {
    //   backgroundColor: theme.palette.grey[300],
    // },
  },
  table: {
    // marginTop: theme.spacing(1),

    "& thead th": {
      fontWeight: "600",
      color: theme.palette.primary.main,
      backgroundColor: "#e2e9f3",
    },
    "& tbody td": {
      fontWeight: "300",
      fontSize: "16px",
      padding: "3px",
      // "&:nth-of-type(odd)": {
      //   backgroundColor: "red",
      // },
    },
    "& tbody tr": {},
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      // backgroundColor: "red",
      cursor: "pointer",
    },
    "& .MuiTableCell-root": {
      borderRight: "1px solid rgba(0,0,0,0.2)",
    },
    border: "1px solid rgba(0,0,0,0.2)",
  },
}));

export default function useTable(records, headCells, filterFn) {
  const classes = useStyles();

  const pages = [10, 25, 50, 100, 500];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  ////////////////////////////////////////////////////
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
    let arr = [];
    for (let i = 0; i < Math.ceil(count / rowsPerPage); i++) {
      arr[i] = i + 1;
    }
    const handleFirstPageButtonClick = (event) => {
      console.log(event);
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      console.log(event);
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      console.log(event);
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      console.log(event);
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "20px",
          margin: "10px",
        }}
      >
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        {arr.map((item, index) => {
          const getColor = index == page ? true : false;
          console.log(getColor, index, page);
          return (
            <IconButton
              style={{
                fontSize: "20px",
                color: { getColor },
                backgroundColor: { getColor },
                width: "20px",
              }}
              onClick={(e) => {
                onPageChange(e, index);
              }}
              disabled={getColor}
            >
              {item}
            </IconButton>
          );
        })}
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  /////////////////////////////////////////////////////////
  const TblContainer = (props) => (
    <TableContainer
      sx={{ maxHeight: 440, paddingRight: "1px" }}
      className={classes.container}
    >
      <Table
        className={classes.table}
        size="small"
        stickyHeader
        sx={{ maxHeight: 440 }}
      >
        {props.children}
      </Table>
    </TableContainer>
  );
  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const TblHead = (props) => {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              // sortDirection={orderBy === headCell.id ? order : false}
              style={{
                borderRight: "1px solid rgba(0,0,0,0.2)",
              }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log(
  //   page,
  //   Math.ceil(Math.ceil(records.length / rowsPerPage) / rowsPerPage) - 1
  // );
  // console.log(Math.ceil(records.length / rowsPerPage));

  function getCount() {
    return Math.ceil(records.length / rowsPerPage);
  }
  const TblPagination = () => (
    <TablePagination
      style={{
        display: "flex",
        justifyContent: "flex-end",
        fontSize: "14px",
      }}
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={records.length}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );

  function stableSort(array, comparator) {
    console.log(array);
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  useCallback(() => {}, [records]);

  function recordsAfterPagingAndSorting() {
    console.log(filterFn.fn(records));
    return stableSort(
      filterFn.fn(records),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }

  const recordsAfterAndSorting = () => {
    console.log(filterFn.fn(records));
    return stableSort(filterFn.fn(records), getComparator(order, orderBy));
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  };
}

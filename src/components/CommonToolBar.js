import React, { useEffect, useState, useMemo } from "react";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";
import Controls from "./controls/Controls";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "./public.css";
import ClearIcon from "@mui/icons-material/Clear";
import Excel from "./useExcel";
import Print from "./print";
import MultipleSelectCheckmarks from "./multiSelect";
import Filter from "./filterButton";
import { Search } from "@material-ui/icons";
export default function CmnToolBar({
  filter,
  handleFilter,
  filterIcon,
  setFilterPopup,
  setFilter,
  setFilterFn,
  setFilterIcon,
  initialFilterValues,
  setRefresh,
  initialFilterFn,
  buttonText,
  TblContainer,
  TblHead,
  TblPagination,
  headCells,
  recordsAfterSorting,
  headcells,
  setheadcells,
  initialHeadCells,
  selected,
  setSelected,
}) {
  return (
    <>
      {" "}
      <Toolbar>
        <Grid container style={{ display: "flex", flexGrow: 1 }}>
          <Grid
            item
            xs={8}
            sm={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Controls.Input
              label="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: filter.allFields && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setFilter(initialFilterValues);
                        setFilterFn({
                          fn: (items) => {
                            return items;
                          },
                        });
                      }}
                      style={{ boxShadow: "none" }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={filter.allFields}
              onChange={handleFilter}
            />
          </Grid>{" "}
          <Grid
            item
            sm={1}
            xs={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Filter
              filterIcon={filterIcon}
              setFilterPopup={setFilterPopup}
              setFilter={setFilter}
              setFilterFn={setFilterFn}
              setFilterIcon={setFilterIcon}
              initialFilterValues={initialFilterValues}
              setRefresh={setRefresh}
              initialFilterFn={initialFilterFn}
            />
          </Grid>
          <Grid
            item
            sm={3}
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid container style={{ width: "100%" }}>
              <Excel
                buttonText={buttonText}
                TblContainer={TblContainer}
                TblHead={TblHead}
                TblPagination={TblPagination}
                headCells={headCells}
                recordsAfterSorting={recordsAfterSorting}
              />
              <Print
                buttonText={buttonText}
                TblContainer={TblContainer}
                TblHead={TblHead}
                TblPagination={TblPagination}
                headCells={headcells}
                recordsAfterSorting={recordsAfterSorting}
              />
              <MultipleSelectCheckmarks
                headcells={headcells}
                setheadcells={setheadcells}
                initialHeadCells={initialHeadCells}
                selected={selected}
                setSelected={setSelected}
              />
            </Grid>{" "}
          </Grid>
        </Grid>
      </Toolbar>{" "}
    </>
  );
}

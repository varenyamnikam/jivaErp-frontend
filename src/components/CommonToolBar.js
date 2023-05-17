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
  title,
  filter,
  handleFilter,
  setFilterPopup,
  setFilter,
  setFilterFn,
  initialFilterValues,
  buttonText,
  headCells,
  recordsAfterSorting,
  headcells,
  setheadcells,
  selected,
  setSelected,
  filterFields,
  tableContent = <></>,
  additionalComponent = () => <></>,
}) {
  return (
    <>
      {" "}
      <Toolbar>
        <Grid container style={{ display: "flex", flexGrow: 1 }}>
          <Grid
            item
            xs={12}
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
            <Filter setFilterPopup={setFilterPopup} />
          </Grid>
          <Grid
            item
            sm={3}
            xs={8}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid container style={{ width: "100%" }}>
              <Excel
                buttonText="Export Data to Excel"
                title={title}
                headCells={headcells}
                recordsAfterSorting={recordsAfterSorting}
                filterFields={filterFields}
                filter={filter}
              />
              <Print
                title={title}
                buttonText="Export Data to Excel"
                headCells={headcells}
                recordsAfterSorting={recordsAfterSorting}
                filterFields={filterFields}
                filter={filter}
                tableContent={tableContent}
              />
              <MultipleSelectCheckmarks
                headcells={headcells}
                setheadcells={setheadcells}
                initialHeadCells={headCells}
                selected={selected}
                setSelected={setSelected}
              />
            </Grid>{" "}
          </Grid>
          {additionalComponent()}
        </Grid>
      </Toolbar>{" "}
    </>
  );
}

import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FilterPopup from "./filterPopup";

export default function Filter(props) {
  const {
    filterIcon,
    setFilterPopup,
    setFilter,
    setFilterFn,
    setFilterIcon,
    initialFilterValues,
    setRefresh,
    initialFilterFn,
  } = props;

  return (
    <>
      <IconButton
        size="large"
        onClick={() => {
          setFilterPopup(true);
          // setFilter(initialFilterValues);
        }}
        style={{
          borderRadius: 5,
          padding: "7px",
        }}
      >
        <FilterAltOutlinedIcon color="success" />
      </IconButton>
    </>
  );
}
// {filterIcon ? (
//   <>
//     <IconButton
//       size="large"
//       onClick={() => {
//         setFilterPopup(true);
//         setFilter(initialFilterValues);
//       }}
//       style={{
//         borderRadius: 5,
//         padding: "7px",
//       }}
//     >
//       <FilterAltOutlinedIcon color="success" />
//     </IconButton>
//   </>
// ) : (
//   <>
//     <IconButton
//       size="large"
//       onClick={() => {
//         setFilterIcon(true);
//         setFilter(initialFilterValues);
//         setFilterFn({
//           fn: (items) => items,
//         });
//         setRefresh(true);
//       }}
//       style={{
//         borderRadius: 5,
//         padding: "7px",
//       }}
//     >
//       <FilterAltOffOutlinedIcon color="error" />
//     </IconButton>
//   </>
// )}

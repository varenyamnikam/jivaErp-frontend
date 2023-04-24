import React, { useEffect, useState } from "react";
import Controls from "./Controls";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
export default function EditButton({ handleClick }) {
  return (
    <Controls.ActionButton color="primary" onClick={handleClick}>
      <EditOutlinedIcon
        fontSize="small"
        style={{
          height: "18px",
          width: "18px",
          margin: "2px",
        }}
      />
    </Controls.ActionButton>
  );
}

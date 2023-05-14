import React, { useEffect, useState } from "react";
import Controls from "./Controls";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
export default function DeleteButton({
  setConfirmDialog = () => {},
  handleConfirm = () => {},
  directDelete = () => {},
}) {
  return (
    <Controls.ActionButton
      color="secondary"
      onClick={(e) => {
        setConfirmDialog({
          isOpen: true,
          title: "Are you sure to delete this record?",
          subTitle: "You can't undo this operation",
          onConfirm: (e) => {
            handleConfirm(e);
            e.preventDefault();
          },
        });
        directDelete();
      }}
    >
      <DeleteIconOutline
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

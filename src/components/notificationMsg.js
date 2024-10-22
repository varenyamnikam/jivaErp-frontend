export function NotifyMsg(code, callback = () => {}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const userCode = user.userCode;
  const successMsg = {
    isOpen: true,
    message: "Entry inserted successFully",
    type: "success",
  };
  const updateMsg = {
    isOpen: true,
    message: "Entry updated successFully",
    type: "success",
  };
  const deletedMsg = {
    isOpen: true,
    message: "Entry deleted successFully",
    type: "warning",
  };

  const errMsg = {
    isOpen: true,
    message: "Unable to connect to servers",
    type: "warning",
  };
  const emptyMsg = {
    isOpen: true,
    message: "#",
    type: "warning",
  };
  const unknownMsg = {
    isOpen: true,
    message: "Something went wrong plz try again",
    type: "warning",
  };
  const addMsg = {
    isOpen: true,
    message: `usercode: ${userCode} doesnt have right to add for this screen`,
    type: "warning",
  };

  const editMsg = {
    isOpen: true,
    message: `usercode: ${userCode} doesnt have right to edit for this screen`,
    type: "warning",
  };
  const deleteMsg = {
    isOpen: true,
    message: `usercode: ${userCode} doesnt have right to delete for this screen`,
    type: "warning",
  };

  const stockReducedMsg = {
    isOpen: true,
    message: "Out of Stock",
    type: "warning",
  };
  const whatsapp = {
    isOpen: true,
    message: "Pdf sent successFully",
    type: "success",
  };

  console.log(code);
  //stockConversion
  //transaction
  if (code === 1) return successMsg;
  else if (code === 2) return updateMsg;
  else if (code === 3) return deletedMsg;
  else if (code === 4) return errMsg;
  else if (code === 5) return unknownMsg;
  else if (code === 6) return addMsg;
  else if (code === 7) return editMsg;
  else if (code === 8) return deleteMsg;
  else if (code === 9) return stockReducedMsg;
  else if (code === 10) return whatsapp;
  else return emptyMsg;
}

import { NotifyMsg } from "../../components/notificationMsg";
import AuthHandler from "../../Utils/AuthHandler";

export default function validateParty(
  fieldValues,
  errors,
  setErrors,
  setNotify,
  vouExists
) {
  console.log(fieldValues);
  let temp = { ...errors };
  function check(key) {
    if (key in fieldValues)
      temp[key] = fieldValues[key] ? "" : "This field is required.";
  }
  check("vouDate");
  check("partyCode");
  check("adressCode");

  setErrors({
    ...temp,
  });
  console.log(temp);
  const hasRight = vouExists ? AuthHandler.canEdit() : AuthHandler.canAdd();
  if (!hasRight) vouExists ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

  return Object.values(temp).every((x) => x == "") && hasRight;
}

export default function Validate(
  fieldValues,
  errors,
  setErrors,
  settings,
  input
) {
  console.log(fieldValues);
  let temp = { ...errors };
  function check(key) {
    if (key in fieldValues)
      temp[key] = fieldValues[key] ? "" : "This field is required.";
  }
  check("vouDate");
  if (
    input.docCode !== "DC" &&
    input.docCode !== "SI" &&
    settings.userBatchNo == "Yes"
  ) {
    check("batchNo");
    check("expDate");
    console.log("hi");
  }
  check("qty");
  check("rate");
  check("prodCode");

  setErrors({
    ...temp,
  });
  console.log(temp);
  return Object.values(temp).every((x) => x == "");
}

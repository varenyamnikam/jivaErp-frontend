export default function Validate(fieldValues, errors, setErrors, flag) {
  console.log(fieldValues);
  let temp = { ...errors };
  function check(key) {
    if (key in fieldValues)
      temp[key] = fieldValues[key] ? "" : "This field is required.";
  }
  check("vouDate");
  if (flag) {
    if (fieldValues.docCode == "BP" || fieldValues.docCode == "CP") {
      check("acCode");
      check("acName");
      temp.debit =
        Number(fieldValues.debit) <= Number(fieldValues.credit)
          ? "Total debit should be "
          : "";
      temp.credit =
        Number(fieldValues.debit) <= Number(fieldValues.credit)
          ? "greater than Total credit"
          : "";
    } else if (fieldValues.docCode == "BR" || fieldValues.docCode == "CR") {
      check("acCode");
      check("acName");
      temp.credit =
        Number(fieldValues.credit) <= Number(fieldValues.debit)
          ? " greater than Total debit"
          : "";
      temp.debit =
        Number(fieldValues.credit) <= Number(fieldValues.debit)
          ? "Total credit should be "
          : "";
    } else {
      temp.credit =
        Number(fieldValues.credit) != Number(fieldValues.debit)
          ? "should be equal"
          : "";
      temp.debit =
        Number(fieldValues.credit) != Number(fieldValues.debit)
          ? "Credit and Debit"
          : "";
    }
  } else {
    check("acCode");
    check("acName");

    console.log("his");
    temp.debit =
      Number(fieldValues.credit) != 0 && Number(fieldValues.debit) != 0
        ? "one of them"
        : "";
    temp.credit =
      Number(fieldValues.credit) != 0 && Number(fieldValues.debit) != 0
        ? "has to be zero"
        : "";
  }
  console.log(temp);
  setErrors({
    ...temp,
  });
  delete temp.startDate;
  delete temp.endDate;

  return Object.values(temp).every((x) => x == "");
}

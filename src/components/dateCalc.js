export default function DateCalc(user) {
  function currentFinyear() {
    const today = new Date();
    console.log(user);
    console.log(
      new Date(user.defaultYearStart),
      new Date(today.getFullYear(), 3, 1),
      new Date(user.defaultYearStart).setHours(0, 0, 0, 0) <=
        new Date(today.getFullYear(), 3, 1).setHours(0, 0, 0, 0)
    );

    if (
      new Date(user.defaultYearStart).setHours(0, 0, 0, 0) <=
      new Date(today.getFullYear(), 3, 1).setHours(0, 0, 0, 0)
    )
      return true;
    else {
      return false;
    }
  }
  function FindOneMonthAgo(date) {
    var d = date;
    var m = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    // If still in same month, set date to last day of
    // previous month
    if (d.getMonth() == m) d.setDate(0);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function getD() {
    const today = new Date();
    let oneMonthAgo = new Date();
    if (currentFinyear()) {
      oneMonthAgo = FindOneMonthAgo(today);
      console.log("current");
    } else {
      const endDate = new Date(user.defaultYearEnd);
      oneMonthAgo = FindOneMonthAgo(endDate);
      console.log("prev");
    }
    console.log(oneMonthAgo);
    return oneMonthAgo;
  }
  return { currentFinyear, FindOneMonthAgo, getD };
}

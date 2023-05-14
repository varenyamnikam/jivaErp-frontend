import React, { useState } from "react";
import ViewsDatePicker from "../../components/yearSelector";
import Controls from "../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import { BiHide } from "react-icons/bi";

export default function FilterForm(props) {
  const {
    setFilterPopup,
    setFilterIcon,
    setFilterFn,
    filter,
    setFilter,
    accounts,
    setRefresh,
    initialFilterValues,
    values,
  } = props;
  const partyOptions = accounts.map((item) => {
    return item.acName;
  });
  const banks = accounts.filter(
    (item) =>
      item.acGroupCode === (values.docCode[0] == "B" ? "A1016" : "A1018")
  );
  const others = accounts.filter((item) => item.preFix !== "G");

  const bankOptions = banks.map((item) => item.acName);
  const otherOptions = others.map((item) => item.acName);

  function searchFilter() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        function dynamicFilterFn(feild) {
          console.log(feild, filter, filter[feild]);
          newRecords.map((item) => {
            console.log(item, filter[feild]);
          });
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
          console.log(feild, newRecords);
        }
        filter.acCode && dynamicFilterFn("acCode");
        filter.vouNo && dynamicFilterFn("vouNo");

        if (filter.startDate && filter.endDate) {
          newRecords = newRecords.filter((item) => {
            if (
              new Date(item.vouDate).getTime() >=
                new Date(filter.startDate).getTime() &&
              new Date(item.vouDate).getTime() <=
                new Date(filter.endDate).getTime()
            )
              return item;
          });
          console.log(newRecords);
        }
        newRecords = newRecords.filter((item) => {
          if (values.docCode !== "JV" && item.vouNo && !item.srNo) {
            return item;
          } else if (
            values.docCode == "JV" &&
            item.vouNo &&
            Number(item.srNo) == 1
          ) {
            return item;
          }
        });
        console.log(newRecords);

        return newRecords;
      },
    });
    setRefresh(true);
  }
  console.log(filter);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <StaticDatePickerLandscape
          size="small"
          name="startDate"
          label=" From-"
          value={filter}
          setValue={setFilter}
          style={{ top: 20 }}
        />
      </Grid>
      <Grid item xs={6}>
        <StaticDatePickerLandscape
          size="small"
          name="endDate"
          label="To-"
          value={filter}
          setValue={setFilter}
        />
      </Grid>
      <Grid item xs={6} style={{ flexGrow: 1 }}>
        <Controls.Input
          name="vouNo"
          label={"Vou No"}
          value={filter.vouNo}
          setValue={setFilter}
          onChange={(e) => {
            setFilter({ ...filter, vouNo: e.target.value });
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SmartAutoSuggest
          style={{ width: "100%" }}
          name1="acName"
          code1="acCode"
          label="Bank"
          name2="acName"
          code2="acCode"
          value={filter}
          setValue={setFilter}
          options1={partyOptions}
          options2={accounts}
        />
      </Grid>
      <Grid item xs={3}>
        <Controls.Button
          text="Reset"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            setFilter(initialFilterValues);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Controls.Button
          type="submit"
          text="Apply"
          onClick={(e) => {
            e.preventDefault();
            searchFilter();
            setFilterPopup(false);
            setFilterIcon(false);
          }}
        />
      </Grid>
    </Grid>
  );
}

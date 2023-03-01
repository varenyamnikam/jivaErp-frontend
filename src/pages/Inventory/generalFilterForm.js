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
    label,
    accounts,
    products,
    voucherItems,
    setRefresh,
    initialFilterValues,
  } = props;
  const partyOptions = accounts
    .filter((item) => item.preFix == "C")
    .map((item) => {
      return item.acName;
    });
  const prodOptions = products.map((item) => item.prodName);
  function searchFilter() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;

        if (filter.vouNo) {
          console.log("vouNo", filter.vouNo);
          newRecords = newRecords.filter((item) => {
            if (item.vouNo == filter.vouNo) return item;
          });
        }
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
        if (filter.prodCode) {
          console.log(newRecords);
          let vouNos = voucherItems
            .filter((item) => item.prodCode == filter.prodCode)
            .map((item) => item.vouNo);
          console.log(vouNos, new Set(vouNos));
          let arr = [...new Set(vouNos)];
          console.log(arr);
          let hi = [];
          arr.map((i) => {
            newRecords.map((item) => {
              if (i == item.vouNo) {
                hi.push(item);
              }
            });
          });
          newRecords = hi;
          console.log(newRecords);
        }
        if (filter.partyCode) {
          newRecords = newRecords.filter((item) => {
            if (item.partyCode == filter.partyCode) return item;
          });
          console.log(newRecords, filter.partyCode);
        }
        if (filter.manualNo) {
          newRecords = newRecords.filter((item) => {
            if (item.manualNo == filter.manualNo) return item;
          });
        }
        newRecords = newRecords.filter((item) => {
          if (item.vouNo !== "") return item;
        });
        console.log(newRecords);

        return newRecords;
      },
    });
    setRefresh(true);
  }

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
      <Grid item xs={6} style={{ flexGrow: 1 }}>
        <Controls.Input
          name="manualNo"
          label={"Manual No"}
          value={filter.manualNo}
          setValue={setFilter}
          onChange={(e) => {
            setFilter({ ...filter, manualNo: e.target.value });
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <SmartAutoSuggest
          style={{ width: "100%" }}
          name1="partyName"
          code1="partyCode"
          label="Party"
          name2="acName"
          code2="acCode"
          value={filter}
          setValue={setFilter}
          options1={partyOptions}
          options2={accounts}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SmartAutoSuggest
          name1="prodName"
          code1="prodCode"
          name2="prodName"
          code2="prodCode"
          label="Product"
          value={filter}
          setValue={setFilter}
          options1={prodOptions}
          options2={products}
        />
      </Grid>{" "}
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

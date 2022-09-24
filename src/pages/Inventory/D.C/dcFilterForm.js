import React, { useEffect, useState } from "react";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import ControlledAccordions from "../../../components/accordions";
export default function DcFilterForm(props) {
  const { filter, setFilter } = props;
  return (
    <>
      <Grid container style={{ marginTop: "10px" }}>
        <Grid item xs={6} style={{ flexGrow: 1 }}>
          <ControlledAccordions
            name="yearCode"
            label="Year Code"
            subLabel="Filter by Year Code"
            value={filter}
            setValue={setFilter}
          />
        </Grid>

        <Grid item xs={6} style={{ flexGrow: 1 }}>
          <ControlledAccordions
            name="finYear"
            label="fin year"
            subLabel="Filter by fin year"
            value={filter}
            setValue={setFilter}
          />
        </Grid>
      </Grid>
    </>
  );
}

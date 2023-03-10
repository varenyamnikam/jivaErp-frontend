import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Switch from "./controls/Switch";
const Accordion = withStyles({
  root: { color: "gray" },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    color: "gray",
    // borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "13px 0",
    },
    display: "flex",
    justifyContent: "space-between",
  },
  expanded: {},
  expandIcon: {
    order: 0,
  },
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function QuestionSection({
  primary,
  seconadry,
  children,
  feildInLocalStorage,
  label = "Keep Open Permanantly",
}) {
  const setting = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  const initialkeepOpen = setting[feildInLocalStorage]
    ? setting[feildInLocalStorage]
    : false;
  const [keepOpen, setKeepOpen] = React.useState(initialkeepOpen);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleSwitchChange = (event) => {
    console.log("hi");
    // update in localstorage for permanant open
    setKeepOpen(event.target.checked);
    const prevSetting = JSON.parse(
      localStorage.getItem("adm_softwareSettings")
    );
    const newSetting = {
      ...prevSetting,
      keepTransactionAccordionOpen: event.target.checked,
    };
    localStorage.setItem("adm_softwareSettings", JSON.stringify(newSetting));
  };

  return (
    <div>
      <Accordion
        square
        expanded={keepOpen ? keepOpen : expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          expandIcon={<ExpandMoreIcon />}
          id="panel1d-header"
        >
          <div style={{ display: "flex" }}>
            <AddCircleOutlineRoundedIcon style={{ marginRight: "15px" }} />
            <Typography> {primary}</Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography> {label}</Typography>
            <Switch
              checked={keepOpen}
              setChecked={setKeepOpen}
              onChange={handleSwitchChange}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import Circle from "../circularProgress";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const Featured = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (percentage < 72) {
        setPercentage(percentage + 1);
      }
    }, 50);
  }, [percentage]);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Orders completed</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="chartsContainer">
        <div className="featuredChart">
          <Typography style={{marginBottom:"20px"}}>Sales Order</Typography>
          <CircularProgressbar value={percentage} text={`${percentage}%`} />
        </div>
        <div className="featuredChart">
        <Typography style={{marginBottom:"20px"}} >Purchase Order</Typography>
          <CircularProgressbar value={20} text={`${20}%`} />
        </div></div>

        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult negative">
              <KeyboardArrowDownIcon fontSize="small" />
              <div className="resultAmount">12</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Completed</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">10</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">9</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Completed</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">9</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
// <div className="featured">
// <div className="top">
//   <h1 className="title">Total Revenue</h1>
//   <MoreVertIcon fontSize="small" />
// </div>
// <div className="bottom">
//   <div className="featuredChart">
//     <CircularProgressbar value={70} text={"70%"} strokeWidth={5} />
//   </div>
//   <p className="title">Total sales made today</p>
//   <p className="amount">$420</p>
//   <p className="desc">
//     Previous transactions processing. Last payments may not be included.
//   </p>
//   <div className="summary">
//     <div className="item">
//       <div className="itemTitle">Target</div>
//       <div className="itemResult negative">
//         <KeyboardArrowDownIcon fontSize="small" />
//         <div className="resultAmount">$12.4k</div>
//       </div>
//     </div>
//     <div className="item">
//       <div className="itemTitle">Last Week</div>
//       <div className="itemResult positive">
//         <KeyboardArrowUpOutlinedIcon fontSize="small" />
//         <div className="resultAmount">$12.4k</div>
//       </div>
//     </div>
//     <div className="item">
//       <div className="itemTitle">Last Month</div>
//       <div className="itemResult positive">
//         <KeyboardArrowUpOutlinedIcon fontSize="small" />
//         <div className="resultAmount">$12.4k</div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>

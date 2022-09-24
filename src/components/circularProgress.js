import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Circle() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (percentage < 100) {
        setPercentage(percentage + 1);
      }
    }, 50);
  }, [percentage]);

  return (
    <div className="app">
      <div style={{ width: 150, marginLeft: 70 }}>
        <CircularProgressbar value={percentage} text={`${percentage}%`} />
      </div>
    </div>
  );
}

export default Circle;

import React from "react";
import * as or from "orama";

const Chart = ({ data }) => {
  return (
    <or.Chart height={500}>
      <or.Lines
        data={ data }
        x="date" y="price"
        stroke="name"
        tooltipExtraDimensions={["volume", "high", "low"]}
      />
    </or.Chart>
  )
};

export default Chart;

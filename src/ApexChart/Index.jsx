import React from "react";
import LineColumn from "./LineColumn";
import Basic from "./Area/Basic";
import Spline from "./Area/Spline";
import DatetimeXAxis from "./Area/DatetimeXAxis";
import Negative from "./Area/Negative";

export default function IndexApexChart() {
  return (
    <div className="flex gap-4 flex-wrap">
      <LineColumn />

      <Basic />
      <Spline />
      <DatetimeXAxis />
      <Negative />
    </div>
  );
}

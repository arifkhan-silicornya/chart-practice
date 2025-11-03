import React from "react";
import LineChartGraph from "./LineChartGraph";
import BarChartVisual from "./BarChartVisual";
import PieChartInGrid from "./PieChartInGrid";

export default function IndexRechart() {
  return (
    <div className="bg-sky-100 flex gap-4 flex-wrap">
      <LineChartGraph />
      <BarChartVisual />
      <PieChartInGrid />
    </div>
  );
}

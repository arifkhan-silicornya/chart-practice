import React, { useRef } from "react";
import LineChart from "./Line/LineChart/LineChart";
import { useResizeObserver } from "../Component/useResizeObserver";

const sampleData = [
  { x: "Jan", y: 30 },
  { x: "Feb", y: 45 },
  { x: "Mar", y: 35 },
  { x: "Apr", y: -30 },
  { x: "May", y: 55 },
  { x: "Jun", y: 70 },
  { x: "Jul", y: 30 },
  { x: "Aug", y: 40 },
];

export default function DThreeIndex() {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const { width, height } = dimensions;
  return (
    <div className="p-10 text-black">
      <LineChart
        data={sampleData}
        title="Monthly Sales Growth"
        width={width - 100}
        height={height / 2}
        xKey="x"
        yKey="y"
        xLabel="Month"
        yLabel="Sales"
        color="#16a34a"
        lineStyle="dashed" // ✅ "solid" or "dashed"
      />
    </div>
  );
}

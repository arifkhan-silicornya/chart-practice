import React, { useRef } from "react";
import BarChart from "./BarChart/BarChart";
import { useResizeObserver } from "../Component/useResizeObserver";

const data = [
  { label: "Jan", Jazz: 5, Pop: 5, Rock: 5 },
  { label: "Feb", Jazz: 8, Pop: 8, Rock: 5 },
  { label: "Mar", Jazz: 15, Pop: 10, Rock: 5 },
  { label: "Apr", Jazz: 18, Pop: 14, Rock: 8 },
  { label: "May", Jazz: 22, Pop: 20, Rock: 8 },
  { label: "Jun", Jazz: 18, Pop: 23, Rock: 9 },
  { label: "Jul", Jazz: 15, Pop: 13, Rock: 6 },
  { label: "Aug", Jazz: 19, Pop: 16, Rock: 5 },
  { label: "Sep", Jazz: 20, Pop: 19, Rock: 8 },
  { label: "Oct", Jazz: 19, Pop: 20, Rock: 6 },
  { label: "Nov", Jazz: 16, Pop: 25, Rock: 9 },
  { label: "Dec", Jazz: 18, Pop: 22, Rock: 6 },
];

export default function DThreeIndex() {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const { width, height } = dimensions;

  return (
    <div className="flex flex-col items-center py-4 text-black size-full">
      <BarChart
        data={data}
        keys={["Jazz", "Pop", "Rock"]}
        colors={["#F28C38", "#00D4C3", "#2360FF"]}
        width={width}
        height={height / 2}
        title="Top Trending Music 2024"
        showGrid={true}
        xLabel="Months"
        yLabel="Value"
        legendPosition="top"
        // tooltipRenderer={(d) => `        //   <div className="text-center">
        //     <strong >Months: ${d.group}</strong>
        //     <br />
        //     <span>
        //       <b>${d.key}: </b> ${d.value}
        //     </span>
        //   </div>
        //`}
      />
    </div>
  );
}

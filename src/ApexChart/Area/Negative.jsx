import React from "react";

import Chart from "react-apexcharts";

var options = {
  series: [
    {
      data: [0, -41, 35, -51, 0, 62, -69, 32, -32, 54, 16, -50],
    },
  ],
  chart: {
    height: 350,
    type: "area",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: "Negative color for values less than 0",
    align: "left",
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  stroke: {
    width: 0,
  },
  tooltip: {
    enabled: true,
    enabledOnSeries: undefined,
    shared: true,
    followCursor: true,
    intersect: false,
    inverseOrder: false,
    custom: undefined,
    hideEmptySeries: false,
    fillSeriesColor: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
    x: {
      show: true,
      format: "dd MMM",
      formatter: undefined,
    },
    y: {
      formatter: undefined,
      title: {
        formatter: (seriesName) => seriesName,
      },
    },
    z: {
      formatter: undefined,
      title: "Size: ",
    },
    marker: {
      show: true,
    },
    items: {
      display: "flex",
    },
    fixed: {
      enabled: false,
      position: "topRight",
      offsetX: 0,
      offsetY: 0,
    },
  },
  plotOptions: {
    line: {
      colors: {
        threshold: 0,
        colorAboveThreshold: "#0088ee",
        colorBelowThreshold: "#ff0000",
      },
    },
  },
};

export default function Negative() {
  return (
    <div className="bg-slate-50">
      <Chart
        options={options}
        series={options?.series}
        type="area"
        width="800"
      />
    </div>
  );
}

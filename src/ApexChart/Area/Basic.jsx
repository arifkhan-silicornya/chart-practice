import React from "react";

import Chart from "react-apexcharts";

var options = {
  series: [
    {
      name: "STOCK ABC",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
    },
  ],
  chart: {
    type: "area",
    height: 450,
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },

  title: {
    text: "Fundamental Analysis of Stocks",
    align: "left",
  },
  subtitle: {
    text: "Price Movements",
    align: "left",
  },
  labels: [
    "01/01/2003",
    "02/01/2003",
    "03/01/2003",
    "04/01/2003",
    "05/01/2003",
    "06/01/2003",
    "07/01/2003",
    "08/01/2003",
    "09/01/2003",
    "10/01/2003",
    "11/01/2003",
  ],
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
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    opposite: true,
  },
  legend: {
    horizontalAlign: "left",
  },
};

export default function Basic() {
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

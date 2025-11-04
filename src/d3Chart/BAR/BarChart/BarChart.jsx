import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({
  data = [],
  keys = [],
  colors = [],
  width = 800,
  height = 400,
  margin = { top: 50, right: 30, bottom: 60, left: 70 },
  title = "Bar Chart",
  xLabel = "",
  yLabel = "",
  yTicks = 5,
  showGrid = true,
  roundedBars = true,
  legendPosition = "top", // ✅ "top" | "bottom"
  tooltipRenderer = null, // custom tooltip renderer
}) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data.length || !keys.length) return;

    // auto-detect x field
    const xField = Object.keys(data[0]).find((k) => !keys.includes(k));

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(keys)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    // ✅ Y scale (supports negative values)
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d3.min(keys, (key) => d[key])),
        d3.max(data, (d) => d3.max(keys, (key) => d[key])),
      ])
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(colors);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid lines
    if (showGrid) {
      g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");
    }

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("font-size", "12px");

    // Y Axis
    g.append("g").call(d3.axisLeft(y).ticks(yTicks));

    // ✅ Add X Axis Label
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .text(xLabel);

    // ✅ Add Y Axis Label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 20)
      .style("font-size", "13px")
      .style("font-weight", "500")
      .text(yLabel);

    // Tooltip setup
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255,255,255,1)")
      .style("color", "#000")
      .style("padding", "8px 16px")
      .style("border-radius", "5px")
      .style("font-size", "16px")
      .style("pointer-events", "none")
      .style("transition", "opacity 0.2s");

    // ✅ Add zero line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#444")
      .attr("stroke-width", 1);

    // ✅ Bars (handles negative & positive)
    g.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d[xField])},0)`)
      .selectAll("rect")
      .data((d) =>
        keys.map((key) => ({ group: d[xField], key, value: d[key] }))
      )
      .join("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", (d) => (d.value >= 0 ? y(d.value) : y(0)))
      .attr("height", (d) => Math.abs(y(d.value) - y(0)))
      .attr("width", x1.bandwidth())
      .attr("rx", roundedBars ? 5 : 0)
      .attr("ry", roundedBars ? 5 : 0)
      .attr("fill", (d) => color(d.key))
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible").style("opacity", 1);
        tooltip.style("background", "#fff");
        tooltip.style("color", color(d.key));

        if (tooltipRenderer) {
          tooltip.html(tooltipRenderer(d));
        } else {
          tooltip.html(
            `<div><b>${xLabel}:</b > ${d.group}</div><div><b>${d.key}: </b> ${d.value}</div>`
          );
        }

        d3.select(this).attr("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 35 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden").style("opacity", 0);
        d3.select(this).attr("opacity", 1);
      });

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "600")
      .text(title);

    // Legend
    // ✅ Legend positioning logic
    const legend = svg.append("g");

    const legendY =
      legendPosition === "top"
        ? margin.top / 2 + 10 // below title
        : height - 18; // bottom position

    legend.attr(
      "transform",
      `translate(${width / 2 - keys.length * 50}, ${legendY})`
    );

    keys.forEach((key, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(${i * 120},0)`);

      legendRow
        .append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", color(key))
        .attr("rx", 3)
        .attr("ry", 3);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 11)
        .style("font-size", "13px")
        .text(key);
    });
  }, [
    data,
    keys,
    colors,
    width,
    height,
    title,
    xLabel,
    yLabel,
    legendPosition,
    tooltipRenderer,
  ]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

export default BarChart;

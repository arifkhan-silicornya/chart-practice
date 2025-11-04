import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BrashBarChart = ({
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
  brashColor = "",
}) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data.length || !keys.length) return;

    const xField = Object.keys(data[0]).find((k) => !keys.includes(k));

    d3.select(svgRef.current).selectAll("*").remove();

    const brushHeight = 60;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height + brushHeight + 40);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - brushHeight;

    // ✅ Compute min & max (for negative values)
    const yMin = d3.min(data, (d) => d3.min(keys, (key) => d[key]));
    const yMax = d3.max(data, (d) => d3.max(keys, (key) => d[key]));

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d[xField]))
      .range([0, innerWidth])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(keys)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, yMin), Math.max(0, yMax)]) // ✅ handles negatives
      .nice()
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(colors);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ✅ Grid lines
    if (showGrid) {
      chartGroup
        .append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat("").ticks(yTicks))
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");
    }

    // ✅ Axes
    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("font-size", "12px");

    chartGroup.append("g").call(d3.axisLeft(y).ticks(yTicks));

    // ✅ Zero line (baseline)
    chartGroup
      .append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

    // Tooltip
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

    const barsGroup = chartGroup.append("g").attr("class", "bars-group");

    function drawBars(visibleData) {
      barsGroup.selectAll("*").remove();

      const groups = barsGroup
        .selectAll("g")
        .data(visibleData)
        .join("g")
        .attr("transform", (d) => `translate(${x0(d[xField])},0)`);

      groups
        .selectAll("rect")
        .data((d) =>
          keys.map((key) => ({ group: d[xField], key, value: d[key] }))
        )
        .join("rect")
        .attr("x", (d) => x1(d.key))
        // ✅ Handle positive vs negative bars
        .attr("y", (d) => (d.value >= 0 ? y(d.value) : y(0)))
        .attr("height", (d) => Math.abs(y(d.value) - y(0)))
        .attr("width", x1.bandwidth())
        .attr("rx", roundedBars ? 4 : 0)
        .attr("ry", roundedBars ? 4 : 0)
        .attr("fill", (d) => color(d.key))
        .on("mouseover", function (event, d) {
          tooltip.style("visibility", "visible").style("opacity", 1);
          tooltip.html(
            tooltipRenderer
              ? tooltipRenderer(d)
              : `<div><b>${xLabel}:</b> ${d.group}</div><div><b>${d.key}:</b> ${d.value}</div>`
          );
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 35 + "px")
            .style("left", event.pageX + 15 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden").style("opacity", 0);
          d3.select(this).attr("opacity", 1);
        });
    }

    drawBars(data);

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "600")
      .text(title);

    // ✅ Brush area setup
    const brushScale = d3
      .scaleBand()
      .domain(data.map((d) => d[xField]))
      .range([0, innerWidth])
      .padding(0.2);

    const brushGroup = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight + 40})`
      );

    // Brush axis (optional ticks off)
    brushGroup
      .append("g")
      .attr("transform", `translate(0,${brushHeight - 25})`)
      .call(d3.axisBottom(brushScale).tickValues([]));

    // Define brush
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, brushHeight - 20],
      ])
      .on("brush end", brushed);

    const brushArea = brushGroup
      .append("g")
      .attr("class", "x-brush")
      .call(brush);
    brushArea.call(brush.move, [0, innerWidth]);

    const brashClr = brashColor || color(0) || "#000";
    // ✅ Style the brush
    brushArea
      .selectAll(".selection")
      .attr("fill", brashClr)
      .attr("fill-opacity", 0.3)
      .attr("stroke", brashClr)
      .attr("stroke-width", 1.5)
      .attr("rx", 3)
      .attr("ry", 3);

    brushArea
      .selectAll(".handle--w, .handle--e")
      .attr("fill", brashClr)
      .attr("width", 14)
      .attr("height", brushHeight - 20)
      .attr("rx", 3)
      .attr("ry", 3)
      .style("cursor", "ew-resize");

    function brushed(event) {
      if (!event.selection) return;
      const [x0Sel, x1Sel] = event.selection;

      const selected = data.filter((d) => {
        const pos = brushScale(d[xField]) + brushScale.bandwidth() / 2;
        return pos >= x0Sel && pos <= x1Sel;
      });

      if (selected.length > 0) {
        x0.domain(selected.map((d) => d[xField]));
        chartGroup.select(".x-axis").remove();

        // Redraw X axis
        chartGroup
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x0))
          .selectAll("text")
          .attr("transform", "translate(0,5)")
          .style("font-size", "12px");

        drawBars(selected);
      }
    }
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

export default BrashBarChart;

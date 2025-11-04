import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = ({
  data = [],
  width = 800,
  height = 400,
  margin = { top: 50, right: 40, bottom: 50, left: 60 },
  xKey = "x",
  yKey = "y",
  color = "#2563eb",
  title = "Line Chart",
  xLabel = "",
  yLabel = "",
  showGrid = true,
  smooth = true,
  lineStyle = "solid",
}) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const brushRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    // Clear SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const x = d3
      .scalePoint()
      .domain(data.map((d) => d[xKey]))
      .range([0, innerWidth])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[yKey]) * 1.1, // allow negative space
        d3.max(data, (d) => d[yKey]) * 1.1,
      ])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Gridlines
    if (showGrid) {
      g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""))
        .selectAll("line")
        .attr("stroke", "rgba(0,0,0,0.3)")
        .attr("stroke-dasharray", "3,3");
    }

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("dy", "0.8em");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "12px");

    // Axis Labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text(xLabel);

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text(yLabel);

    // Zero line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2");

    // Line generator
    const line = d3
      .line()
      .x((d) => x(d[xKey]))
      .y((d) => y(d[yKey]))
      .curve(smooth ? d3.curveCatmullRom.alpha(0.5) : d3.curveLinear);

    // Draw line path
    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5);

    // Apply dashed or solid
    if (lineStyle === "dashed") {
      path.attr("stroke-dasharray", "6,4");
      path.attr("d", line);

      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", "10,4" + " " + "0")
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeSin)
        .attr("stroke-dashoffset", 0);
    } else {
      path.attr("stroke-dasharray", "0");
      path.attr("d", line);

      // Animate solid line
      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeSin)
        .attr("stroke-dashoffset", 0);
    }

    // Tooltip setup
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("color", "#000")
      .style("padding", "8px 12px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("font-size", "13px")
      .style("pointer-events", "none");

    // Dots with tooltip
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d[xKey]))
      .attr("cy", (d) => y(d[yKey]))
      .attr("r", 4)
      .attr("fill", color)
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(`${xKey}: ${d[xKey]}<br>${yKey}: ${d[yKey]}`);
        d3.select(event.currentTarget).attr("r", 6).attr("fill", "orange");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 40 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", (event) => {
        tooltip.style("visibility", "hidden");
        d3.select(event.currentTarget).attr("r", 4).attr("fill", color);
      });

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text(title);

    // Brush
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on("brush end", (event) => {
        if (event.selection) {
          const [x0, x1] = event.selection;
          const selectedDomain = x.domain().filter((d) => {
            const pos = x(d);
            return pos >= x0 && pos <= x1;
          });
          console.log("Selected range:", selectedDomain);
        }
      });

    // Append brush to chart group
    g.append("g").attr("class", "brush").call(brush);

    // Style the brush selection rectangle
    g.selectAll(".selection")
      .attr("fill", "rgba(0, 150, 255, 0.2)")
      .attr("stroke", "#0096ff");

    // Make sure the overlay is visible
    g.selectAll(".overlay").style("cursor", "crosshair");
  }, [data, width, height, color, xKey, yKey, smooth, showGrid, lineStyle]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

export default LineChart;

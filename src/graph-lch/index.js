// @flow
import React, { useMemo, useCallback, useEffect } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { getData, strokeToFill } from "gradient-path";
import spaces from "color-space";
import { findChromaBoundaries, lchToRgb } from "./utils";
import type { ColorIdx, Colors } from ".";

// set the dimensions and margins of the graph

const xAxisHeight = 30;
const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
const width = 360 - margin.left - margin.right;
const height = 130 - margin.top - margin.bottom;

// set stroke example https://bl.ocks.org/mbostock/4163057

const xAdjust = 6 / 5;

type Props = {|
  customKey: string,
  title: string,
  colorIdx: ColorIdx,
  colors: Colors,
  row: boolean,
|};

const GraphLCH = ({ customKey, title, colorIdx, colors, row }: Props) => {
  const data = useMemo(() => {
    // TODO: handle row and col selection
    const graphColors = colors[colorIdx.row];
    const data = _.map(graphColors, (color, idx) => {
      const { color: rgb, impossible } = lchToRgb(color); // xyzToRgb(xyz);
      const { max, min } = findChromaBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[1],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  });

  useEffect(() => {
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Top area
    const area1 = d3
      .area()
      .x((d) => x(d.idx * xAdjust))
      .y0(xAxisHeight)
      .y1((d) => y(d.top) + xAxisHeight)
      .curve(d3.curveBasis);

    const area2 = d3
      .area()
      .x((d) => x(d.idx * xAdjust))
      .y0(height + xAxisHeight)
      .y1((d) => y(d.bottom) + xAxisHeight)
      .curve(d3.curveBasis);

    // define the line
    const valueline1 = d3
      .line()
      .x((d) => x(d.idx * xAdjust))
      .y((d) => y(d.bottom) + xAxisHeight)
      .curve(d3.curveBasis);

    const valueline2 = d3
      .line()
      .x((d) => x(d.idx * xAdjust))
      .y((d) => y(d.top) + xAxisHeight)
      .curve(d3.curveBasis);

    const valueline3 = d3
      .line()
      .x((d) => x(d.idx * xAdjust))
      .y((d) => y(d.actual) + xAxisHeight)
      .curve(d3.curveNatural);

    const svg = d3
      .select(`#svg-${customKey}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + xAxisHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain([0, data.length - 1]);
    y.domain([0, 100]);

    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", "green-pattern")
      .attr("height", 1)
      .attr("patternTransform", "rotate(70 0 0)")
      .attr("width", 0.02);

    pattern
      .append("rect")
      .attr("height", "100%")
      .attr("width", "2px")
      .attr("fill", "#e8e7e7");

    pattern
      .append("rect")
      .attr("x", 5)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "2px")
      .attr("fill", "white");

    // Border
    svg
      .append("rect")
      .attr("class", "svg-border")
      .attr("height", height + xAxisHeight)
      .attr("width", width)
      .attr("fill", "transparent")
      .attr("border", "1px solid red")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px");

    // top area
    svg
      .append("path")
      .attr("class", "area1")
      .attr("fill", "url('#green-pattern')")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px")
      .attr("d", area1(data));

    svg
      .append("path")
      .attr("class", "area2")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px")
      .attr("fill", "url('#green-pattern')")
      .attr("d", area2(data));

    // TODO: use this one - https://bl.ocks.org/mbostock/4163057
    svg.append("path").attr("class", "line3").attr("d", valueline3(data));

    svg
      .append("g")
      .attr("class", `circles-${customKey}`)
      .selectAll(`#svg circles-${customKey} circle`)
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("cx", (d) => x(d.idx * xAdjust))
      .attr("cy", (d) => y(d.actual) + xAxisHeight)
      .attr("fill", (d) => {
        if (d.idx === 0 || d.idx === data.length - 2) {
          return "transparent";
        }

        const rgb = spaces.lchab.rgb(d.color);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      });

    svg
      .append("g")
      .attr("class", `text-${customKey}`)
      .selectAll(`#svg text-${customKey} text`)
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.actual.toFixed(1))
      .attr("x", (d) => x(d.idx * xAdjust) - 15)
      .attr("y", "20")
      .attr("fill", (d) => {
        if (d.idx === 0 || d.idx === data.length - 2) {
          return "transparent";
        }

        return "gray";
      });
  }, []);

  return (
    <div>
      <h4 style={{ marginBottom: 0 }}>{title}</h4>
      <div id={`svg-${customKey}`} />
    </div>
  );
};

export default GraphLCH;

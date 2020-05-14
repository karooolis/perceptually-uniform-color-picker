// @flow
import React, { useMemo, useCallback, useRef, useEffect } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { getData, strokeToFill } from "gradient-path";
import spaces from "color-space";
import { hslCssStr } from "../utils";
import { usePrevious } from "../hooks";
import { findChromaBoundaries, lchToRgb, getGraphData } from "./utils";
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
  const graphInitialized = useRef(false);
  const data = useMemo(() => getGraphData(colors, colorIdx), [
    colors,
    colorIdx,
  ]);
  const prevData = usePrevious(data);
  const svg = useRef();
  const elements = useMemo(() => {
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const topArea = d3
      .area()
      .x((d) => x(d.idx * xAdjust))
      .y0(xAxisHeight)
      .y1((d) => y(d.top) + xAxisHeight)
      .curve(d3.curveBasis);

    const bottomArea = d3
      .area()
      .x((d) => x(d.idx * xAdjust))
      .y0(height + xAxisHeight)
      .y1((d) => y(d.bottom) + xAxisHeight)
      .curve(d3.curveBasis);

    const valuesLine = d3
      .line()
      .x((d) => x(d.idx * xAdjust))
      .y((d) => y(d.actual) + xAxisHeight)
      .curve(d3.curveNatural);

    return {
      x,
      y,
      topArea,
      bottomArea,
      valuesLine,
    };
  }, [customKey]);

  useEffect(() => {
    const { x, y, topArea, bottomArea, valuesLine } = elements;

    if (!graphInitialized.current) {
      x.domain([0, data.length - 1]);
      y.domain([0, 100]);

      svg.current = d3
        .select(`#svg-${customKey}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + xAxisHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const defs = svg.current.append("defs");

      // TODO: define pattern elsewhere
      const pattern = defs
        .append("pattern")
        .attr("id", "area-pattern")
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

      svg.current
        .append("rect")
        .attr("class", "svg-border")
        .attr("height", height + xAxisHeight)
        .attr("width", width)
        .attr("fill", "transparent")
        .attr("border", "1px solid red")
        .attr("stroke", "lightgray")
        .attr("stroke-width", "2px");

      svg.current
        .selectAll(".top-area")
        .data([data])
        .enter()
        .append("path")
        .attr("class", "top-area")
        .attr("fill", "url('#area-pattern')")
        .attr("stroke", "lightgray")
        .attr("stroke-width", "2px")
        .attr("d", topArea);

      svg.current
        .selectAll(".bottom-area")
        .data([data])
        .enter()
        .append("path")
        .attr("class", "bottom-area")
        .attr("fill", "url('#area-pattern')")
        .attr("stroke", "lightgray")
        .attr("stroke-width", "2px")
        .attr("d", bottomArea);

      // TODO: use this for gradient colored line - https://bl.ocks.org/mbostock/4163057
      svg.current
        .selectAll(".line3")
        .data([data])
        .enter()
        .append("path")
        .attr("class", "line3")
        .attr("d", valuesLine);

      svg.current
        .selectAll(`.circle-${customKey}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `circle-${customKey}`)
        .attr("r", 8)
        .attr("cx", (d) => x(d.idx * xAdjust))
        .attr("cy", (d) => y(d.actual) + xAxisHeight)
        .attr("fill", (d) => {
          if (d.idx === 0 || d.idx === data.length - 2) {
            return "transparent";
          }

          return hslCssStr(d.color);
        });

      svg.current
        .selectAll(`text-${customKey}`)
        .data(data)
        .enter()
        .append("text")
        .attr("class", `text-${customKey}`)
        .text((d) => parseInt(d.actual))
        .attr("x", (d) => x(d.idx * xAdjust) - 7)
        .attr("y", "20")
        .attr("fill", (d) => {
          if (d.idx === 0 || d.idx === data.length - 2) {
            return "transparent";
          }

          return "gray";
        });

      graphInitialized.current = true;
    } else if (data !== prevData) {
      svg.current.selectAll(".line3").data([data]).attr("d", valuesLine);

      svg.current
        .selectAll(`.circle-${customKey}`)
        .data(data)
        .attr("cx", (d) => x(d.idx * xAdjust))
        .attr("cy", (d) => y(d.actual) + xAxisHeight)
        .attr("fill", (d) => {
          if (d.idx === 0 || d.idx === data.length - 2) {
            return "transparent";
          }
          return hslCssStr(d.color);
        });

      svg.current.selectAll(".top-area").data([data]).attr("d", topArea);
      svg.current.selectAll(".bottom-area").data([data]).attr("d", bottomArea);
      svg.current
        .selectAll(`.text-${customKey}`)
        .data(data)
        .text((d) => parseInt(d.actual))
        .attr("x", (d) => x(d.idx * xAdjust) - 7)
        .attr("y", "20")
        .attr("fill", (d) => {
          if (d.idx === 0 || d.idx === data.length - 2) {
            return "transparent";
          }

          return "gray";
        });
    }
  });

  return (
    <div>
      <h4 style={{ marginBottom: 0 }}>{title}</h4>
      <div id={`svg-${customKey}`} />
    </div>
  );
};

export default GraphLCH;

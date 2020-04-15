import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { getData, strokeToFill } from "gradient-path";
import spaces from "color-space";

// set the dimensions and margins of the graph

const xAxisHeight = 30;
const margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 360 - margin.left - margin.right,
  height = 130 - margin.top - margin.bottom;

// set stroke example https://bl.ocks.org/mbostock/4163057

const xAdjust = 6 / 5;

class utils extends Component {
  componentDidMount() {
    this.x = d3.scaleLinear().range([0, width]);
    this.y = d3.scaleLinear().range([height, 0]);

    // define the area

    // Top area
    this.area1 = d3
      .area()
      .x(d => {
        return this.x(d.idx * xAdjust);
      })
      .y0(xAxisHeight)
      .y1(d => {
        return this.y(d.top) + xAxisHeight;
      })
      .curve(d3.curveBasis);

    this.area2 = d3
      .area()
      .x(d => {
        return this.x(d.idx * xAdjust);
      })
      .y0(height + xAxisHeight)
      .y1(d => {
        return this.y(d.bottom) + xAxisHeight;
      })
      .curve(d3.curveBasis);

    // define the line
    this.valueline1 = d3
      .line()
      .x(d => {
        return this.x(d.idx * xAdjust);
      })
      .y(d => {
        return this.y(d.bottom) + xAxisHeight;
      })
      .curve(d3.curveBasis);

    this.valueline2 = d3
      .line()
      .x(d => {
        return this.x(d.idx * xAdjust);
      })
      .y(d => {
        return this.y(d.top) + xAxisHeight;
      })
      .curve(d3.curveBasis);

    this.valueline3 = d3
      .line()
      .x(d => {
        return this.x(d.idx * xAdjust);
      })
      .y(d => {
        return this.y(d.actual) + xAxisHeight;
      })
      .curve(d3.curveNatural);

    this.svg = d3
      .select(`#svg-${this.props.customKey}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + xAxisHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.x.domain([0, this.props.data.length - 1]);
    this.y.domain([0, 100]);

    const data = this.props.data;

    this.defs = this.svg.append("defs");
    this.pattern = this.defs
      .append("pattern")
      .attr("id", `green-pattern`)
      .attr("height", 1)
      .attr("patternTransform", "rotate(70 0 0)")
      .attr("width", 0.02);

    this.pattern
      .append("rect")
      .attr("height", "100%")
      .attr("width", "2px")
      .attr("fill", "#e8e7e7");

    this.pattern
      .append("rect")
      .attr("x", 5)
      .attr("y", 0)
      .attr("height", "100%")
      .attr("width", "2px")
      .attr("fill", "white");

    // Border
    this.svg
      .append("rect")
      .attr("class", "svg-border")
      .attr("height", height + xAxisHeight)
      .attr("width", width)
      .attr("fill", "transparent")
      .attr("border", "1px solid red")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px");

    // top area
    this.svg
      .append("path")
      .attr("class", "area1")
      .attr("fill", "url('#green-pattern')")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px")
      .attr("d", this.area1(data));

    this.svg
      .append("path")
      .attr("class", "area2")
      .attr("stroke", "lightgray")
      .attr("stroke-width", "2px")
      .attr("fill", "url('#green-pattern')")
      .attr("d", this.area2(data));

    // TODO: use this one - https://bl.ocks.org/mbostock/4163057

    this.svg
      .append("path")
      .attr("class", "line3")
      .attr("d", this.valueline3(data));

    this.svg
      .append("g")
      .attr("class", `circles-${this.props.customKey}`)
      .selectAll(`#svg circles-${this.props.customKey} circle`)
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("cx", d => this.x(d.idx * xAdjust))
      .attr("cy", d => this.y(d.actual) + xAxisHeight)
      .attr("fill", d => {
        if (d.idx === 0 || d.idx === this.props.data.length - 2) {
          return "transparent";
        }

        const rgb = spaces.lchab.rgb(d.color);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      });

    this.svg
      .append("g")
      .attr("class", `text-${this.props.customKey}`)
      .selectAll(`#svg text-${this.props.customKey} text`)
      .data(data)
      .enter()
      .append("text")
      .text(d => d.actual.toFixed(1))
      .attr("x", d => this.x(d.idx * xAdjust) - 15)
      .attr("y", "20")
      .attr("fill", d => {
        if (d.idx === 0 || d.idx === this.props.data.length - 2) {
          return "transparent";
        }

        return "gray";
      });

    // .attr("stroke", "#e8e7e7")
    // .attr("stroke-width", "2px");

    // add the X Axis
    // this.svg
    //   .append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(this.x).tickValues([]));

    // // add the Y Axis
    // this.svg.append("g").call(d3.axisLeft(this.y));
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps, this.props);

    if (!_.isEqual(prevProps.data, this.props.data)) {
      // console.log("refresh idx", this.props.customKey);

      // console.log("refresh", this.props.customKey);

      this.refresh();
    }
  }

  refresh = () => {
    var data = this.props.data; // this.getData();

    d3.select(`#svg-${this.props.customKey} .area1`)
      // .transition(50)
      .attr("d", this.area1(data));

    d3.select(`#svg-${this.props.customKey} .area2`)
      // .transition(50)
      .attr("d", this.area2(data));

    d3.select(`#svg-${this.props.customKey} .line3`)
      // .transition(50)
      .attr("d", this.valueline3(data));

    this.svg
      .select(`.circles-${this.props.customKey}`)
      .selectAll("circle")
      .data(data)
      // .enter()
      // .update("circle")
      // .attr("r", 8)
      .attr("cx", d => this.x(d.idx))
      .attr("cy", d => this.y(d.actual))
      .attr("fill", d => {
        const rgb = spaces.lchab.rgb(d.color);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      });
  };

  render() {
    return (
      <div>
        {/* <button onClick={() => this.refresh()}>Refresh</button> */}
        <h4 style={{ marginBottom: 0 }}>{this.props.title}</h4>
        <div id={`svg-${this.props.customKey}`} />
      </div>
    );
  }
}

export default utils;

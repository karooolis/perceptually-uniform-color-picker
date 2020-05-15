import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";
import spaces from "color-space";

// set the dimensions and margins of the graph
const margin = { top: 10, right: 10, bottom: 20, left: 20 };
const width = 360 - margin.left - margin.right;
const height = 130 - margin.top - margin.bottom;

class GraphHue extends Component {
  componentDidMount() {
    this.x = d3.scaleLinear().range([0, width]);
    this.y = d3.scaleLinear().range([height, 0]);

    // define the area
    this.area1 = d3
      .area()
      .x((d) => {
        return this.x(d.idx);
      })
      .y0((d) => {
        return this.y(d.bottom);
      })
      .y1((d) => {
        return this.y(d.top);
      })
      .curve(d3.curveBasis);

    this.lineBoundsTop = d3
      .line()
      .x((d) => {
        return this.x(d.idx);
      })
      .y((d) => {
        return this.y(d.top);
      })
      .curve(d3.curveBasis);

    this.lineBoundsBottom = d3
      .line()
      .x((d) => {
        return this.x(d.idx);
      })
      .y((d) => {
        return this.y(d.bottom);
      })
      .curve(d3.curveBasis);

    // this.area2 = d3
    //   .area()
    //   .x(d => {
    //     return this.x(d.idx);
    //   })
    //   .y0(height)
    //   .y1(d => {
    //     return this.y(d.bottom);
    //   })
    //   .curve(d3.curveBasis);

    // define the line
    this.valueline1 = d3
      .line()
      .x((d) => {
        return this.x(d.idx);
      })
      .y((d) => {
        return this.y(d.bottom);
      })
      .curve(d3.curveBasis);

    this.valueline2 = d3
      .line()
      .x((d) => {
        return this.x(d.idx);
      })
      .y((d) => {
        return this.y(d.top);
      })
      .curve(d3.curveBasis);

    this.valueline3 = d3
      .line()
      .x((d) => {
        return this.x(d.idx);
      })
      .y((d) => {
        return this.y(d.actual);
      })
      .curve(d3.curveNatural);

    this.svg = d3
      .select(`#svg-${this.props.customKey}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    this.x.domain([0, this.props.data.length - 1]);
    this.y.domain([0, 360]);

    const { data } = this.props; // this.getData();

    // top area
    this.svg
      .append("path")
      .attr("class", "area1")
      .attr("fill", "url('#area-pattern')")
      .attr("stroke", "darkgray")
      .attr("stroke-width", "2px")
      .attr("d", this.area1(data));

    // this.svg
    //   .append("path")
    //   .attr("class", "line1")
    //   .attr("d", this.lineBoundsTop(data));

    // this.svg
    //   .append("path")
    //   .attr("class", "line2")
    //   .attr("d", this.lineBoundsBottom(data));

    // values
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
      .attr("cx", (d) => this.x(d.idx))
      .attr("cy", (d) => this.y(d.actual))
      .attr("fill", (d) => {
        const rgb = spaces.lchab.rgb(d.color);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      });

    // // add the X Axis
    // this.svg
    //   .append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(this.x));

    // // add the Y Axis
    // this.svg.append("g").call(d3.axisLeft(this.y));
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps, this.props);

    if (!_.isEqual(prevProps.data, this.props.data)) {
      // console.log("refresh idx", this.props.customKey);

      console.log("refresh", this.props.customKey);

      this.refresh();
    }
  }

  refresh = () => {
    const { data } = this.props; // this.getData();

    d3.select(`#svg-${this.props.customKey} .area1`)
      // .transition(50)
      .attr("d", this.area1(data));

    // d3.select(`#svg-${this.props.customKey} .area2`)
    //   // .transition(50)
    //   .attr("d", this.area2(data));

    // d3.select(".line1")
    //   transition(100)
    //   .attr("d", this.valueline1(data));

    // d3.select(".line2")
    //   transition(100)
    //   .attr("d", this.valueline2(data));

    d3.select(`#svg-${this.props.customKey} .line3`)
      // .transition(100)
      .attr("d", this.valueline3(data));

    this.svg
      .select(`.circles-${this.props.customKey}`)
      .selectAll("circle")
      .data(data)
      // .enter()
      // .update("circle")
      // .attr("r", 8)
      .attr("cx", (d) => this.x(d.idx))
      .attr("cy", (d) => this.y(d.actual))
      .attr("fill", (d) => {
        const rgb = spaces.lchab.rgb(d.color);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      });
  };

  render() {
    return (
      <div style={{ float: "left" }}>
        {/* <button onClick={() => this.refresh()}>Refresh</button> */}
        <h4 style={{ marginBottom: 0 }}>{this.props.title}</h4>
        <div id={`svg-${this.props.customKey}`} />
      </div>
    );
  }
}

export default GraphHue;

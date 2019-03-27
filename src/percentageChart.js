import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import * as _ from "lodash";

const PercentageChart = React.createClass({
    getDefaultProps: function() {
        return {
            width: 400, // 1 of 2 columns based on 960 grid
            height: 40,
            fillColor: 'black'
        };
    },
    componentDidMount: function() {
        this.draw();
    },
    draw: function() {
        var data, width, height, id, offset, colors, svg, x, legend;
        data = this.props.data;
        width = +this.props.width;
        height = +this.props.height;
        id = this.props.id; // base for element IDs
        offset = 0;
        // colors = ['#43a2ca', '#7bccc4', '#bae4bc'];
        colors = ['#5ab0c9', '#5ac8c9', '#ade5e6'];

        // this.props.data, this.props.title
        svg = d3.select(ReactDOM.findDOMNode(this))
            .append('svg')
            .attr('width', function() {
                return width + 10;
            })
            .attr('height', height);

        x = d3.scale.linear()
            .domain([0, 100])
            .range([0, width])
            .nice();

        _.forEach(data, function(d) {
            d.value = +d.value;
        });

        svg.append('g')
            .attr('class', 'percent-bars')
            .attr('transform', 'translate(0,0)')
            .attr('width', width) // fudge with to accomodate labels
            .selectAll('.percent-bar')
            .data(data).enter()
            .append('rect')
            .attr('class', 'percent-bar')
            .attr('id', function(d, i) { return 'percent-' + id + '-' + i; })
            //.filter(function(d) { return d.value > 0; })
            .attr('x', function(d) {
                var output;
                output = offset;
                offset += +x(d.value);
                return output;
            })
            .attr('y', 0)
            .attr('height', 15)
            .attr('title', function(d) {
                return d.name + ': ' + d.value + '%';
            })
            .style('fill', function(d, i) {
                return colors[i];
            })
            .on('mouseover', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', true);
                d3.select('#color-key-' + id + '-' + i).classed('hover', true);
                d3.select('#label-' + id + '-' + i).classed('hover', true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', false);
                d3.select('#color-key-' + id + '-' + i).classed('hover', false);
                d3.select('#label-' + id + '-' + i).classed('hover', false);
            })
            .attr('width', 0)
            .transition()
            .duration(800)
            .attr('width', function(d) { return x(d.value); });

        legend = svg.append('g')
            .attr('class', 'legend')
            .attr('width', width)
            .attr('width', 20)
            .attr('transform', 'translate(0,19)');

        // color quares
        legend.selectAll('rect')
            .data(data).enter()
            .append('rect')
            .attr('class', 'color-key')
            .attr('id', function(d, i) {
                return 'color-key-' + id + '-' + i;
            })
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', function(d, i) {
                return width / data.length * i;
            })
            .attr('y', 5)
            .style('fill', function(d, i) {
                return colors[i];
            })
            .on('mouseover', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', true);
                d3.select('#color-key-' + id + '-' + i).classed('hover', true);
                d3.select('#label-' + id + '-' + i).classed('hover', true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', false);
                d3.select('#color-key-' + id + '-' + i).classed('hover', false);
                d3.select('#label-' + id + '-' + i).classed('hover', false);
            })
            .style('opacity', 0)
            .transition()
            .duration(1200)
            .style('opacity', 1);

        // text labels
        legend.selectAll('text')
            .data(data).enter()
            .append('text')
            .attr('class', 'label')
            .attr('id', function(d, i) { return 'label-' + id + '-' + i; })
            .attr('width', 100)
            .attr('x', function(d, i) {
                return width / data.length * i + 15;
            })
            .attr('y', 15)
            .text(function(d) {
                return d.name + ': ' + d.value + '%';
            })
            .on('mouseover', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', true);
                d3.select('#color-key-' + id + '-' + i).classed('hover', true);
                d3.select('#label-' + id + '-' + i).classed('hover', true);
            })
            .on('mouseout', function(d, i) {
                d3.select('#percent-' + id + '-' + i).classed('hover', false);
                d3.select('#color-key-' + id + '-' + i).classed('hover', false);
                d3.select('#label-' + id + '-' + i).classed('hover', false);
            })
            .style('opacity', 0)
            .transition()
            .duration(1200)
            .style('opacity', 1);
    },
    render: function() {
        return <div className="percentage-chart"></div>;
    }
});

export default PercentageChart;

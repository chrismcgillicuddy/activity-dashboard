import React from 'react';
import ReactDOM from 'react-dom';

import * as d3 from "d3";
import * as _ from "lodash";

const MicroBarChart = React.createClass({

    getDefaultProps: function() {
        return {
            width: 220, // 1 of 4 columns based on 960 grid
            height: 50,
            xAxis: false,
            fillColor: 'black',
            period: 30,
            increment: 'day'
        };
    },
    componentDidMount: function() {
        // render chart
        this.draw();
    },
    draw: function() {
        var data, id, increment, parentClass, allTime, hiddenXAxisOffset, formatDay, formatMonth,
            margin, width, height, svg, parents, parseDate, parseYearMonth,
            x, y, z, yAxis, bars, verticalBars, hoverBars, rollup;

        // default properties
        data = this.props.data;
        id =  this.props.id; // base for element IDs
        increment = this.props.increment;
        parentClass = '.' + increment;
        allTime = d3.select('#summary' + id + ' .overview dd span').attr('data-alltime');
        hiddenXAxisOffset = 1;
        margin = {top: 10, right: 0, bottom: 0, left: 40};
        width = this.props.width;
        height = this.props.height - margin.top - margin.bottom;

        // draw grid lines with this
        function makeYAxis() {
            return d3.svg.axis()
              .scale(y)
              .orient('left')
              .ticks(2);
        }

        function tickFormatter(tickVal) {
            return tickVal >= 1000 ? tickVal / 1000 + 'K' : tickVal;
        }

        function tweenText(newValue) {
            var format;
            format = d3.format(',.0f'); // add commas to numbers
            return function() {
                var currentValue, i;
                currentValue = parseInt(this.textContent.replace(/,/g, ''), 10);
                i = d3.interpolateRound(currentValue, newValue);
                return function(t) {
                    this.textContent = format(i(t));
                };
            };
        }

        // set up
        svg = d3.select(ReactDOM.findDOMNode(this))
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(0,' + (margin.top + hiddenXAxisOffset) + ')');

        parents = d3.selectAll('.trend-summaries li');

        // date and number formatting
        parseDate = d3.time.format('%Y-%m-%d').parse;
        parseYearMonth = d3.time.format('%Y-%m').parse;
        formatDay = d3.time.format('%b %d, %Y');
        formatMonth = d3.time.format('%b, %Y');

        // set up scales and axis
        x = d3.scale.ordinal()
            .rangeRoundBands([0, width - margin.left - margin.right], 0);
        y = d3.scale.linear()
            .range([height - margin.top - margin.bottom, 0]);
        // scale for hover bars - no bar spacing
        z = d3.scale.ordinal()
            .rangeRoundBands([0, width - margin.left - margin.right], 0);
        yAxis = d3.svg.axis().scale(y)
            .ticks(2)
            .tickFormat(tickFormatter)
            .orient('left');

        // set up for a day or month chart
        if (increment === 'month') {
            _.forEach(data, function(d) {
                d.name = parseYearMonth(d.name);
                d.value = +d.value;
            });
            // TODO: need to find a better place to house this
            // piggy backing off of the month increment for now
            //   to ensure this value is being initialized once
            // initialize the all time count
            d3.select('#summary' + id + ' .overview dd span')
                .transition()
                .delay(250)
                .tween('html', tweenText(allTime));
        } else {
            _.forEach(data, function(d) {
                d.name = parseDate(d.name);
                d.value = +d.value;
            });
        }

        // X and Y axis domains
        x.domain(data.map(function(d) { return d.name; }));
        z.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data.map(function(d) { return d.value; }))]);

        // draw y-axis
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (margin.left + 5) + ',0)')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0)
            .style('text-anchor', 'end');

        // draw gridlines
        svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',0)')
            .attr('class', 'grid')
            .call(makeYAxis().tickSize(-width, 0, 0).tickFormat(''));

        // draw value bars
        bars = svg.append('g')
            .attr('transform', 'translate(' + (margin.left + 1) + ',0)')
            .attr('class', 'bars')
            .selectAll('.bar')
            .data(data);

        bars.enter().append('rect')
            .attr('class', function(d, i) {
                if (increment === 'day' && i === data.length - 1) {
                    return 'today bar bar' + i;
                } else {
                    return 'bar bar' + i;
                }
            })
            .attr('x', function(d) { return x(d.name); })
            .attr('width', function() {
                if (increment === 'day') {
                    return 12;
                } else {
                    return 13;
                }
            })
            .attr('data-date', function(d) {
                if (increment === 'day') {
                    return formatDay(d.name);
                } else {
                    return formatMonth(d.name);
                }
            })
            .attr('data-value', function(d) { return d.value; })
            // transition
            .attr('y', function() { return height - margin.top - margin.bottom; })
            .attr('height', 0)
            .transition()
            .duration(800)
            .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.value)); })
            .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.value); });

        verticalBars = svg.append('g')
            .attr('transform', 'translate(' + (margin.left + 1) + ',0)')
            .attr('class', 'vertical-bars')
            .selectAll('.vertical-bars')
            .data(data);

        verticalBars.enter().append('rect')
            .attr('class', function(d, i) {
                if (increment === 'day' && i === data.length - 1) {
                    return 'today vertical-bar bar' + i;
                } else {
                    return 'vertical-bar bar' + i;
                }
            })
            .attr('x', function(d) { return z(d.name); })
            .attr('width', function() {
                if (increment === 'day') {
                    return 12;
                } else {
                    return 13;
                }
            })
            .attr('y', 0)
            .attr('height', function() { return height - margin.top - margin.bottom; });

        // draw hover bars
        hoverBars = svg.append('g')
            .attr('transform', 'translate(' + (margin.left + 1) + ',0)')
            .attr('class', 'hover-bars')
            .selectAll('.hover-bars')
            .data(data);

        hoverBars.enter().append('rect')
            .attr('class', function(d, i) {
                if (increment === 'day' && i === data.length - 1) {
                    return 'today hover-bar bar' + i;
                } else {
                    return 'hover-bar bar' + i;
                }
            })
            .attr('x', function(d) { return z(d.name); })
            .attr('width', function() {
                if (increment === 'day') {
                    return 14;
                } else {
                    return 15;
                }
            })
            .attr('y', 0)
            .attr('height', function() { return height - margin.top - margin.bottom; })
            .on('mouseover', function(d, selectedElement) {
                // chart element hover states
                d3.selectAll(parentClass + ' .bar' + selectedElement).classed('hover', true);
                d3.selectAll(parentClass + ' .vertical-bar' + selectedElement).classed('hover', true);
                // for each trend block
                parents.each(function(dd, i) {
                    var value, date;

                    // hover state on metric
                    d3.select('#summary' + i + ' .overview').classed('hover', true);
                    // get value and date to display
                    value = d3.select('#summary' + i + ' ' + parentClass + ' .bar' + selectedElement).attr('data-value');
                    date = d3.select('#summary' + i + ' ' + parentClass + ' .bar' + selectedElement).attr('data-date');
                    // render the value and date
                    d3.select('#summary' + i + ' .overview dd span')
                        .transition()
                        .tween('html', tweenText(value));
                    d3.select('#summary' + i + ' .overview dt').html(date);
                });
            })
            .on('mouseout', function(d, selectedElement) {
                // for each trend block
                parents.each(function(dd, i) {
                    // get the all time metric for this trend
                    var thisAllTime;

                    thisAllTime = d3.select('#summary' + i + ' .overview dd span').attr('data-alltime');
                    // revert to the all time value and label
                    d3.select('#summary' + i + ' .overview dd span')
                        .transition()
                        .tween('html', tweenText(thisAllTime));
                    d3.select('#summary' + i + ' .overview dt').html('All time');
                    d3.select('#summary' + i + ' .overview').classed('hover', false);
                });
                // repeal hover classes in the chart
                d3.selectAll(parentClass + ' .bar' + selectedElement).classed('hover', false);
                d3.selectAll(parentClass + ' .vertical-bar' + selectedElement).classed('hover', false);
            });

        // get sum
        rollup = d3.nest()
            .key(function(d) {
                return d.date;
            })
            .rollup(function(d) {
                return d3.sum(d, function(g) {
                    return +g.value;
                });
            })
           .entries(data);

        // show no activity message
        if (rollup[0].values === 0) {
            svg.append('g')
                .attr('class', 'empty-chart')
                .append('text')
                .attr('x', function() { return width / 2; })
                .attr('y', function() { return height - 25; })
                .attr('class', 'empty-chart-msg')
                .attr('text-anchor', ' middle')
                .text('No Activity');
        }
    },
    render: function() {
        return <div className="micro-bar-chart"></div>;
    }
});

export default MicroBarChart;

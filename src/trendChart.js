import React from 'react';
import * as d3 from "d3";
import MicroBarChart from "./microBarChart";
import PercentageChart from "./percentageChart";

const TrendChart = React.createClass({
      componentWillMount: function() {
        this.setState({
          data: this.props.data
        });
      },
      render: function() {
          let formatMonth, currentMonth, percentages, trends, trendCount;

          formatMonth = d3.time.format('%b'); // abreviate month name
          currentMonth = formatMonth(new Date());
          percentages = this.state.data.percentages;
          trends = this.state.data.trends;
          trendCount = this.state.data.trends.length;

          return (
            <div className="summary-charts">
              <h1>Recent Activity</h1>
                <div className="line percentages">
                {percentages.map(function(result, i) {
                    return (
                        <div className="unit chart-container" key={i}>
                            <h2>{result.label}<span className="range">{result.range}</span></h2>
                            <PercentageChart data={result.chart} id={i} width="445" height="40" fillColor="#60BD68" />
                        </div>
                    );
                })}
              </div>

                <ul className="trend-summaries">
                {trends.map(function(result, i) {
                    return <li className="line chart-container" key={i} id={'summary' + i}>
                      <h2>{result.label}</h2>
                      <div className="unit span-4 metric">
                        <dl className="trend-metric overview">
                          <dd>
                            <span data-alltime={result.allTime}>0</span>
                          </dd>
                          <dt>
                            <span>All time</span>
                          </dt>
                        </dl>
                      </div>
                      <div className="unit span-8">
                        <dl className="trend-metric day">
                          <dd><MicroBarChart data={result.day} period="30" increment="day" id={i} count={trendCount} width="460" height="70" fillColor="" /></dd>
                          <dt>
                            <div className="unit size1of2">Last 30 days</div>
                            <div className="lastUnit size1of2 align-right"><span className="summary-tick"></span>Today</div>
                          </dt>
                        </dl>
                      </div>
                      <div className="unit span-4">
                        <dl className="trend-metric month">
                          <dd><MicroBarChart data={result.month} period="12" increment="month" id={i} count={trendCount} width="220" height="70" fillColor="" /></dd>
                          <dt>
                            <div className="unit size1of2">Last 12 months</div>
                            <div className="lastUnit size1of2 align-right"><span className="summary-tick"></span>{"SEP"}</div>
                          </dt>
                        </dl>
                      </div>
                    </li>;
                })}
                </ul>
            </div>
          );
      }
});

export default TrendChart;

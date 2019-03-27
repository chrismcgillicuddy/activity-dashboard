import React, { Component } from 'react';
import './App.css';
import data from './data/usage.json';
import TrendChart from "./trendChart";

class App extends Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      componentWillMount() {
        this.setState({
          data: data
        });
      }
      render() {
          return (
            <div>
              <a href="../" className="home-button">{"< Home"}</a>
              <TrendChart data={this.state.data} className={'trendy-chart'} title={'pickles'}/>
            </div>
          );
      }
  }

export default App;

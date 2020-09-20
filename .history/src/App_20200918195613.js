import { render } from '@testing-library/react';
import React, {Component} from 'react';
import './App.css';
import AddNumberRoot from "./components/AddNumberRoot";
import DisplayNumberRoot from "./components/DisplayNumberRoot";
import SockJsClient from "react-stomp";
// import Fetch from "json-fetch";
// import randomstring from "randomstring";
import store from "./store";
import { LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import Moment from 'moment';

class App extends Component {
  state = {number:0}

  state = { 
    value: store.getState().value, 
    data: store.getState().data
  }

  constructor(props){
    super(props);
    this.state = {
      clientConnected:false,
      messages:[],
      msg_v:{
        CreatedTime: null,
        Value:null
      }
    };

    store.subscribe(function(){
      this.setState({
        value:store.getState().value,
        data: store.getState().data
      });
    }.bind(this));
  }

  onMessageReceive = (msg, topic) => {
    store.dispatch({
      type:'TOPIC', 
      value:Number(this.state.msg_v.Value),
      data:[
        Date.UTC(Moment(Date(this.state.msg_v.CreatedTime)).format('YYYY-MM-DD HH:mm:ss')),
        Number(this.state.msg_v.Value)
      ]
    });

    this.setState(prevState => ({
      messages: [...prevState.messages, msg],
      msg_v:msg
    }));
  }

  render(){
    const wsSourceUrl = "http://localhost:8765/api/timecheck/live";
    
    const {CreatedTime, Value} = this.state.msg_v;
    
    const options = {
      chart: {
        zoomType:'x',
        resetZoomButtion:{
          position:{ align:'right', verticalAlign:'top'},
          relativeTo: 'chart'
        }
      },

      title: {
        text: 'My chart'
      },

      time: {
        useUTC: false
      },
    
      rangeSelector: {
        buttons: [{
          count: 1,
          type: 'minute',
          text: '1M'
        }, {
          count: 5,
          type: 'minute',
          text: '5M'
        }, {
          type: 'all',
          text: 'All'
        }],
        inputEnabled: false,
        selected: 0
      },

      xAxis: {
        type: 'datetime',
        labels: {
          format: "{value:%Y-%m-%d %H:%M:%S.%L}"
        },
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e. %b',
          week: '%e. %b',
          month: '%b \'%y',
          year: '%Y'
        }        
      },

      series: [{
        name: 'Random data',
        data: this.state.data
      }]
    }
    
    return (
      <div className="App">
        <h1>Root</h1>
        <AddNumberRoot></AddNumberRoot>
        <DisplayNumberRoot></DisplayNumberRoot>

        <SockJsClient url={ wsSourceUrl } topics={["/topic/test"]}
        onMessage={ this.onMessageReceive } ref= { (client) => {this.clientRef = client }}
        onConnect = { () => {this.setState({ clientConnected: true })}}
        onDisconnect= { () => { this.setState({ clientConnected: false })}}
        debug={ false }></SockJsClient>

        <h2>CreatedTime : {CreatedTime}</h2>
        <h2>Value : {Value}</h2>
        <h2>Sum : {this.state.value}</h2>
        <LineChart width={730} height={250} data={this.state.messages}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="CreatedTime" />
            <YAxis dataKey="Value"/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Value" stroke="#0095FF" />
        </LineChart>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }
}

export default App;

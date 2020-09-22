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
import Highcharts from "highcharts/highstock";
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

    var date = Date.UTC(Number(msg.CreatedTime.substring(0,4)),Number(msg.CreatedTime.substring(5,7))-1,Number(msg.CreatedTime.substring(8,10))-1,
    Number(msg.CreatedTime.substring(11,13)),Number(msg.CreatedTime.substring(14,16)),Number(msg.CreatedTime.substring(17,19)),
    Number(msg.CreatedTime.substring(20,23)));

    store.dispatch({
      type:'TOPIC', 
      value:Number(this.state.msg_v.Value),
      data:[
        //Moment(Date(this.state.msg_v.CreatedTime)).format('YYYY-MM-DD HH:mm:ss').,
        //Moment.utc(Moment(Date(this.state.msg_v.CreatedTime)).format('YYYY-MM-DD HH:mm:ss')).valueOf(),
        date,
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

      yAxis:{
        plotLines: [{
          width:3,
          color:'#FA5858',
          dashStyle:'dashdot',
          value:500,
          label:{
            text:'상한 기준 : ',
            align:'left',
            style:{
              color:'#FA5858',
              fontSize:'11px'
            },
            x:10
          }
        },{
          width:3,
          color:'#FA5858',
          dashStyle:'dashdot',
          value:300,
          label:{
            text:'상한 기준 : ',
            align:'left',
            style:{
              color:'#FA5858',
              fontSize:'11px'
            },
            x:10
          }
        }]
      },

      title: {
        text: 'My chart'
      },
    
      rangeSelector: {
        selected: 5
      },

      // rangeSelector: {
      //   enabled: true,
      //   buttons: [{
      //     count: 1,
      //     type: 'minute',
      //     text: '1M'
      //   }, {
      //     count: 5,
      //     type: 'minute',
      //     text: '5M'
      //   }, {
      //     type: 'all',
      //     text: 'All'
      //   }],
      //   inputEnabled: false,
      //   selected: 0
      // },

      navigator:{ 
        xAxis: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y',
            year: '%Y'
          },
          tickWidth: 0,
          lineWidth: 1,
          gridLineWidth: 1,
          tickPixelInterval: 200,
          labels: {
            align: 'left',
            style: {
              color: '#888'
            },
            x: 3,
            y: -4, 
          }
        },
        height: 20
        //top:
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
        data: this.state.data,
        dataGrouping: {
            enabled: false
        }
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
          //highcharts={HighchartsStock}
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={options}
        />
      </div>
    );
  }
}

export default App;

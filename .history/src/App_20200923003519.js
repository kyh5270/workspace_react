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

class App extends Component {
  state = {number:0}

  state = { 
    data: store.getState().data,
    createdtime: store.getState().createdtime,
    value: store.getState().value,
    rsvalue: store.getState().rsvalue,
    xcontrolcl: store.getState().xcontrolcl,
    xcontrolucl: store.getState().xcontrolucl,
    xcontrollcl: store.getState().xcontrollcl,
    rscontrolcl: store.getState().rscontrolcl,
    rscontrolucl: store.getState().rscontrolucl,
  }

  constructor(props){
    super(props);
    this.state = {
      clientConnected:false,
      messages:[],
      msg_v:{
        CreatedTime: null,
        Value:null,
        RsValue:null,
        XControlCL:null,
        XControlUCL:null,
        XControlLCL:null,
        RsControlCL:null,
        RsControlUCL:null
      }
    };

    store.subscribe(function(){
      this.setState({
        data:store.getState().data,
        createdtime:store.getState().createdtime,
        value:store.getState().value,
        rsvalue:store.getState().rsvalue,
        xcontrolcl:store.getState().xcontrolcl,
        xcontrolucl:store.getState().xcontrolucl,
        xcontrollcl:store.getState().xcontrollcl,
        rscontrolcl:store.getState().rscontrolcl,
        rscontrolucl:store.getState().rscontrolucl        
      });
    }.bind(this));
  }

  onMessageReceive = (msg, topic) => {

    var date = Date.UTC(Number(msg.CreatedTime.substring(0,4)),Number(msg.CreatedTime.substring(5,7))-1,Number(msg.CreatedTime.substring(8,10))-1,
    Number(msg.CreatedTime.substring(11,13)),Number(msg.CreatedTime.substring(14,16)),Number(msg.CreatedTime.substring(17,19)),
    Number(msg.CreatedTime.substring(20,23)));

    console.log("now date : " + date);
    console.log("now Value : " + this.state.data);

    store.dispatch({
      type:'TOPIC', 
      data:[
        //Moment(Date(this.state.msg_v.CreatedTime)).format('YYYY-MM-DD HH:mm:ss').,
        //Moment.utc(Moment(Date(this.state.msg_v.CreatedTime)).format('YYYY-MM-DD HH:mm:ss')).valueOf(),
        date,
        Number(this.state.msg_v.Value)
      ],
      createdtime:Number(this.state.msg_v.CreatedTime),
      value:Number(this.state.msg_v.Value),
      rsvalue:Number(this.state.msg_v.RsValue),
      xcontrolcl:Number(this.state.msg_v.XControlCL),
      xcontrolucl:Number(this.state.msg_v.XControlUCL),
      xcontrollcl:Number(this.state.msg_v.XControlLCL),
      rscontrolcl:Number(this.state.msg_v.RsControlCL),
      rscontrolucl:Number(this.state.msg_v.RsControlUCL)
    });

    this.setState(prevState => ({
      messages: [...prevState.messages, msg],
      msg_v:msg,
      data:[date, msg.Value]
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
        max: this.state.xcontrolucl * 1.5,
        min: this.state.xcontrollcl * 1.5,
        plotLines: [{
          width:3,
          color:'#FA5858',
          dashStyle:'dashdot',
          value:this.state.xcontrolucl,
          label:{
            text:'UCL : ' + this.state.xcontrolucl,
            align:'left',
            style:{
              color:'#000000',
              fontSize:'11px'
            },
            x:10
          }
        },{
          width:3,
          color:'#09A9FF',
          dashStyle:'dashdot',
          value:this.state.xcontrolcl
        },{
          width:3,
          //color:'#01DF01',
          color:'#FA5858',
          dashStyle:'dashdot',
          value:this.state.xcontrollcl,
          label:{
            text:'LCL : ' + this.state.xcontrollcl,
            align:'left',
            style:{
              color:'#000000',
              fontSize:'11px'
            },
            x:10
          }
        }],
        plotBands: [{
          from: this.state.xcontrolcl,
          to: this.state.xcontroucl,
          color: 'rgba(68, 170, 213, 0.2)',
          label: {
              text: 'value range'
          }
        }]
      },

      title: {
        text: 'SPC Chart'
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
        plotLines: [{
          dashStyle:'dashdot',
          color: '#000000',
          value: this.state.value,
          width: 3,
          label: {
            align: 'right',
            text: 'Now Value'
          }
        }],
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
        name: 'data',
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
          containerProps={{ style: { height: "500px", width: "1000px" } }}
        />
      </div>
    );
  }
}

export default App;

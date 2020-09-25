import { render } from '@testing-library/react';
import React, {Component} from 'react';
import './App.css';
import AddNumberRoot from "./components/AddNumberRoot";
import DisplayNumberRoot from "./components/DisplayNumberRoot";
import SockJsClient from "react-stomp";
// import Fetch from "json-fetch";
// import randomstring from "randomstring";
import store from "./store";
//import { LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";
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

    var nowValue = Number(msg.Value);

    console.log("now date : " + this.state.data);
    console.log("now nowValue : " + nowValue);
    console.log("now this.state.msg_v.Value : " + this.state.msg_v.Value);

    store.dispatch({
      type:'TOPIC', 
      data:[
        date,
        Number(msg.Value)
      ],
      createdtime:Date.UTC(Number(msg.CreatedTime.substring(0,4)),Number(msg.CreatedTime.substring(5,7))-1,Number(msg.CreatedTime.substring(8,10))-1,
        Number(msg.CreatedTime.substring(11,13)),Number(msg.CreatedTime.substring(14,16)),Number(msg.CreatedTime.substring(17,19)),
        Number(msg.CreatedTime.substring(20,23))),
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

      xAxis: {
        type: 'datetime',
        plotLines: [{
          dashStyle:'dashdot',
          color: '#000000',
          value: this.state.createdtime,
          width: 3,
          label: {
            align: 'center',
            rotation: 360,
            x: - 60,
            text: 'Now Value : ' + this.state.value
          }
        }],
        // labels: {
        //   format: "{value:%Y-%m-%d %H:%M:%S.%L}"
        // },
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

      yAxis:{
        max: this.state.xcontrolucl * 1.5,
        min: this.state.xcontrollcl * 1.5,
        plotLines: [{
          width:3,
          color:'#FA5858',
          dashStyle:'dashdot',
          value:this.state.xcontrolucl,
          zIndex: 5,
          label:{
            text:'UCL : ' + this.state.xcontrolucl,
            align:'left',
            style:{
              color:'#000000',
              fontSize:'11px'
            },
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
          zIndex: 5,
          label:{
            text:'LCL : ' + this.state.xcontrollcl,
            align:'left',
            style:{
              color:'#000000',
              fontSize:'11px'
            },
          }
        }],
        plotBands: [{
          from: this.state.xcontrollcl,
          to: this.state.xcontrolucl,
          color: '#FFFACF',
          label: {
              text: 'value range'
          }
        }]
      },

      title: {
        text: 'SPC X-Rs ControlChart'
      },
    
      rangeSelector: {
        enabled: true,
        inputEnabled: false,
        selected: 0
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
        adaptToUpdatedData: false,
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
        <h1>SPC ControlChart</h1>
        {/* <AddNumberRoot></AddNumberRoot>
        <DisplayNumberRoot></DisplayNumberRoot> */}

        <SockJsClient 
          url={ wsSourceUrl } 
          topics={["/topic/test"]}
          onMessage={ this.onMessageReceive } 
          ref= { (client) => {this.clientRef = client }}
          onConnect = { () => {this.setState({ clientConnected: true })}}
          onDisconnect= { () => { this.setState({ clientConnected: false })}}
          debug={ false }>        
        </SockJsClient>

        <h2>Test</h2>
        <h2>CreatedTime : {CreatedTime}</h2>
        <h2>Value : {Value}</h2>
        {/* <LineChart width={730} height={250} data={this.state.messages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CreatedTime" />
          <YAxis dataKey="Value"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Value" stroke="#0095FF" />
        </LineChart> */}
        <HighchartsReact
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

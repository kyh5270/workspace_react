import { render } from '@testing-library/react';
import React, {Component} from 'react';
import './App.css';
import AddNumberRoot from "./components/AddNumberRoot";
import DisplayNumberRoot from "./components/DisplayNumberRoot";
import SockJsClient from "react-stomp";
import Fetch from "json-fetch";
import randomstring from "randomstring";
import store from "./store";

class App extends Component {
  state = {number:0}

  state = { value: store.getState().value }

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
      this.setState({value:store.getState().value});
    }.bind(this));
  }

  onMessageReceive = (msg, topic) => {
    this.setState(prevState => ({
        messages: [...prevState.messages, msg],
        msg_v:msg
    }));
  }

  render(){
    const wsSourceUrl = "http://localhost:8765/api/timecheck/live";
    
    const {CreatedTime, Value} = this.state.msg_v;
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
        <h2>Valeu : {this.state.value}</h2>
      </div>
    );
  }
}

export default App;

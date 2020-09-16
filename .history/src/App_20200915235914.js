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

  state = { number: store.getState().number }
  constructor(props){
    super(props);
    store.subscribe(function(){
      this.setState({number:store.getState().number});
    }.bind(this));
  }

  onMessageReceive = {msg, topic} => {
    this.setState(prevState => ({
        messages: [...prevState.messages, msg]
    }));
  }

  render(){
    const wsSourceUrl = "http://221.144.71.126:8765/api/timecheck/live";
    
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
      </div>
    );
  }
}

export default App;

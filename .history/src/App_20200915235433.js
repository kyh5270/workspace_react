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
    return (
      <div className="App">
        <h1>Root</h1>
        <AddNumberRoot></AddNumberRoot>
        <DisplayNumberRoot></DisplayNumberRoot>

        <input type="text" value={this.state.number} onClick={function(){
          store.dispatch({type:'INCREMENT', size:this.state.size});
        }.bind(this)}></input>
      </div>
    );
  }
}

export default App;

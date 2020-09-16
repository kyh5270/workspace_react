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
  render(){
    return (
      <div className="App">
        <h1>Root</h1>
        <AddNumberRoot></AddNumberRoot>
        <DisplayNumberRoot></DisplayNumberRoot>

        <input type="button" value="+" onClick={function(){
          store.dispatch({type:'INCREMENT', size:this.state.size});
        }.bind(this)}></input>
      </div>
    );
  }
}

export default App;

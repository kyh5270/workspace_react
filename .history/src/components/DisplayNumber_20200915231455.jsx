import React, {Component} from 'react';
import store form "../sotre";

export default class DisplayNumber extends Component {
    state = {number:store.getState().number}
    render() {
      return (
        <div>
          <h1>Display Number</h1>
          <input type="text" value={this.state.number} readOnly></input>
        </div>
      )
    }
  }

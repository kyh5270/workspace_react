import React, { Component } from "react";
import AddNumber from "../components/AddNumber";

export default class AddNumberRoot extends Component {
  render() {
    return (
      <div>
        <h1>Add Number Root</h1>
        <AddNumber onClick={function(size){
          alert('size : '+size)
        }.bind(this)}></AddNumber>
      </div>
    );
  }
}

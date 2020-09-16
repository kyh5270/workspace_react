import React, {Component} from 'react';
import AddNumber from "../components/DisplayNumber";

export default class DisplayNumberRoot extends Component{
    render(){
      return (
        <div>
          <h1>Display Number Root</h1>
          <DisplayNumber></DisplayNumber>
        </div>
      )
    }
  }

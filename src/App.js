import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weight: -1
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = w => {
    this.setState({
      weight: w
    })
  }

  graph = {
      nodes: [
          { id: 1, label: 'a' },
          { id: 2, label: 'b' },
          { id: 3, label: 'c' },
          { id: 4, label: 'd' },
          { id: 5, label: 'e' }
      ],
      edges: [{ from: 1, to: 2, label: 5, id: 1}, { from: 1, to: 3, label: 10, id: 2}, { from: 2, to: 4, label:8 }, { from: 2, to: 5, label: 2 }]
  };
 
  options = {
      height: "600",
      width: "600",
      interaction: {dragNodes: false, dragView: false, zoomView:false},
      layout: {
          hierarchical: true
      },
      edges: {
          color: '#000000'
      }
  };
   
  events = {
      select: function(event) {
          var { nodes, edges } = event;
          console.log(edges[0]);
          if (edges[0]==1){
                this.handleClick=(5)
          }
          
      }
  };
   
  render() {
    return (
    <div>
      <h1>DIJKSTRA!!!</h1>
       <Graph graph={this.graph} options={this.options} events={this.events}></Graph>
       <p>Points Available: {this.state.weight}</p>
     </div>
    )
  }
}

export default App;

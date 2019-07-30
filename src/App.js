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

    this.setNetworkInstance = this.setNetworkInstance.bind(this)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = id => {
    console.log(this.network)
    this.network.clustering.updateEdge(id, {color : 'red'})
    
    this.setState({
      weight: this.e[id],
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
      edges: [{ from: 1, to: 2, label: 5, id: 1}, { from: 1, to: 3, label: 10, id: 2}, { from: 2, to: 4, label:8, id: 3 }, { from: 2, to: 5, label: 2, id: 4 }]
  };

  e = [0, 5, 3, 8, 2]
 
  options = {
      height: "600",
      width: "600",
      interaction: {dragNodes: false, dragView: false, zoomView:false, selectable: false},
      physics: {enabled:false},
      layout: {
          hierarchical: true
      },
      edges: {
          color: 'green',
          arrows:{to:{enabled: false}},
          width: "10"
      }
  };
   
  events = {
      click: event => {
        var {pointer} = event;
        console.log(event)
        let edgeId = this.network.getEdgeAt({x: pointer.DOM.x, y: pointer.DOM.y});
        this.handleClick(edgeId)

      }
  };
   
  setNetworkInstance = nw => {
    this.network = nw
  };

  render() {
    return (
    <div>
      <h1>DIJKSTRA!!!</h1>
       <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events}></Graph>
       <p>Points Available: {this.state.weight}</p>
     </div>
    )
  }
}

export default App;

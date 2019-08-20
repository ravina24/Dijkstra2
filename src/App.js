import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import dijkstra from "./dijkstra"

class App extends Component {

    // Constants
    SOLUTION_EDGE_COLOR = 'purple';
    SOLUTION_EDGE_WEIGHT = '5';
    GENERATED_GRAPH_NUMBER_OF_NODES = 10;
    GENERATE_CUSTOM_GRAPH = true;
    GENERATED_GRAPH_CONNECTION_PROBABILITY = 0.12; // the actual probability is a bit higher than this.
    /*
      Actual probabiilty of connection between two nodes: 100% if their indices are adjacent, and 2*probability - probability*2 if not
    */
    GENERATED_GRAPH_MAX_EDGE_WEIGHT = 15;




    // "Global" variables

    solutionEdges = {}; // from Dijkstra algorithm

    graph = {
        nodes: [
            { id: 1, label: '1' },
            { id: 2, label: '2' },
            { id: 3, label: '3' },
            { id: 4, label: '4' },
            { id: 5, label: '5' }
        ],
        edges: [{ from: 1, to: 2, label: 5, id: 1 }, { from: 1, to: 3, label: 10, id: 2 }, { from: 2, to: 4, label: 8, id: 3 }, { from: 2, to: 5, label: 2, id: 4 }]
    };


    options = {
        height: "600",
        width: "1000",
        interaction: { dragNodes: false, dragView: false, zoomView: false, selectable: false },
        physics: { enabled: false },
        layout: {
            hierarchical: false
        },
        edges: {
            color: 'green',
            arrows: { to: { enabled: false } },
            width: 7
        }
    };

    events = {
        click: event => {
            var { pointer } = event;
            console.log(event)
            let edgeId = this.network.getEdgeAt({ x: pointer.DOM.x, y: pointer.DOM.y });
            this.handleClick(edgeId);

        }
    };


    // Methods
    constructor(props) {
        super(props);
        this.state = {
            weight: -1,
            game_over: false,
            win: false,
            lose: false,
	    userPath: [],
	    dijkstraPath: [],
	    currentNodeId: 1,
            lastSelectedEdgeId: -1,
        };

        // generate graph and run dijkstra to set solutionEdges global variable
        this.generateGraph();
        this.runDijkstra();

        this.setNetworkInstance = this.setNetworkInstance.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleWin = this.handleWin.bind(this);
        this.handleLose = this.handleLose.bind(this);
    }

    // Used by generateNodes. Each node's ID matches its label.
    generateNode(id){
      return { id: id, label: id.toString() };
    }

    // Used by generateGraph
    generateNodes(){
      const num = this.GENERATED_GRAPH_NUMBER_OF_NODES;
      const nodes = [];
      var i;
      for (i = 0; i < num; i++){
        nodes.push(this.generateNode(i));
      }
      return nodes;
    }

    // used by generateEdge to generate a random edge weight in [1 .. GENERATED_GRAPH_MAX_EDGE_WEIGHT]
    generateEdgeWeight(){
      return Math.floor(Math.random() * this.GENERATED_GRAPH_MAX_EDGE_WEIGHT) + 1;
    }

    // Used by generateEdges
    generateEdge(id1, id2, edgeId){
      const weight = this.generateEdgeWeight();
      console.log("WEIGHT:" + weight)
      const edge = { from: id1, to: id2, label: weight, id: edgeId};
      console.log("GENERATED EDGE: " + edge.toString());
      return edge;
    }

    canAddEdge(id1, id2, edges){
      // DEBUG:
      if (id1 == id2) {
        return false;
      }
      var canAdd = true;
	    var i;
      for (i = 0; i < edges.length; i++){
        if ((edges[i].from === id1 && edges[i].to === id2) || (edges[i].from === id2 && edges[i].to === id1)){
          canAdd = false;
          break;
        }
      }
      return canAdd;
    }

    // Used by generateGraph
    generateEdges(nodes){
      const edges = [];
      // connect the nodes so the graph is connected
      // Go from 1 -> end in a loop
      var i;
      var j;
      var edgeId = 1;
      for (i = 0; i < nodes.length-1; i++, edgeId++){
          edges.push(this.generateEdge(i, i+1, edgeId));
      }

      // add extra edges to spice things up
      // if a node is not connected to another node, connect them with random probability
      for (i = 0; i < nodes.length; i++){
          // add edge if the generated number is in range and 
          for (j = 0; j < nodes.length; j++)
          if (this.canAddEdge(i, j, edges)){
            const r = Math.random(); // [0,1)
            if (r < this.GENERATED_GRAPH_CONNECTION_PROBABILITY){
              edges.push(this.generateEdge(i, j, edgeId));
              edgeId++;
            }
          }
      }

      return edges;
    }

    generateGraph() {
        const generatedNodes = this.generateNodes();
        const generatedEdges = this.generateEdges(generatedNodes);

        // Set the graph
        if (this.GENERATE_CUSTOM_GRAPH){
          this.graph = {
            nodes: generatedNodes,
            edges: generatedEdges
          };
        }
    }

    copyEdges(edges){
      const copy = [];
      var edgeId = this.graph.edges.length;
      edges.forEach(e => copy.push({to: e.to, from: e.from, label: e.label, id: ++edgeId}));
      return copy;
    }

    runDijkstra() {
        const solution = dijkstra(this.graph, this.graph.nodes[0], this.graph.nodes[4]);
        this.solutionEdges = this.copyEdges(solution);
	      
        // Calculate total points (optimal path total weight)
        var sum = 0;
        this.solutionEdges.forEach(edge => sum += edge.label);
        this.state.weight = sum;

        // set the edges' color
        this.solutionEdges.forEach(edge => edge.color = this.SOLUTION_EDGE_COLOR);
        // make the edges a bit smaller
        this.solutionEdges.forEach(edge => edge.width = this.SOLUTION_EDGE_WEIGHT);
    }



    handleClick = id => {
	    console.log(id)
	    let from = this.graph.edges[id-1].from;
	    let to = this.graph.edges[id-1].to;
	    if((from === this.state.currentNodeId 
		    || to === this.state.currentNodeId)
		    && this.state.lastSelectedEdgeId !== id){
      		this.network.clustering.updateEdge(id,{color: 'red'})
      		this.state.userPath.push({from : this.graph.edges[id-1].from, to : this.graph.edges[id-1].to})
      		    //console.log(this.state.userPath);
      		    //console.log(this.state.weight);
      		let nodeId = (from === this.state.currentNodeId) ? to : from;
      		console.log(nodeId)
      		console.log(this.state.currentNodeId + " state ");
      		this.setState({
      			weight: this.state.weight - this.graph.edges[id-1].label,
      			currentNodeId: nodeId,
      			lastSelectedEdgeId: id,
      		})
      }

      if(this.state.weight == 0) {
        this.handleWin();
      } else if(this.state.weight < 0) {
        this.handleLose();
      }
    }



    setNetworkInstance = nw => {
        this.network = nw
    };

    handleWin() {
      // Optional:
      alert("you won!");
      
        this.setState({
            gameOver: true,
            win: true,
            lose: false
        })
    }

    handleLose() {
      // Optional:
      alert("you lose!");

        this.setState({
            gameOver: true,
            win: false,
            lose: true
        })
    }

    // Unused atm
    handleRestart() {
        this.setState({
            gameOver: false,
            win : false,
            lose : false
        })
    }

    winScreen() {
        // Can make this fancier later
        return <div><h1>You win!</h1>
            <h6>Thanks for coming to my TED talk</h6></div>;
    }

    // Displays a losing message, plus algorithm solution
    loseScreen() {
        // set the solution edges' color
        this.solutionEdges.forEach(edge => edge.color = this.SOLUTION_EDGE_COLOR);
        // make the edges a bit smaller
        this.solutionEdges.forEach(edge => edge.width = this.SOLUTION_EDGE_WEIGHT);

        // Display it
        return <div>
            <h1>You lost!</h1>
            <h3>You would've won if you went with the {this.SOLUTION_EDGE_COLOR} path:</h3>
            <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events}></Graph>
        </div>
    }


    render() {
        // game is over:
        if (this.state.gameOver) {
            if (this.state.win) {
                return this.winScreen();
            } else if (this.state.lose) {
                return this.loseScreen();
            } else {
                throw "PROBLEM: state.game_over is TRUE but both state.win and state.lose are FALSE!";
            }
        }

        // game is not over:
        else return (
            <div>
                <h1>DIJKSTRA!!!</h1>
                <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events}></Graph>
                <p>Points Available: {this.state.weight}</p>
            </div>
        )
    }
}

export default App;

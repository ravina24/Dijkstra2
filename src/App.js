import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';

class App extends Component {

    // Constants
    SOLUTION_EDGE_COLOR = 'purple';
    SOLUTION_EDGE_WEIGHT = '5';
    GENERATED_GRAPH_NUMBER_OF_NODES = 10;
    GENERATE_CUSTOM_GRAPH = false;

    // "Global" variables

    solutionEdges = {}; // from Djikstra algorithm

    graph = {
        nodes: [
            { id: 1, label: 'a' },
            { id: 2, label: 'b' },
            { id: 3, label: 'c' },
            { id: 4, label: 'd' },
            { id: 5, label: 'e' }
        ],
        edges: [{ from: 1, to: 2, label: 5, id: 1 }, { from: 1, to: 3, label: 10, id: 2 }, { from: 2, to: 4, label: 8, id: 3 }, { from: 2, to: 5, label: 2, id: 4 }]
    };

    e = { 1: 5, 2: 3, 3: 8, 4: 2};

    options = {
        height: "600",
        width: "600",
        interaction: { dragNodes: false, dragView: false, zoomView: false, selectable: false },
        physics: { enabled: false },
        layout: {
            hierarchical: true
        },
        edges: {
            color: 'green',
            arrows: { to: { enabled: false } },
            width: "10"
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
	    currentNodeId: 2,
            lastSelectedEdgeId: -1,
        };

        // generate graph and run djikstra to set solutionEdges global variable
        this.generateGraph();
        this.runDjikstra();

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

    // Used by generateGraph
    generateEdges(nodes){

      // TODO!!

      // connect the nodes so the graph is connected


      // add extra edges to spice things up


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

    runDjikstra() {
        this.solutionEdges = djikstra(this.graph);

        // Calculate total points (optimal path total weight)
        var sum = 0;
        this.solutionEdges.forEach(edge => sum += edge.weight);
        this.setState({weight: sum});


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
			weight: this.state.weight - this.e[id],
			currentNodeId: nodeId,
			lastSelectedEdgeId: id,
		})
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
        // Add the solution's edges to be displayed alongside the user's edges
        this.graph.edges.concat(this.solutionEdges);

        // Display it
        return <div>
            <h1>You lost!</h1>
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

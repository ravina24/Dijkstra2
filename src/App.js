import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import dijkstra from "./dijkstra";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import GraphGenerator from './GraphGenerator';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class App extends Component {

    // "Global" variables
    SOLUTION_EDGE_COLOR = 'purple';
    solutionEdges = {}; // from Dijkstra algorithm

    graph = {
        nodes: [
            { id: 1, label: 'A' },
            { id: 2, label: 'B' },
            { id: 3, label: 'C' },
            { id: 4, label: 'D' },
            { id: 5, label: 'E' }
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
            currentNodeId: 0,
            lastSelectedEdgeId: -1,
        };

        // generate graph and run dijkstra to set solutionEdges global variable
        new GraphGenerator().generateGraph(this.graph);

        console.log(this.graph);

        this.runDijkstra(true);

        this.setNetworkInstance = this.setNetworkInstance.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleWin = this.handleWin.bind(this);
	this.handleRestart = this.handleRestart.bind(this);
        this.handleLose = this.handleLose.bind(this);
	this.regenerate = this.regenerate.bind(this);
    }



    copyEdges(edges) {
        const copy = [];
        var edgeId = this.graph.edges.length;
        edges.forEach(e => copy.push({ to: e.to, from: e.from, label: e.label, id: ++edgeId }));
        return copy;
    }

    runDijkstra(isFromConstructor) {
        console.log(this.graph.nodes.length);
        console.log(this.graph.nodes[0]);
        console.log(this.graph.nodes[this.graph.nodes.length - 1]);
        this.solutionEdges = dijkstra(this.graph, this.graph.nodes[0], this.graph.nodes[this.graph.nodes.length - 1]);

        console.log(this.solutionEdges);

        // Calculate total points (optimal path total weight)
        var sum = 0;
        this.solutionEdges.forEach(edge => {
            sum += edge.label;
        });
	    if(isFromConstructor){
        this.state.weight = sum;
	    }
	    else{
		    this.setState(
{
            weight: sum,
            game_over: false,
            win: false,
            lose: false,
            userPath: [],
            currentNodeId: 0,
            lastSelectedEdgeId: -1,
        }
		    );

	    }
    }



    handleClick = id => {

        console.log(id);

        let from = this.graph.edges[id - 1].from;
        let to = this.graph.edges[id - 1].to;

        if ((from === this.state.currentNodeId
            || to === this.state.currentNodeId)
            && this.state.lastSelectedEdgeId !== id) {

            this.network.clustering.updateEdge(id, { color: 'red' });
            this.state.userPath.push({ from: this.graph.edges[id - 1].from, to: this.graph.edges[id - 1].to })
            let nodeId = (from === this.state.currentNodeId) ? to : from;
            console.log(this.state.currentNodeId + " state ");
            this.setState({
                weight: this.state.weight - this.graph.edges[id - 1].label,
                currentNodeId: nodeId,
                lastSelectedEdgeId: id
            });
        }

        if (this.state.weight === 0) {
		setTimeout(() => {this.handleWin()}, 100);
        } else if (this.state.weight < 0) {
		setTimeout(() => {this.handleLose()}, 100);
        }
    }



    setNetworkInstance = nw => {
        this.network = nw;
    };

    handleWin() {
        // Optional:
        alert("you won!");
    }

    handleLose() {
        // Optional:
        alert("you lose! solution shown in purple");

        console.log("updating solution edge");
        this.solutionEdges.forEach(solutionEdge => this.network.clustering.updateEdge(solutionEdge.id, { color: this.SOLUTION_EDGE_COLOR }));
    }

    // Unused atm
    handleRestart() {
        this.setState({
            gameOver: false,
            win: false,
            lose: false
        });

    }

	regenerate(){
		console.log("bla");
new GraphGenerator().generateGraph(this.graph);

        console.log(this.graph);

		this.runDijkstra(false);
		console.log(this.graph.nodes);
		console.log(this.graph.edges);

		this.network.setData({nodes : this.graph.nodes, edges : this.graph.edges});
	}

    render() {
        return (
            <div>

            <h1>DIJKSTRA</h1>
              <Container>
                <Row>
                  <Col md="6">
                    <div>
                        <h2>Start Node: {this.graph.nodes[0].label}</h2>
                        <h2>End Node: {this.graph.nodes[this.graph.nodes.length - 1].label}</h2>
                        <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events}></Graph>
                            <p>Points Available: {this.state.weight}</p>
                      </div>
                  </Col>
                  <Col md="6">
                    <p>Welcome to the Dijkstra Visualization game. The Dijkstra algorithm was created by Edsger W. Dijkstra in 1956. This algorithm finds the shortest path in a graph given a start node and end node. The shortest path of a graph is defined as the path with minimum weight. The weight is calculated by adding up the weights of the individual edges in the path.</p>
                    <p>Your goal is to find the shortest path in this graph by guessing which edges to click. To win, your path must match the shortest path found by the Dijkstra algorithm. To learn more about the Dijkstra algorithm, please watch this video:</p>
                    <a href="https://www.youtube.com/watch?v=gdmfOwyQlcI">Dijkstra Algorithm Video</a>
                  </Col>
	  </Row>
	  <Button variant="primary" onClick={() => this.regenerate()}>Push me</Button>
	
              </Container>
            </div>
        )
    }
}

export default App;

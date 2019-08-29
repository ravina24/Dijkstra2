import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import dijkstra from "./dijkstra";
import GraphGenerator from './GraphGenerator';

class App extends Component {

    // "Global" variables

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
            dijkstraPath: [],
            currentNodeId: 1,
            lastSelectedEdgeId: -1,
        };

        // generate graph and run dijkstra to set solutionEdges global variable
        new GraphGenerator().generateGraph(this.graph);

        console.log(this.graph);

        this.runDijkstra();

        this.setNetworkInstance = this.setNetworkInstance.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleWin = this.handleWin.bind(this);
        this.handleLose = this.handleLose.bind(this);
    }



    copyEdges(edges) {
        const copy = [];
        var edgeId = this.graph.edges.length;
        edges.forEach(e => copy.push({ to: e.to, from: e.from, label: e.label, id: ++edgeId }));
        return copy;
    }

    runDijkstra() {
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

        this.state.weight = sum;
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
            console.log(nodeId);
            console.log(this.state.currentNodeId + " state ");
            this.setState({
                weight: this.state.weight - this.graph.edges[id - 1].label,
                currentNodeId: nodeId,
                lastSelectedEdgeId: id
            });
        }

        if (this.state.weight === 0) {
            this.handleWin();
        } else if (this.state.weight < 0) {
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
            win: false,
            lose: false
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
            <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events} />
        </div>;
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
                <h2>Start Node: {this.graph.nodes[0].label}</h2>
                <h2>End Node: {this.graph.nodes[this.graph.nodes.length - 1].label}</h2>
                <Graph getNetwork={this.setNetworkInstance} graph={this.graph} options={this.options} events={this.events}></Graph>
                <p>Points Available: {this.state.weight}</p>
            </div>
        )
    }
}

export default App;

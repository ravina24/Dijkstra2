import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';

class App extends Component {

    // Constants
    SOLUTION_EDGE_COLOR = 'purple';
    SOLUTION_EDGE_WEIGHT = '5';

    // "Global" variables

    solution_edges = {}; // from Djikstra algorithm
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

    e = [0, 5, 3, 8, 2]

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
            solution_edges: null
        };

        // generate graph and run djikstra here
        generate_graph();
        run_djikstra();

        this.setNetworkInstance = this.setNetworkInstance.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleWin = this.handleWin.bind(this);
        this.handleLose = this.handleLose.bind(this);
    }

    generate_graph() {
        // TODO: GENERATE RANDOM GRAPH
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
    }

    run_djikstra() {
        solution_edges = djikstra(graph);
    }



    handleClick = id => {
        console.log(this.network)
        this.network.clustering.updateEdge(id, { color: 'red' })

        this.setState({
            weight: this.e[id],
        })
    }



    setNetworkInstance = nw => {
        this.network = nw
    };

    handleWin() {
        this.setState({
            game_over = true,
            win = true,
            lose = false
        })
    }

    handleLose() {
        this.setState({
            game_over = true,
            win = false,
            lose = true
        })
    }

    // Unused atm
    handleRestart() {
        this.setState({
            game_over = false,
            win = false,
            lose = false
        })
    }

    winScreen() {
        // Can make this fancier later
        return <div><h1>You win!</h1>
            <h6>Thanks for coming to my TED talk</h6></div>;
    }

    // Displays a losing message, plus algorithm solution
    loseScreen(solution_edges) {
        // Add the solution's edges to be displayed alongside the user's edges
        graph.edges.concat(solution_edges);

        // Display it
        return <div>
            <h1>You lost!</h1>
            <Graph getNetwork={this.setNetworkInstance} graph={this.state.graph} options={this.options} events={this.events}></Graph>
        </div>
    }


    render() {
        // calculate sum from solution
        var sum = 0;

        const solution_edges = this.state.solution_edges;
        solution_edges.forEach(edge => sum += edge.weight);
        // now we have the sum
        this.state.weight = sum;

        // call djikstra, get list of edges "solution_edges"
        solution_edges = djikstra(this.state.graph);

        // set the edges' color
        solution_edges.forEach(edge => edge.color = SOLUTION_EDGE_COLOR);
        // make the edges a bit smaller
        solution_edges.forEach(edge => edge.width = SOLUTION_EDGE_WEIGHT);

        // game is over:
        if (this.state.game_over) {
            if (this.state.win) {
                return winScreen();
            } else if (this.state.lose) {
                return loseScreen(solution_edges);
            } else {
                throw "PROBLEM: state.game_over is TRUE but both state.win and state.lose are FALSE!";
            }
        }

        // game is not over:
        else return (
            <div>
                <h1>DIJKSTRA!!!</h1>
                <Graph getNetwork={this.setNetworkInstance} graph={this.state.graph} options={this.options} events={this.events}></Graph>
                <p>Points Available: {this.state.weight}</p>
            </div>
        )
    }
}

export default App;

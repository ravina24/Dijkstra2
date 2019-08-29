class GraphGenerator {
    // Constants
    SOLUTION_EDGE_COLOR = 'purple';
    SOLUTION_EDGE_WEIGHT = '5';
    GENERATED_GRAPH_NUMBER_OF_NODES = 10;
    GENERATE_CUSTOM_GRAPH = false;
    GENERATED_GRAPH_CONNECTION_PROBABILITY = 0.12; // the actual probability is a bit higher than this.
    /*
      Actual probabiilty of connection between two nodes: 100% if their indices are adjacent, and 2*probability - probability*2 if not
    */
    GENERATED_GRAPH_MAX_EDGE_WEIGHT = 15;

    letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

    // Used by generateNodes. Each node's ID matches its label.
    generateNode(id) {
        return { id: id, label: this.letters[id] };
    }

    // Used by generateGraph
    generateNodes() {
        const num = this.GENERATED_GRAPH_NUMBER_OF_NODES;
        const nodes = [];
        var i;
        for (i = 0; i < num; i++) {
            nodes.push(this.generateNode(i));
        }
        return nodes;
    }

    // used by generateEdge to generate a random edge weight in [1 .. GENERATED_GRAPH_MAX_EDGE_WEIGHT]
    generateEdgeWeight() {
        return Math.floor(Math.random() * this.GENERATED_GRAPH_MAX_EDGE_WEIGHT) + 1;
    }

    // Used by generateEdges
    generateEdge(id1, id2, edgeId) {
        const weight = this.generateEdgeWeight();
        console.log("WEIGHT:" + weight)
        const edge = { from: id1, to: id2, label: weight, id: edgeId };
        console.log("GENERATED EDGE: " + edge.toString());
        return edge;
    }

    canAddEdge(id1, id2, edges) {
        if (id1 === id2 || (id1 === 0 && id2 === this.GENERATED_GRAPH_NUMBER_OF_NODES - 1) || (id1 === this.GENERATED_GRAPH_NUMBER_OF_NODES - 1 && id2 === 0)) {
            return false;
        }
        var canAdd = true;
        var i;
        for (i = 0; i < edges.length; i++) {
            if ((edges[i].from === id1 && edges[i].to === id2) || (edges[i].from === id2 && edges[i].to === id1)) {
                canAdd = false;
                break;
            }
        }
        return canAdd;
    }

    // Used by generateGraph
    generateEdges(nodes) {
        const edges = [];
        // connect the nodes so the graph is connected
        // Go from 1 -> end in a loop
        var i;
        var j;
        var edgeId = 1;
        for (i = 0; i < nodes.length - 1; i++ , edgeId++) {
            edges.push(this.generateEdge(i, i + 1, edgeId));
        }

        // add extra edges to spice things up
        // if a node is not connected to another node, connect them with random probability
        for (i = 0; i < nodes.length; i++) {
            // add edge if the generated number is in range and 
            for (j = 0; j < nodes.length; j++)
                if (this.canAddEdge(i, j, edges)) {
                    const r = Math.random(); // [0,1)
                    if (r < this.GENERATED_GRAPH_CONNECTION_PROBABILITY) {
                        edges.push(this.generateEdge(i, j, edgeId));
                        edgeId++;
                    }
                }
        }

        return edges;
    }

    generateGraph(g) {
        const generatedNodes = this.generateNodes();
        const generatedEdges = this.generateEdges(generatedNodes);

        // Set the graph
        if (this.GENERATE_CUSTOM_GRAPH) {
            g.nodes = generatedNodes;
            g.edges = generatedEdges;
        }
    }
}



export default GraphGenerator;
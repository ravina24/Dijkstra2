import PriorityQueue from './PriorityQueue.js';
import Graph from 'react-graph-vis';

/**
 * @typedef {Object} ShortestPaths
 * @property {Object} distances - shortest distances to all vertices
 * @property {Object} previousVertices - shortest paths to all vertices.
 */

/**
 * Implementation of Dijkstra algorithm of finding the shortest paths to graph nodes.
 * @param {Graph} graph - graph we're going to traverse.
 * @param {GraphVertex} startVertex - traversal start vertex.
 * @return {ShortestPaths}
 */
export default function dijkstra(graph, startVertex, endVertex) {
  // Init helper variables that we will need for Dijkstra algorithm.
  const distances = {};
  const visitedVertices = {};
  const previousVertices = {};
  const queue = new PriorityQueue();

  // Init all distances with infinity assuming that currently we can't reach
  // any of the vertices except the start one.
  graph.nodes.forEach((vertex) => {
    distances[vertex.id] = Infinity;
    previousVertices[vertex.id] = null;
  });

  // We are already at the startVertex so the distance to it is zero.
  distances[startVertex.id] = 0;

  // Init vertices queue.
  queue.add(startVertex.id, distances[startVertex.id]);

  // Iterate over the priority queue of vertices until it is empty.
  while (!queue.isEmpty()) {
    // Fetch next closest vertex.
    const currentVertexId = queue.poll();

    // Iterate over every unvisited neighbor of the current vertex.
    const neighborIds = getNeighbors(graph, currentVertexId);

    neighborIds.forEach((neighborId) => {
      // Don't visit already visited vertices.
      if (!visitedVertices[neighborId]) {
        // Update distances to every neighbor from current vertex.
        // get edge between currentVertex and neighbor

        var edge;
        graph.edges.forEach((e) => {
          if((e.from === currentVertexId || e.to === currentVertexId) &&
              (e.from === neighborId || e.to === neighborId)) {
            edge = e;
          }
        });

        const existingDistanceToNeighbor = distances[neighborId];
        const distanceToNeighborFromCurrent = distances[currentVertexId] + edge.label;

        // If we've found shorter path to the neighbor - update it.
        if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
          distances[neighborId] = distanceToNeighborFromCurrent;

          // Change priority of the neighbor in a queue since it might have became closer.
          if (queue.hasValue(neighborId)) {
            queue.changePriority(neighborId, distances[neighborId]);
          }

          // Remember previous closest vertex.
          previousVertices[neighborId] = currentVertexId;
        }

        // Add neighbor to the queue for further visiting.
        if (!queue.hasValue(neighborId)) {
          queue.add(neighborId, distances[neighborId]);
        }
      }
    });

    // Add current vertex to visited ones to avoid visiting it again later.
    visitedVertices[currentVertexId] = currentVertexId;
  }

  console.log(previousVertices)


  var shortestPathNodes = backtrack(graph, previousVertices, startVertex, endVertex);
  var shortestPathEdges = getEdges(graph, shortestPathNodes);

  console.log(shortestPathEdges);
  return shortestPathEdges;
}

function getNeighbors(graph, vertexId) {
  var neighborIds = new Set();
  var edges = graph.edges;

  edges.forEach((edge) => {
    if(edge.from === vertexId) {
      neighborIds.add(edge.to);
    } else if (edge.to === vertexId) {
      neighborIds.add(edge.from);
    }
  });

  return neighborIds;


}

function backtrack(graph, previousVertices, startVertex, endVertex) {
  var stack = [];
  var path = [];
  var currentVertexId = endVertex.id;
  if(previousVertices[endVertex.id] != null || endVertex.id === startVertex.id) {
    while(currentVertexId != null) {
      console.log(currentVertexId) // correct
      stack.push(currentVertexId);
      currentVertexId = previousVertices[currentVertexId];
    }
  }

  while(stack.length != 0) {
    path.push(stack.pop());
  }

  return path;
}

function getEdges(graph, nodeArray) {
  var edgesInPath = [];
  const edgesInGraph = graph.edges;

  for(var i = 0; i < nodeArray.length - 1; i++) {
    edgesInGraph.forEach((edge) => {
      if ((edge.from === nodeArray[i] && edge.to === nodeArray[i+1]) || (edge.to === nodeArray[i] && edge.from === nodeArray[i+1])) {
        edgesInPath.push(edge);
      }
    });
  }

  return edgesInPath;
}
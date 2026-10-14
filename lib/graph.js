/**
 * Graph node helpers (used by Clone Graph).
 *
 * Most graph problems give you `n` and an `edges` list instead — build your
 * own adjacency list from those. This node class is only for problems that
 * hand you a pointer-based graph.
 */

/** A node of an undirected graph with a list of neighbors. */
export class GraphNode {
  /**
   * @param {number} [val=0] - Value (label) of the node.
   * @param {GraphNode[]} [neighbors=[]] - Adjacent nodes.
   */
  constructor(val = 0, neighbors = []) {
    /** @type {number} */
    this.val = val;
    /** @type {GraphNode[]} */
    this.neighbors = neighbors;
  }
}

/**
 * Builds a graph from a 1-indexed adjacency list: `adj[i]` lists the
 * neighbors of the node with value `i + 1`.
 *
 * @param {number[][]} adj - Adjacency list.
 * @returns {GraphNode | null} The node with value 1, or null for an empty list.
 */
export function adjacencyToGraph(adj) {
  if (adj.length === 0) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((neighbors, i) => {
    nodes[i].neighbors = neighbors.map((v) => nodes[v - 1]);
  });
  return nodes[0];
}

/**
 * Converts a graph back into a 1-indexed adjacency list by exploring
 * everything reachable from `node`.
 *
 * @param {GraphNode | null} node - Any node of the graph.
 * @returns {number[][]} Adjacency list, `adj[i]` = neighbor values of node `i + 1`.
 */
export function graphToAdjacency(node) {
  if (!node) return [];
  const seen = new Map();
  const stack = [node];
  seen.set(node.val, node);
  while (stack.length) {
    const cur = stack.pop();
    for (const nb of cur.neighbors) {
      if (!seen.has(nb.val)) {
        seen.set(nb.val, nb);
        stack.push(nb);
      }
    }
  }
  const max = Math.max(...seen.keys());
  const adj = Array.from({ length: max }, () => []);
  for (const [val, n] of seen) adj[val - 1] = n.neighbors.map((nb) => nb.val);
  return adj;
}

/**
 * Collects every node object reachable from `node`.
 *
 * @param {GraphNode | null} node - Any node of the graph.
 * @returns {Set<GraphNode>} All reachable node objects.
 */
export function collectNodes(node) {
  const seen = new Set();
  const stack = node ? [node] : [];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const nb of cur.neighbors) stack.push(nb);
  }
  return seen;
}

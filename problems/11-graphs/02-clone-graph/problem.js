/*
 * Title:      Clone Graph
 * Difficulty: Medium
 * Patterns:   Graph DFS, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a reference to one node of a connected, undirected graph.
 * Return a DEEP COPY (clone) of the whole graph: the reference to the copy
 * of the node you were given.
 *
 * Each node is a `GraphNode` (see lib/graph.js):
 *
 *     class GraphNode {
 *       val;        // number — the node's label
 *       neighbors;  // GraphNode[] — adjacent nodes
 *     }
 *
 * Requirements for the copy:
 *
 *   • Every node of the original has exactly ONE new counterpart with the
 *     same `val`. No node object of the original may appear anywhere in the
 *     copy (not even as someone's neighbour).
 *   • Each copied node's `neighbors` lists the copies of the original
 *     neighbours, in the SAME ORDER.
 *   • The original graph must not be modified.
 *   • If the input is `null` (an empty graph), return `null`.
 *   • Create the copies with `new GraphNode(val)` (already imported for you).
 *
 * The node values are 1 … n, unique, and the graph is undirected: if B is in
 * A's neighbour list then A is in B's. In the examples (and in the tests)
 * graphs are written as 1-indexed adjacency lists: `adj[i]` lists the
 * neighbour values of the node with value `i + 1`, and the node you receive
 * is node 1 unless stated otherwise.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  adj = [[2, 4], [1, 3], [2, 4], [1, 3]]
 *
 *         1 ─── 2
 *         │     │
 *         4 ─── 3
 *
 *     Output: a brand-new graph with the same adjacency list
 *             [[2, 4], [1, 3], [2, 4], [1, 3]]
 *     Why:    Four new nodes, wired exactly like the originals. The cycle
 *             1-2-3-4-1 means a careless traversal never terminates.
 *
 *   Example 2
 *     Input:  adj = [[]]
 *     Output: [[]]      — one new node with value 1 and no neighbours.
 *
 *   Example 3
 *     Input:  node = null (adj = [])
 *     Output: null
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2,000
 *   • 1 <= node.val <= number of nodes, and all values are unique
 *   • No self-loops and no repeated edges.
 *   • The graph is connected, so every node is reachable from the one given.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(V + E) time and O(V) extra space: visit every node and every edge
 *   once. The tests include a complete graph on 2,000 nodes (~4 million
 *   neighbour references), so finding a node's copy must be O(1).
 */

import { GraphNode } from '../../../lib/graph.js';

// ▶ Run tests:   npm run solve clone-graph
// ⟳ Watch mode:  npm run watch clone-graph

/**
 * Returns a deep copy of the connected graph containing `node`.
 *
 * @param {GraphNode | null} node - Any node of the graph, or null for an empty graph.
 * @returns {GraphNode | null} The copy of `node` (whose neighbours lead to the rest of the copy), or null.
 */
export function cloneGraph(node) {
  // Your code here
}

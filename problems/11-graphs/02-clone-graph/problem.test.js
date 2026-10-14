import { describe, it, expect } from 'vitest';
import { cloneGraph } from './problem.js';
import { GraphNode, adjacencyToGraph, graphToAdjacency, collectNodes } from '../../../lib/graph.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Builds a graph from a 1-indexed adjacency list and returns ALL node objects (index i → value i + 1). */
function buildNodes(adj) {
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((nbrs, i) => {
    nodes[i].neighbors = nbrs.map((v) => nodes[v - 1]);
  });
  return nodes;
}

/**
 * Asserts that `copy` is a correct deep clone of the graph reachable from
 * `start`, and that the original still looks like `adjBefore`.
 *
 * Node objects are compared with `===` inside boolean assertions on purpose:
 * matchers like `.not.toBe(node)` deep-compare/print the whole cyclic graph,
 * which is extremely slow on big graphs.
 */
function expectDeepClone(start, copy, adjBefore) {
  expect(copy instanceof GraphNode, 'should return a GraphNode, not null/undefined').toBe(true);
  expect(copy === start, 'must return a NEW node, not the original').toBe(false);
  expect(copy.val, 'the returned node must be the copy of the node you were given').toBe(start.val);

  // Same structure, same neighbour order.
  expect(graphToAdjacency(copy)).toEqual(adjBefore);
  // The original was not modified.
  expect(graphToAdjacency(start), 'the original graph must not be modified').toEqual(adjBefore);

  const originals = collectNodes(start);
  const copies = collectNodes(copy);
  expect(copies.size, 'every original node needs exactly ONE copy (no duplicates, none missing)').toBe(originals.size);
  const shared = [...copies].filter((n) => originals.has(n));
  expect(shared.length, 'the copy must not reuse any node object from the original').toBe(0);
  const notNodes = [...copies].filter((n) => !(n instanceof GraphNode));
  expect(notNodes.length, 'copies should be GraphNode instances (use new GraphNode(val))').toBe(0);
}

/** Clones from `adj`'s node `startVal` and checks the result. */
function checkClone(adj, startVal = 1) {
  const nodes = buildNodes(adj);
  const start = nodes[startVal - 1];
  const before = graphToAdjacency(start);
  const copy = cloneGraph(start);
  expectDeepClone(start, copy, before);
  return copy;
}

describe('Clone Graph', () => {
  describe('examples from the problem', () => {
    it('square 1-2-3-4-1 → identical adjacency, all-new nodes (the cycle must not loop forever)', () => {
      checkClone([[2, 4], [1, 3], [2, 4], [1, 3]]);
    });

    it('single node with no neighbours → a new node with val 1 and []', () => {
      const original = adjacencyToGraph([[]]);
      const copy = cloneGraph(original);
      expect(copy instanceof GraphNode, 'should return a GraphNode').toBe(true);
      expect(copy === original, 'must return a NEW node').toBe(false);
      expect(copy.val).toBe(1);
      expect(copy.neighbors).toEqual([]);
    });

    it('null (empty graph) → null', () => {
      expect(cloneGraph(null)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('two nodes pointing at each other: [[2], [1]]', () => {
      const copy = checkClone([[2], [1]]);
      // Following the edge there and back must land on the very same copy.
      expect(copy.neighbors[0].neighbors[0] === copy, '1 → 2 → 1 should lead back to the same copy of 1').toBe(true);
    });

    it('path 1-2-3, cloned from node 1', () => {
      checkClone([[2], [1, 3], [2]]);
    });

    it('path 1-2-3, cloned from the middle node 2 → the returned copy has val 2', () => {
      checkClone([[2], [1, 3], [2]], 2);
    });

    it('cloned from the last node of a longer path', () => {
      checkClone([[2], [1, 3], [2, 4], [3, 5], [4]], 5);
    });
  });

  describe('tricky cases', () => {
    it('triangle 1-2-3: every node is reachable along two routes, but is copied once', () => {
      const copy = checkClone([[2, 3], [1, 3], [1, 2]]);
      const [two, three] = copy.neighbors;
      expect(two.neighbors[1] === three, "2's neighbour 3 must be the same copy as 1's neighbour 3").toBe(true);
    });

    it('diamond 1-{2,3}-4: node 4 is reached twice but must be copied once', () => {
      checkClone([[2, 3], [1, 4], [1, 4], [2, 3]]);
    });

    it('neighbour order is preserved exactly: [[4, 3, 2], [1], [1], [1]]', () => {
      const copy = checkClone([[4, 3, 2], [1], [1], [1]]);
      expect(copy.neighbors.map((n) => n.val)).toEqual([4, 3, 2]);
    });

    it("the original's neighbour lists still point at original nodes afterwards", () => {
      const nodes = buildNodes([[2, 3], [1, 3], [1, 2]]);
      const copy = cloneGraph(nodes[0]);
      const copies = collectNodes(copy);
      expect(copies.size, 'the copy should have 3 nodes').toBe(3);
      for (const n of nodes) {
        for (const nb of n.neighbors) expect(copies.has(nb), 'an original node now points into the copy').toBe(false);
      }
    });

    it('cloning the same graph twice gives two independent copies (no state left over between calls)', () => {
      const nodes = buildNodes([[2, 3], [1, 3], [1, 2]]);
      const a = cloneGraph(nodes[0]);
      const b = cloneGraph(nodes[0]);
      expect(a === b, 'each call must build a fresh copy').toBe(false);
      const aNodes = collectNodes(a);
      for (const n of collectNodes(b)) expect(aNodes.has(n), 'second clone reused nodes of the first').toBe(false);
      expect(graphToAdjacency(b)).toEqual([[2, 3], [1, 3], [1, 2]]);
    });

    it('two different graphs with the same values are cloned independently', () => {
      const a = cloneGraph(adjacencyToGraph([[2], [1]]));
      const b = cloneGraph(adjacencyToGraph([[2, 3], [1], [1]]));
      expect(graphToAdjacency(a)).toEqual([[2], [1]]);
      expect(graphToAdjacency(b)).toEqual([[2, 3], [1], [1]]);
    });

    it('star: centre 1 with leaves 2..8', () => {
      checkClone([[2, 3, 4, 5, 6, 7, 8], [1], [1], [1], [1], [1], [1], [1]]);
    });

    it('complete graph K5 (every node adjacent to every other)', () => {
      const adj = Array.from({ length: 5 }, (_, i) => [1, 2, 3, 4, 5].filter((v) => v !== i + 1));
      checkClone(adj, 3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('correctly clones 150 random connected graphs from a random start node', () => {
      const rng = createRng(99);
      for (let t = 0; t < 150; t++) {
        const n = randomInt(rng, 1, 30);
        const sets = Array.from({ length: n }, () => new Set());
        const addEdge = (a, b) => {
          if (a === b || sets[a].has(b)) return;
          sets[a].add(b);
          sets[b].add(a);
        };
        // Random spanning tree keeps it connected, then sprinkle extra edges.
        for (let i = 1; i < n; i++) addEdge(i, randomInt(rng, 0, i - 1));
        const extra = randomInt(rng, 0, n);
        for (let k = 0; k < extra; k++) addEdge(randomInt(rng, 0, n - 1), randomInt(rng, 0, n - 1));
        const adj = sets.map((s) => shuffle(rng, [...s].map((v) => v + 1)));
        checkClone(adj, randomInt(rng, 1, n));
      }
    });
  });

  describe('performance', () => {
    it('complete graph on 2,000 nodes (~4M neighbour references) — finding a copy by scanning a list of copies is O(V) per edge, far too slow', () => {
      const n = 2000;
      const adj = Array.from({ length: n }, (_, i) => {
        const row = [];
        for (let v = 1; v <= n; v++) if (v !== i + 1) row.push(v);
        return row;
      });
      const nodes = buildNodes(adj);
      const { result, ms } = measure(() => cloneGraph(nodes[0]));
      expectDeepClone(nodes[0], result, adj);
      expect(ms, `took ${ms.toFixed(0)}ms — use a Map from original node to its copy`).toBeLessThan(1000);
    });

    it('a single cycle through 2,000 nodes', () => {
      const n = 2000;
      const adj = Array.from({ length: n }, (_, i) => [((i + 1) % n) + 1, ((i - 1 + n) % n) + 1]);
      const nodes = buildNodes(adj);
      const { result, ms } = measure(() => cloneGraph(nodes[0]));
      expectDeepClone(nodes[0], result, adj);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1000);
    });
  });
});

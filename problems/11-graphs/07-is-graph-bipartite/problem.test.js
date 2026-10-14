import { describe, it, expect } from 'vitest';
import { isBipartite } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Builds an adjacency list for n nodes from a list of undirected edges. */
function fromEdges(n, edges) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }
  return graph;
}

/** A cycle 0-1-…-(n-1)-0 of length n. */
function cycle(n) {
  return fromEdges(
    n,
    Array.from({ length: n }, (_, i) => [i, (i + 1) % n]),
  );
}

/** Brute force: try all 2^n colourings. Only for tiny graphs. */
function bruteForceBipartite(graph) {
  const n = graph.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let ok = true;
    for (let u = 0; u < n && ok; u++) {
      for (const v of graph[u]) {
        if (((mask >> u) & 1) === ((mask >> v) & 1)) {
          ok = false;
          break;
        }
      }
    }
    if (ok) return true;
  }
  return false;
}

/** rows × cols grid graph; node id = r * cols + c. */
function grid(rows, cols) {
  const edges = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c;
      if (c + 1 < cols) edges.push([id, id + 1]);
      if (r + 1 < rows) edges.push([id, id + cols]);
    }
  }
  return { n: rows * cols, edges };
}

describe('Is Graph Bipartite?', () => {
  describe('examples from the problem', () => {
    it('[[1,2,3],[0,2],[0,1,3],[0,2]] → false (0-1-2 is a triangle)', () => {
      expect(isBipartite([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]])).toBe(false);
    });

    it('[[1,3],[0,2],[1,3],[0,2]] → true (a square splits into {0,2} and {1,3})', () => {
      expect(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]])).toBe(true);
    });

    it('[[1],[0],[3,4],[2,4],[2,3]] → false (the triangle lives in the second piece)', () => {
      expect(isBipartite([[1], [0], [3, 4], [2, 4], [2, 3]])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('a single node with no edges → true', () => {
      expect(isBipartite([[]])).toBe(true);
    });

    it('many isolated nodes and no edges at all → true', () => {
      expect(isBipartite([[], [], [], [], []])).toBe(true);
    });

    it('a single edge → true', () => {
      expect(isBipartite([[1], [0]])).toBe(true);
    });

    it('a star (one centre joined to everyone) → true', () => {
      const n = 8;
      const graph = fromEdges(n, Array.from({ length: n - 1 }, (_, i) => [0, i + 1]));
      expect(isBipartite(graph)).toBe(true);
    });

    it('any tree is bipartite (no cycles at all)', () => {
      //        0
      //      / | \
      //     1  2  3
      //    / \     \
      //   4   5     6
      //   |
      //   7
      const graph = fromEdges(8, [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [3, 6], [4, 7]]);
      expect(isBipartite(graph)).toBe(true);
    });

    it('does not modify the input graph', () => {
      const graph = [[1, 3], [0, 2], [1, 3], [0, 2]];
      const copy = graph.map((row) => [...row]);
      isBipartite(graph);
      expect(graph).toEqual(copy);
    });
  });

  describe('odd vs even cycles', () => {
    it('a 5-cycle → false (odd length)', () => {
      expect(isBipartite(cycle(5))).toBe(false);
    });

    it('a 6-cycle → true (even length)', () => {
      expect(isBipartite(cycle(6))).toBe(true);
    });

    it('a large odd cycle of 999 nodes → false (the conflict only shows up when the ends meet)', () => {
      expect(isBipartite(cycle(999))).toBe(false);
    });

    it('an even cycle with one chord that creates a triangle → false', () => {
      // 0-1-2-3-4-5-0 plus chord 0-2 → triangle 0-1-2.
      const graph = cycle(6);
      graph[0].push(2);
      graph[2].push(0);
      expect(isBipartite(graph)).toBe(false);
    });

    it('an even cycle with a chord that splits it into two squares → true', () => {
      // 0-1-2-3-4-5-0 plus chord 0-3 → squares 0-1-2-3 and 0-3-4-5.
      const graph = cycle(6);
      graph[0].push(3);
      graph[3].push(0);
      expect(isBipartite(graph)).toBe(true);
    });

    it('complete bipartite K(3,3) → true', () => {
      const edges = [];
      for (const a of [0, 1, 2]) for (const b of [3, 4, 5]) edges.push([a, b]);
      expect(isBipartite(fromEdges(6, edges))).toBe(true);
    });

    it('complete graph K4 → false', () => {
      const edges = [];
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) edges.push([a, b]);
      expect(isBipartite(fromEdges(4, edges))).toBe(false);
    });
  });

  describe('disconnected graphs (every piece must be checked)', () => {
    it('node 0 is isolated and the triangle is elsewhere → false (starting from node 0 alone checks nothing)', () => {
      expect(isBipartite([[], [2, 3], [1, 3], [1, 2]])).toBe(false);
    });

    it('several bipartite pieces followed by one odd cycle at the very end → false', () => {
      // Pieces: edge {0,1}, square {2,3,4,5}, isolated 6, path 7-8-9, triangle {10,11,12}.
      const graph = fromEdges(13, [
        [0, 1],
        [2, 3], [3, 4], [4, 5], [5, 2],
        [7, 8], [8, 9],
        [10, 11], [11, 12], [12, 10],
      ]);
      expect(isBipartite(graph)).toBe(false);
    });

    it('several pieces that are all bipartite → true', () => {
      const graph = fromEdges(11, [
        [0, 1],
        [2, 3], [3, 4], [4, 5], [5, 2],
        [7, 8], [8, 9], [9, 10],
      ]);
      expect(isBipartite(graph)).toBe(true);
    });

    it('path 0-3-2-1 → true (colouring nodes in label order instead of along a traversal makes a false conflict)', () => {
      // Visiting 0, 1, 2, 3 by label and giving each uncoloured node colour 0
      // colours 0 and 1 the same — but they are at odd distance (3 edges)
      // along the path. Colours must spread from neighbour to neighbour.
      const graph = fromEdges(4, [[0, 3], [3, 2], [2, 1]]);
      expect(isBipartite(graph)).toBe(true);
    });

    it('the odd cycle is in a piece whose smallest label is in the middle of the list → false', () => {
      // Triangle {3, 7, 5}; everything else is a long path 0-1-2-4-6-8-9.
      const graph = fromEdges(10, [
        [0, 1], [1, 2], [2, 4], [4, 6], [6, 8], [8, 9],
        [3, 7], [7, 5], [5, 3],
      ]);
      expect(isBipartite(graph)).toBe(false);
    });
  });

  describe('randomized (seeded) against a brute-force 2-colouring search', () => {
    it('agrees on 300 random small graphs (mix of dense, sparse and planted-bipartite)', () => {
      const rng = createRng(2024);
      let trueCount = 0;
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 11);
        const edges = [];
        const planted = t % 3 === 0; // every third graph is bipartite by construction
        const side = Array.from({ length: n }, () => randomInt(rng, 0, 1));
        const p = [0.15, 0.3, 0.5][t % 3];
        for (let u = 0; u < n; u++) {
          for (let v = u + 1; v < n; v++) {
            if (planted && side[u] === side[v]) continue;
            if (rng() < p) edges.push([u, v]);
          }
        }
        const graph = fromEdges(n, shuffle(rng, edges));
        const expected = bruteForceBipartite(graph);
        if (expected) trueCount++;
        expect(isBipartite(graph), `graph = ${JSON.stringify(graph)}`).toBe(expected);
      }
      // Sanity check on the generator: both answers are well represented.
      expect(trueCount).toBeGreaterThan(80);
      expect(trueCount).toBeLessThan(250);
    });
  });

  describe('performance', () => {
    it('100×100 grid (10,000 nodes): true; with one diagonal edge in the far corner: false — quickly (restarting a full BFS from every node is O(V·(V+E)) and far too slow)', () => {
      const { n, edges } = grid(100, 100);
      const graph = fromEdges(n, edges);
      const first = measure(() => isBipartite(graph));
      expect(first.result).toBe(true);

      // Add a diagonal inside the last cell → triangle → odd cycle.
      const a = 98 * 100 + 98;
      const b = 99 * 100 + 99;
      graph[a].push(b);
      graph[b].push(a);
      const second = measure(() => isBipartite(graph));
      expect(second.result).toBe(false);

      const ms = first.ms + second.ms;
      expect(ms, `took ${ms.toFixed(0)}ms — colour each node once, O(V + E)`).toBeLessThan(500);
    });

    it('a 10,000-node path is handled without a stack overflow (recursive DFS this deep crashes — go iterative)', () => {
      const n = 10_000;
      const graph = fromEdges(n, Array.from({ length: n - 1 }, (_, i) => [i, i + 1]));
      const { result, ms } = measure(() => isBipartite(graph));
      expect(result).toBe(true);
      expect(ms).toBeLessThan(500);
    });

    it('4,999 separate edges, then one triangle as the very last piece → false, quickly (each piece is explored once)', () => {
      // 4,999 single edges, then one triangle at the end. Tests that the outer
      // loop over pieces is cheap and does not redo finished pieces.
      const edges = [];
      let id = 0;
      for (let k = 0; k < 4999; k++, id += 2) edges.push([id, id + 1]);
      edges.push([id, id + 1], [id + 1, id + 2], [id + 2, id]);
      const graph = fromEdges(id + 3, edges);
      const { result, ms } = measure(() => isBipartite(graph));
      expect(result).toBe(false);
      expect(ms).toBeLessThan(500);
    });
  });
});

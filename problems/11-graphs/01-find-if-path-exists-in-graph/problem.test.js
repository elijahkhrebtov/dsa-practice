import { describe, it, expect } from 'vitest';
import { validPath } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: grow the reachable set by sweeping the edge list over
 * and over until nothing changes. Obviously correct, O(n · E) slow.
 */
function reachableBrute(n, edges, source, destination) {
  const reach = new Array(n).fill(false);
  reach[source] = true;
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v] of edges) {
      if (reach[u] !== reach[v]) {
        reach[u] = reach[v] = true;
        changed = true;
      }
    }
  }
  return reach[destination];
}

/**
 * A simple path through all `n` vertices in a shuffled vertex order, with the
 * edge list shuffled and each edge randomly flipped. Returns the edges and
 * the two endpoints of the path.
 */
function longShuffledPath(n, seed) {
  const rng = createRng(seed);
  const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
  const edges = [];
  for (let i = 0; i + 1 < n; i++) {
    edges.push(rng() < 0.5 ? [order[i], order[i + 1]] : [order[i + 1], order[i]]);
  }
  shuffle(rng, edges);
  return { edges, first: order[0], last: order[n - 1] };
}

describe('Find if Path Exists in Graph', () => {
  describe('examples from the problem', () => {
    it('triangle 0-1-2, 0 → 2 → true', () => {
      expect(validPath(3, [[0, 1], [1, 2], [2, 0]], 0, 2)).toBe(true);
    });

    it('component {0, 1, 2} and triangle {3, 4, 5} are separate, 0 → 5 → false', () => {
      expect(validPath(6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5)).toBe(false);
    });

    it('n = 1, no edges, 0 → 0 → true (a vertex reaches itself)', () => {
      expect(validPath(1, [], 0, 0)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('source === destination on an isolated vertex inside a bigger graph → true', () => {
      expect(validPath(5, [[0, 1], [1, 2]], 4, 4)).toBe(true);
    });

    it('n = 2 with no edges, 0 → 1 → false', () => {
      expect(validPath(2, [], 0, 1)).toBe(false);
    });

    it('single edge [0, 1], asking 1 → 0 → true (edges are undirected)', () => {
      expect(validPath(2, [[0, 1]], 1, 0)).toBe(true);
    });

    it('destination is an isolated vertex that appears in no edge → false', () => {
      expect(validPath(4, [[0, 1], [1, 2], [2, 0]], 0, 3)).toBe(false);
    });

    it('source is the isolated vertex → false', () => {
      expect(validPath(4, [[0, 1], [1, 2], [2, 0]], 3, 1)).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('the path only works if you walk edges "backwards" relative to how they are listed', () => {
      // Every edge is written [higher, lower]; walking 0 → 4 needs v → u traversals.
      expect(validPath(5, [[1, 0], [2, 1], [3, 2], [4, 3]], 0, 4)).toBe(true);
    });

    it('the route has to pass through vertices with larger labels than both endpoints', () => {
      expect(validPath(10, [[0, 9], [9, 8], [8, 1]], 0, 1)).toBe(true);
    });

    it('query entirely inside the second component → true', () => {
      expect(validPath(7, [[0, 1], [1, 2], [3, 4], [4, 5], [5, 6]], 6, 3)).toBe(true);
    });

    it('a dense component next to the destination does not leak into it → false', () => {
      const edges = [];
      for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) edges.push([a, b]); // K6 on 0..5
      edges.push([6, 7]);
      expect(validPath(8, edges, 0, 7)).toBe(false);
    });

    it('cycles do not cause infinite loops (you need a visited set)', () => {
      // A cycle 0-1-2-3-0 plus a separate pair 4-5; target unreachable, so a
      // traversal without "visited" would spin forever around the cycle.
      expect(validPath(6, [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5]], 0, 5)).toBe(false);
    });

    it('edges listed in an order that does not follow the path', () => {
      expect(validPath(6, [[4, 5], [0, 1], [3, 4], [1, 2], [2, 3]], 0, 5)).toBe(true);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force reachability sweep on 300 random sparse graphs', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 25);
        const maxEdges = (n * (n - 1)) / 2;
        const m = randomInt(rng, 0, Math.min(maxEdges, Math.ceil(n * 0.9)));
        const used = new Set();
        const edges = [];
        while (edges.length < m) {
          const u = randomInt(rng, 0, n - 1);
          const v = randomInt(rng, 0, n - 1);
          const key = u < v ? `${u},${v}` : `${v},${u}`;
          if (u === v || used.has(key)) continue;
          used.add(key);
          edges.push([u, v]);
        }
        const source = randomInt(rng, 0, n - 1);
        const destination = randomInt(rng, 0, n - 1);
        const expected = reachableBrute(n, edges, source, destination);
        expect(validPath(n, edges, source, destination), `n=${n} edges=${JSON.stringify(edges)} ${source}→${destination}`).toBe(expected);
      }
    });
  });

  describe('performance', () => {
    it('one path through all 200,000 vertices, end to end → true (a recursive DFS overflows the call stack here — go iterative)', () => {
      const n = 200_000;
      const { edges, first, last } = longShuffledPath(n, 11);
      const { result, ms } = measure(() => validPath(n, edges, first, last));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n + E)`).toBeLessThan(1500);
    });

    it('the same long path with one edge missing → false (must explore a 100,000-vertex half without recursion)', () => {
      const n = 200_000;
      const rng = createRng(12);
      const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
      const edges = [];
      for (let i = 0; i + 1 < n; i++) if (i !== n / 2) edges.push([order[i], order[i + 1]]);
      shuffle(rng, edges);
      const { result, ms } = measure(() => validPath(n, edges, order[0], order[n - 1]));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n + E)`).toBeLessThan(1500);
    });

    it('a star with 199,999 leaves, leaf to leaf → true (the frontier holds every vertex at once)', () => {
      const n = 200_000;
      const edges = [];
      for (let i = 1; i < n; i++) edges.push([0, i]);
      const { result, ms } = measure(() => validPath(n, edges, 1, n - 1));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — a queue built on shift() can get slow here`).toBeLessThan(1500);
    });
  });
});

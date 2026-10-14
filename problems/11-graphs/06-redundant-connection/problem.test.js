import { describe, it, expect } from 'vitest';
import { findRedundantConnection } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** True if the edges (vertices 1..n) connect all n vertices. */
function connectsAll(n, edges) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const seen = new Array(n + 1).fill(false);
  const stack = [1];
  seen[1] = true;
  let count = 1;
  while (stack.length) {
    for (const y of adj[stack.pop()]) {
      if (!seen[y]) {
        seen[y] = true;
        count++;
        stack.push(y);
      }
    }
  }
  return count === n;
}

/**
 * Brute-force oracle, straight from the statement: try removing each edge,
 * from last to first; the first removal that leaves a connected graph with
 * n − 1 edges (i.e. a tree) is the answer. O(n²).
 */
function redundantBrute(edges) {
  const n = edges.length;
  for (let i = n - 1; i >= 0; i--) {
    if (connectsAll(n, edges.filter((_, j) => j !== i))) return edges[i];
  }
  return null;
}

/**
 * Random tree on 1..n plus one extra edge, everything shuffled and randomly
 * oriented.
 */
function randomTreePlusEdge(rng, n) {
  const label = shuffle(rng, Array.from({ length: n }, (_, i) => i + 1));
  const edges = [];
  const has = new Set();
  const key = (a, b) => (a < b ? `${a},${b}` : `${b},${a}`);
  for (let i = 1; i < n; i++) {
    const a = label[i];
    const b = label[randomInt(rng, 0, i - 1)];
    edges.push([a, b]);
    has.add(key(a, b));
  }
  for (;;) {
    const a = randomInt(rng, 1, n);
    const b = randomInt(rng, 1, n);
    if (a !== b && !has.has(key(a, b))) {
      edges.push([a, b]);
      break;
    }
  }
  shuffle(rng, edges);
  return edges.map(([a, b]) => (rng() < 0.5 ? [a, b] : [b, a]));
}

describe('Redundant Connection', () => {
  describe('examples from the problem', () => {
    it('triangle [[1, 2], [1, 3], [2, 3]] → [2, 3] (all edges are on the cycle; the last one wins)', () => {
      expect(findRedundantConnection([[1, 2], [1, 3], [2, 3]])).toEqual([2, 3]);
    });

    it('[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]] → [1, 4] ([1, 5] is last but not on the cycle)', () => {
      expect(findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]])).toEqual([1, 4]);
    });

    it('[[1, 2], [2, 3], [3, 4], [4, 1]] → [4, 1] (returned exactly as written, not [1, 4])', () => {
      expect(findRedundantConnection([[1, 2], [2, 3], [3, 4], [4, 1]])).toEqual([4, 1]);
    });
  });

  describe('edge cases', () => {
    it('smallest input, triangle in another order: [[2, 3], [1, 2], [1, 3]] → [1, 3]', () => {
      expect(findRedundantConnection([[2, 3], [1, 2], [1, 3]])).toEqual([1, 3]);
    });

    it('triangle listed as [[1, 3], [2, 3], [1, 2]] → [1, 2]', () => {
      expect(findRedundantConnection([[1, 3], [2, 3], [1, 2]])).toEqual([1, 2]);
    });

    it('the whole graph is one big cycle → the last edge in the input', () => {
      expect(findRedundantConnection([[3, 4], [1, 2], [5, 1], [2, 3], [4, 5]])).toEqual([4, 5]);
    });

    it('triangle with orientations flipped: [[2, 1], [3, 2], [1, 3]] → [1, 3]', () => {
      expect(findRedundantConnection([[2, 1], [3, 2], [1, 3]])).toEqual([1, 3]);
    });
  });

  describe('tricky cases', () => {
    it('the last edge is a bridge: [[1, 2], [2, 3], [1, 3], [3, 4]] → [1, 3] (not simply the last edge)', () => {
      expect(findRedundantConnection([[1, 2], [2, 3], [1, 3], [3, 4]])).toEqual([1, 3]);
    });

    it('the cycle does not involve vertex 1: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 3]] → [5, 3]', () => {
      expect(findRedundantConnection([[1, 2], [2, 3], [3, 4], [4, 5], [5, 3]])).toEqual([5, 3]);
    });

    it('cycle edges scattered among tree edges: [[1, 2], [3, 4], [2, 3], [5, 1], [4, 1], [5, 6]] → [4, 1]', () => {
      // Cycle 1-2-3-4-1 uses edges #0, #1, #2 and #4; #3 and #5 are bridges.
      expect(findRedundantConnection([[1, 2], [3, 4], [2, 3], [5, 1], [4, 1], [5, 6]])).toEqual([4, 1]);
    });

    it('the extra edge was "added" first but the cycle only closes at the end: [[1, 4], [1, 2], [2, 3], [3, 4]] → [3, 4]', () => {
      expect(findRedundantConnection([[1, 4], [1, 2], [2, 3], [3, 4]])).toEqual([3, 4]);
    });

    it('two pieces built separately, then joined twice: [[1, 2], [3, 4], [2, 3], [1, 4]] → [1, 4]', () => {
      expect(findRedundantConnection([[1, 2], [3, 4], [2, 3], [1, 4]])).toEqual([1, 4]);
    });

    it('a long tail hanging off a small cycle: the answer is a cycle edge, never a tail edge', () => {
      const edges = [[1, 2], [2, 3], [3, 1], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]];
      expect(findRedundantConnection(edges)).toEqual([3, 1]);
    });

    it('returns an edge with the same content as the input edge, orientation preserved: [5, 2]', () => {
      expect(findRedundantConnection([[1, 2], [1, 3], [3, 4], [4, 5], [5, 2], [3, 6]])).toEqual([5, 2]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a "remove each edge and test connectivity" oracle on 300 random trees + 1 edge', () => {
      const rng = createRng(606);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 3, 20);
        const edges = randomTreePlusEdge(rng, n);
        expect(findRedundantConnection(edges), `edges=${JSON.stringify(edges)}`).toEqual(redundantBrute(edges));
      }
    });
  });

  describe('performance', () => {
    it('8,000 vertices, a tiny cycle near the start followed by thousands of bridges ("remove and re-check" per edge is O(n²))', () => {
      const n = 8_000;
      const rng = createRng(61);
      const edges = [[1, 2], [2, 3], [3, 1]]; // the cycle, then tree edges hanging off it
      for (let v = 4; v <= n; v++) edges.push([v, randomInt(rng, 1, v - 1)]);
      const { result, ms } = measure(() => findRedundantConnection(edges));
      expect(result).toEqual([3, 1]);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for near-linear time`).toBeLessThan(500);
    });

    it('star of 80,000 vertices with edges [1, i], closed by [2, 3] (union-find without path compression or union by rank is O(n²))', () => {
      const n = 80_000;
      const edges = [];
      for (let i = 2; i <= n; i++) edges.push([1, i]);
      edges.push([2, 3]);
      const { result, ms } = measure(() => findRedundantConnection(edges));
      expect(result).toEqual([2, 3]);
      expect(ms, `took ${ms.toFixed(0)}ms — keep union-find trees flat`).toBeLessThan(500);
    });

    it('the same star with edges written [i, 1] (catches the other naive linking direction)', () => {
      const n = 80_000;
      const edges = [];
      for (let i = 2; i <= n; i++) edges.push([i, 1]);
      edges.push([3, 2]);
      const { result, ms } = measure(() => findRedundantConnection(edges));
      expect(result).toEqual([3, 2]);
      expect(ms, `took ${ms.toFixed(0)}ms — keep union-find trees flat`).toBeLessThan(500);
    });

    it('100,000 vertices on one huge cycle, edges shuffled → the cycle edge that comes last', () => {
      const n = 100_000;
      const rng = createRng(62);
      const order = shuffle(rng, Array.from({ length: n }, (_, i) => i + 1));
      const edges = order.map((v, i) => [v, order[(i + 1) % n]]);
      shuffle(rng, edges);
      const expected = edges[n - 1];
      const { result, ms } = measure(() => findRedundantConnection(edges));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for near-linear time`).toBeLessThan(1000);
    });
  });
});

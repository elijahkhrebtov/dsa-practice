import { describe, it, expect } from 'vitest';
import { countComponents } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: every vertex starts with its own label; keep copying
 * the smaller label across every edge until nothing changes, then count the
 * distinct labels.
 */
function countBrute(n, edges) {
  const label = Array.from({ length: n }, (_, i) => i);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v] of edges) {
      const m = Math.min(label[u], label[v]);
      if (label[u] !== m || label[v] !== m) {
        label[u] = label[v] = m;
        changed = true;
      }
    }
  }
  return new Set(label).size;
}

/**
 * Splits the vertices 0..n-1 (shuffled) into `groups` random-size groups,
 * connects each group with a random spanning tree plus some repeated and
 * extra edges, and shuffles everything. The answer is exactly `groups`.
 */
function knownComponents(n, groups, seed) {
  const rng = createRng(seed);
  const verts = shuffle(rng, Array.from({ length: n }, (_, i) => i));
  const cuts = new Set([0, n]);
  while (cuts.size < groups + 1) cuts.add(randomInt(rng, 1, n - 1));
  const bounds = [...cuts].sort((a, b) => a - b);
  const edges = [];
  for (let g = 0; g < groups; g++) {
    const lo = bounds[g];
    const hi = bounds[g + 1];
    for (let i = lo + 1; i < hi; i++) {
      const j = randomInt(rng, lo, i - 1);
      edges.push([verts[i], verts[j]]);
      if (rng() < 0.1) edges.push([verts[j], verts[i]]); // duplicate, reversed
      if (rng() < 0.1) edges.push([verts[i], verts[randomInt(rng, lo, hi - 1)]]); // extra edge, may close a cycle
    }
  }
  return { edges: shuffle(rng, edges.filter(([u, v]) => u !== v)) };
}

describe('Number of Connected Components in an Undirected Graph', () => {
  describe('examples from the problem', () => {
    it('n = 5, [[0, 1], [1, 2], [3, 4]] → 2', () => {
      expect(countComponents(5, [[0, 1], [1, 2], [3, 4]])).toBe(2);
    });

    it('n = 5, path [[0, 1], [1, 2], [2, 3], [3, 4]] → 1', () => {
      expect(countComponents(5, [[0, 1], [1, 2], [2, 3], [3, 4]])).toBe(1);
    });

    it('n = 4, [[2, 3]] → 3 (isolated vertices 0 and 1 are components too)', () => {
      expect(countComponents(4, [[2, 3]])).toBe(3);
    });

    it('n = 3, [[0, 1], [1, 0], [0, 1]] → 2 (one edge listed three times)', () => {
      expect(countComponents(3, [[0, 1], [1, 0], [0, 1]])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('n = 1, no edges → 1', () => {
      expect(countComponents(1, [])).toBe(1);
    });

    it('n = 6, no edges → 6 (every vertex alone)', () => {
      expect(countComponents(6, [])).toBe(6);
    });

    it('n = 2, [[0, 1]] → 1', () => {
      expect(countComponents(2, [[0, 1]])).toBe(1);
    });

    it('the only isolated vertex is the highest label n - 1 → 2', () => {
      expect(countComponents(5, [[0, 1], [1, 2], [2, 3]])).toBe(2);
    });

    it('the only isolated vertex is 0 → 2', () => {
      expect(countComponents(5, [[1, 2], [2, 3], [3, 4]])).toBe(2);
    });
  });

  describe('tricky cases', () => {
    it('a triangle plus an isolated vertex → 2 (cycles break the shortcut "n − edges.length")', () => {
      expect(countComponents(4, [[0, 1], [1, 2], [2, 0]])).toBe(2);
    });

    it('[[0, 1], [2, 1]] → 1 (when merging, link the ROOTS — overwriting parent[1] loses the first link)', () => {
      expect(countComponents(3, [[0, 1], [2, 1]])).toBe(1);
    });

    it('three pairs glued together by the last two edges → 1', () => {
      expect(countComponents(6, [[0, 1], [2, 3], [4, 5], [1, 3], [3, 5]])).toBe(1);
    });

    it('an edge inside an already-connected group does not merge anything → 2', () => {
      expect(countComponents(5, [[0, 1], [1, 2], [0, 2], [3, 4], [4, 3]])).toBe(2);
    });

    it('star centred at the highest label: [[1, 5], [2, 5], [3, 5], [4, 5], [0, 5]] → 1', () => {
      expect(countComponents(6, [[1, 5], [2, 5], [3, 5], [4, 5], [0, 5]])).toBe(1);
    });

    it('complete graph K6 (15 edges, lots of redundant ones) → 1', () => {
      const edges = [];
      for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) edges.push([a, b]);
      expect(countComponents(6, edges)).toBe(1);
    });

    it('ten disjoint pairs (0-1, 2-3, …) → 10', () => {
      const edges = Array.from({ length: 10 }, (_, i) => [2 * i, 2 * i + 1]);
      expect(countComponents(20, edges)).toBe(10);
    });

    it('edges given out of order still join a long path: [[3, 4], [0, 1], [2, 3], [1, 2]] → 1', () => {
      expect(countComponents(5, [[3, 4], [0, 1], [2, 3], [1, 2]])).toBe(1);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force label-propagation count on 300 random graphs', () => {
      const rng = createRng(555);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 30);
        const m = n === 1 ? 0 : randomInt(rng, 0, n + 5);
        const edges = [];
        for (let k = 0; k < m; k++) {
          const u = randomInt(rng, 0, n - 1);
          let v = randomInt(rng, 0, n - 1);
          if (v === u) v = (u + 1) % n;
          edges.push([u, v]); // repeats allowed on purpose
        }
        expect(countComponents(n, edges), `n=${n} edges=${JSON.stringify(edges)}`).toBe(countBrute(n, edges));
      }
    });
  });

  describe('performance', () => {
    it('star of 100,000 vertices with edges [0, i] → 1 (union-find without path compression or union by rank degrades to O(n²))', () => {
      const n = 100_000;
      const edges = [];
      for (let i = 1; i < n; i++) edges.push([0, i]);
      const { result, ms } = measure(() => countComponents(n, edges));
      expect(result).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — keep union-find trees flat`).toBeLessThan(500);
    });

    it('the same star with edges written [i, 0] → 1 (catches the other naive linking direction)', () => {
      const n = 100_000;
      const edges = [];
      for (let i = 1; i < n; i++) edges.push([i, 0]);
      const { result, ms } = measure(() => countComponents(n, edges));
      expect(result).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — keep union-find trees flat`).toBeLessThan(500);
    });

    it('one path through 200,000 vertices in shuffled order → 1 (a recursive DFS overflows the call stack)', () => {
      const n = 200_000;
      const rng = createRng(8);
      const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
      const edges = [];
      for (let i = 0; i + 1 < n; i++) edges.push([order[i], order[i + 1]]);
      shuffle(rng, edges);
      const { result, ms } = measure(() => countComponents(n, edges));
      expect(result).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for near-linear time`).toBeLessThan(1500);
    });

    it('200,000 vertices in exactly 1,234 components, with duplicate and cycle-closing edges', () => {
      const n = 200_000;
      const { edges } = knownComponents(n, 1234, 9);
      const { result, ms } = measure(() => countComponents(n, edges));
      expect(result).toBe(1234);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for near-linear time`).toBeLessThan(1500);
    });
  });
});

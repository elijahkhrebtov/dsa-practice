import { describe, it, expect } from 'vitest';
import { minCostConnectPoints } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

/**
 * Brute force for tiny inputs: try every subset of n - 1 edges, keep the
 * cheapest one that connects all points.
 */
function bruteForce(points) {
  const n = points.length;
  if (n <= 1) return 0;
  const edges = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j, dist(points[i], points[j])]);
  let best = Infinity;
  const chosen = [];
  const connectsAll = () => {
    const label = Array.from({ length: n }, (_, i) => i);
    for (const [i, j] of chosen) {
      const from = label[i];
      const to = label[j];
      for (let v = 0; v < n; v++) if (label[v] === from) label[v] = to;
    }
    return label.every((l) => l === label[0]);
  };
  const pick = (start, cost) => {
    if (chosen.length === n - 1) {
      if (cost < best && connectsAll()) best = cost;
      return;
    }
    for (let e = start; e < edges.length; e++) {
      chosen.push(edges[e]);
      pick(e + 1, cost + edges[e][2]);
      chosen.pop();
    }
  };
  pick(0, 0);
  return best;
}

/** n distinct points drawn by `next(rng)`. */
function distinctPoints(seed, n, next) {
  const rng = createRng(seed);
  const seen = new Set();
  const points = [];
  while (points.length < n) {
    const [x, y] = next(rng);
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    points.push([x, y]);
  }
  return points;
}

describe('Min Cost to Connect All Points', () => {
  describe('examples from the problem', () => {
    it('[[0,0],[1,1],[1,0],[-1,1]] → 4', () => {
      expect(minCostConnectPoints([[0, 0], [1, 1], [1, 0], [-1, 1]])).toBe(4);
    });

    it('[[3,12],[-2,5],[-4,1]] → 18 (the two cheapest of three connections)', () => {
      expect(minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]])).toBe(18);
    });

    it('[[0,0],[2,2],[3,10],[5,2],[7,0]] → 20', () => {
      expect(minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]])).toBe(20);
    });

    it('[[5,-7]] → 0 (a single point needs no connections)', () => {
      expect(minCostConnectPoints([[5, -7]])).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('two points → their Manhattan distance', () => {
      expect(minCostConnectPoints([[1, 2], [4, -2]])).toBe(7);
    });

    it('distance is Manhattan, not Euclidean: [[0,0],[3,4]] → 7 (not 5)', () => {
      expect(minCostConnectPoints([[0, 0], [3, 4]])).toBe(7);
    });

    it('opposite corners of the coordinate range → 4,000,000', () => {
      expect(minCostConnectPoints([[-1_000_000, -1_000_000], [1_000_000, 1_000_000]])).toBe(4_000_000);
    });

    it('collinear points given out of order → just the span (max − min)', () => {
      expect(minCostConnectPoints([[7, 3], [-2, 3], [15, 3], [0, 3], [4, 3]])).toBe(17);
    });

    it('does not modify the input array', () => {
      const points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
      const copy = points.map((p) => [...p]);
      minCostConnectPoints(points);
      expect(points).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('a star layout → 20 (the tree branches; chaining the points into a path would cost more)', () => {
      expect(minCostConnectPoints([[5, 0], [0, 0], [-5, 0], [0, 5], [0, -5]])).toBe(20);
    });

    it('three mutually equidistant points → 4, not 6 (never close a cycle)', () => {
      // Every pair is at distance 2.
      expect(minCostConnectPoints([[0, 0], [1, 1], [2, 0]])).toBe(4);
    });

    it('unit square → 3 (ties everywhere; any 3 of the 4 sides)', () => {
      expect(minCostConnectPoints([[0, 0], [0, 1], [1, 1], [1, 0]])).toBe(3);
    });

    it('two far-apart clusters: each cluster internally plus ONE shortest bridge', () => {
      // Cluster A: square of side 1 at the origin (3). Cluster B: square of
      // side 1 at (100, 0) (3). Closest bridge: [1,0]–[100,0] = 99.
      const points = [[0, 0], [0, 1], [1, 1], [1, 0], [100, 0], [100, 1], [101, 1], [101, 0]];
      expect(minCostConnectPoints(points)).toBe(3 + 3 + 99);
    });

    it('the greedy "always connect to the nearest unvisited point from the LAST point" walk is not optimal', () => {
      // Walking 0 → nearest → nearest … builds a path; the MST may branch
      // back from an earlier point instead.
      const points = [[0, 0], [10, 0], [0, 11], [20, 0], [0, 22]];
      // MST: [0,0]-[10,0] 10, [10,0]-[20,0] 10, [0,0]-[0,11] 11, [0,11]-[0,22] 11.
      expect(minCostConnectPoints(points)).toBe(42);
    });

    it('a k×k unit grid → k² − 1 (8×8 → 63)', () => {
      const points = [];
      for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) points.push([x, y]);
      expect(minCostConnectPoints(shuffle(createRng(5), points))).toBe(63);
    });

    it('the answer does not depend on the order of the points', () => {
      const points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0], [-4, 6], [9, -9]];
      const rng = createRng(11);
      const expected = bruteForce(points);
      for (let t = 0; t < 5; t++) {
        expect(minCostConnectPoints(shuffle(rng, points.map((p) => [...p])))).toBe(expected);
      }
    });
  });

  describe('randomized (seeded) against brute-force spanning-tree enumeration', () => {
    it('agrees on 150 random point sets of up to 6 points', () => {
      const rng = createRng(99);
      for (let t = 0; t < 150; t++) {
        const n = randomInt(rng, 1, 6);
        const points = distinctPoints(t + 1, n, (r) => [randomInt(r, -10, 10), randomInt(r, -10, 10)]);
        expect(minCostConnectPoints(points), `points = ${JSON.stringify(points)}`).toBe(bruteForce(points));
      }
    });
  });

  describe('performance', () => {
    it('three sets of 1000 points (uniform, clustered, grid) quickly (an O(n³) cheapest-crossing-edge search is too slow)', () => {
      const uniform = distinctPoints(1001, 1000, (r) => [
        randomInt(r, -1_000_000, 1_000_000),
        randomInt(r, -1_000_000, 1_000_000),
      ]);
      const centerRng = createRng(2002);
      const centers = Array.from({ length: 10 }, () => [
        randomInt(centerRng, -900_000, 900_000),
        randomInt(centerRng, -900_000, 900_000),
      ]);
      const clustered = distinctPoints(2002, 1000, (r) => {
        const [cx, cy] = centers[randomInt(r, 0, 9)];
        return [cx + randomInt(r, -5000, 5000), cy + randomInt(r, -5000, 5000)];
      });
      // 25 × 40 grid with spacing 7 → MST = 999 × 7.
      const grid = [];
      for (let x = 0; x < 25; x++) for (let y = 0; y < 40; y++) grid.push([x * 7 - 500, y * 7 + 300]);
      shuffle(createRng(3003), grid);

      const { result, ms } = measure(() => [
        minCostConnectPoints(uniform),
        minCostConnectPoints(clustered),
        minCostConnectPoints(grid),
      ]);
      // The first two values were precomputed and cross-checked with Prim and Kruskal.
      expect(result).toEqual([51_399_689, 6_068_312, 999 * 7]);
      expect(ms, `took ${ms.toFixed(0)}ms — O(n²) Prim needs no edge list at all`).toBeLessThan(1000);
    });
  });
});

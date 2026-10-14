import { describe, it, expect } from 'vitest';
import { networkDelayTime } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Floyd–Warshall on a tiny graph: the obviously-correct (but O(n³)) oracle. */
function bruteForce(times, n, k) {
  const d = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === j ? 0 : Infinity)),
  );
  for (const [u, v, w] of times) d[u][v] = Math.min(d[u][v], w);
  for (let m = 1; m <= n; m++)
    for (let i = 1; i <= n; i++)
      for (let j = 1; j <= n; j++) if (d[i][m] + d[m][j] < d[i][j]) d[i][j] = d[i][m] + d[m][j];
  let worst = 0;
  for (let v = 1; v <= n; v++) worst = Math.max(worst, d[k][v]);
  return worst === Infinity ? -1 : worst;
}

/**
 * A chain start → … → end of weight-1 edges through all n nodes (in the order
 * given by `labels`), listed BACKWARDS so Bellman-Ford needs ~n rounds, plus
 * filler edges that can never shorten anything. The answer is n - 1.
 */
function adversarialChain(n, totalEdges, seed, labels) {
  const rng = createRng(seed);
  const pos = new Array(n + 1); // pos[label] = position along the chain
  labels.forEach((label, i) => (pos[label] = i));
  const times = [];
  for (let i = n - 2; i >= 0; i--) times.push([labels[i], labels[i + 1], 1]);
  while (times.length < totalEdges) {
    const u = randomInt(rng, 1, n);
    const v = randomInt(rng, 1, n);
    const gap = pos[v] - pos[u];
    if (gap <= 0) times.push([u, v, randomInt(rng, 0, 100)]); // backwards: never helps
    else if (gap <= 100) times.push([u, v, randomInt(rng, gap, 100)]); // forward, but no faster than the chain
  }
  return times;
}

describe('Network Delay Time', () => {
  describe('examples from the problem', () => {
    it('[[2,1,1],[2,3,1],[3,4,1]], n 4, k 2 → 2', () => {
      expect(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)).toBe(2);
    });

    it('[[1,2,1]], n 2, k 1 → 1', () => {
      expect(networkDelayTime([[1, 2, 1]], 2, 1)).toBe(1);
    });

    it('[[1,2,1]], n 2, k 2 → -1 (edges are one-way)', () => {
      expect(networkDelayTime([[1, 2, 1]], 2, 2)).toBe(-1);
    });

    it('[[1,2,10],[1,3,1],[3,2,2]], n 3, k 1 → 3 (the two-edge detour beats the direct edge)', () => {
      expect(networkDelayTime([[1, 2, 10], [1, 3, 1], [3, 2, 2]], 3, 1)).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('a single node and no edges → 0 (the source has the signal at time 0)', () => {
      expect(networkDelayTime([], 1, 1)).toBe(0);
    });

    it('a single node with a self-loop → 0', () => {
      expect(networkDelayTime([[1, 1, 5]], 1, 1)).toBe(0);
    });

    it('two nodes and no edges → -1', () => {
      expect(networkDelayTime([], 2, 1)).toBe(-1);
    });

    it('source is the highest label (k = n), nodes are 1-indexed', () => {
      expect(networkDelayTime([[3, 1, 4], [3, 2, 7]], 3, 3)).toBe(7);
    });

    it('does not modify the input array', () => {
      const times = [[1, 2, 10], [1, 3, 1], [3, 2, 2]];
      const copy = times.map((e) => [...e]);
      networkDelayTime(times, 3, 1);
      expect(times).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('more hops can be faster: hop-count BFS would pick 1→4 (100) over 1→2→3→4 (3)', () => {
      const times = [[1, 4, 100], [1, 2, 1], [2, 3, 1], [3, 4, 1]];
      expect(networkDelayTime(times, 4, 1)).toBe(3);
    });

    it('a shortcut found late must propagate to the nodes behind it → 4', () => {
      // 2 is first reached at 10 (direct), later improved to 3 via 3. Node 4
      // hangs off 2, so it must end up at 3 + 1 = 4, not 10 + 1 = 11.
      const times = [[1, 2, 10], [2, 4, 1], [1, 3, 1], [3, 2, 2]];
      expect(networkDelayTime(times, 4, 1)).toBe(4);
    });

    it('parallel edges: [[1,2,5],[1,2,2],[1,2,9]] → 2 (the fastest copy wins)', () => {
      expect(networkDelayTime([[1, 2, 5], [1, 2, 2], [1, 2, 9]], 2, 1)).toBe(2);
    });

    it('zero-time edges: everyone can receive at time 0', () => {
      expect(networkDelayTime([[1, 2, 0], [2, 3, 0], [3, 4, 0]], 4, 1)).toBe(0);
    });

    it('the answer is the MAX arrival time, not the sum: star with times 3, 5, 2 → 5', () => {
      expect(networkDelayTime([[1, 2, 3], [1, 3, 5], [1, 4, 2]], 4, 1)).toBe(5);
    });

    it('a node with only OUTGOING edges is never reached → -1', () => {
      // Node 3 can send to 1, but nothing sends to 3.
      expect(networkDelayTime([[3, 1, 1], [1, 2, 1]], 3, 1)).toBe(-1);
    });

    it('a reversed edge does not count: [[2,1,1],[1,3,1]], k 1 → -1 (node 2 is unreachable)', () => {
      expect(networkDelayTime([[2, 1, 1], [1, 3, 1]], 3, 1)).toBe(-1);
    });

    it('cycles do not cause infinite loops: 1→2→3→1 with a tail 3→4 → 6', () => {
      const times = [[1, 2, 2], [2, 3, 2], [3, 1, 2], [3, 4, 2]];
      expect(networkDelayTime(times, 4, 1)).toBe(6);
    });

    it('edges pointing back into the source are harmless: [[2,1,0],[1,2,5]] → 5', () => {
      expect(networkDelayTime([[2, 1, 0], [1, 2, 5]], 2, 1)).toBe(5);
    });

    it('the farthest node is not the one with the largest label', () => {
      // 1 → 5 (1), 1 → 2 (4), 2 → 3 (4) : node 3 is last at 8.
      const times = [[1, 5, 1], [1, 2, 4], [2, 3, 4], [5, 4, 1]];
      expect(networkDelayTime(times, 5, 1)).toBe(8);
    });
  });

  describe('randomized (seeded) against Floyd–Warshall', () => {
    it('agrees on 300 random small graphs (including unreachable nodes, zero weights and parallel edges)', () => {
      const rng = createRng(31337);
      let unreachable = 0;
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 10);
        const m = randomInt(rng, 0, 3 * n);
        const times = [];
        for (let e = 0; e < m; e++) {
          times.push([randomInt(rng, 1, n), randomInt(rng, 1, n), randomInt(rng, 0, 20)]);
        }
        const k = randomInt(rng, 1, n);
        const expected = bruteForce(times, n, k);
        if (expected === -1) unreachable++;
        expect(networkDelayTime(times, n, k), `times=${JSON.stringify(times)}, n=${n}, k=${k}`).toBe(expected);
      }
      expect(unreachable).toBeGreaterThan(30); // the generator exercises the -1 path too
    });
  });

  describe('performance', () => {
    it('two graphs with 10,000 nodes and 100,000 edges each → 9999, quickly (Bellman-Ford needs ~10^4 rounds × 10^5 edges here)', () => {
      const n = 10_000;
      const inOrder = Array.from({ length: n }, (_, i) => i + 1);
      const scrambled = shuffle(createRng(99), [...inOrder]);
      const graphA = adversarialChain(n, 100_000, 1, inOrder);
      const graphB = adversarialChain(n, 100_000, 2, scrambled);

      const { result, ms } = measure(() => [
        networkDelayTime(graphA, n, inOrder[0]),
        networkDelayTime(graphB, n, scrambled[0]),
      ]);
      expect(result).toEqual([n - 1, n - 1]);
      expect(ms, `took ${ms.toFixed(0)}ms — use Dijkstra with a heap, O((V + E) log V)`).toBeLessThan(500);
    });

    it('a 10,000-node chain of weight-100 edges → 999,900 (large distances, deep graph)', () => {
      const n = 10_000;
      const times = Array.from({ length: n - 1 }, (_, i) => [i + 1, i + 2, 100]);
      const { result, ms } = measure(() => networkDelayTime(times, n, 1));
      expect(result).toBe(999_900);
      expect(ms).toBeLessThan(500);
    });
  });
});

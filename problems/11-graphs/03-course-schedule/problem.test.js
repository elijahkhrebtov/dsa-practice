import { describe, it, expect } from 'vitest';
import { canFinish } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: transitive closure (Floyd–Warshall style). There is a
 * cycle exactly when some course can reach itself. O(n³), fine for n ≤ 25.
 */
function canFinishBrute(n, prerequisites) {
  const reach = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [a, b] of prerequisites) reach[b][a] = true;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      if (reach[i][k]) for (let j = 0; j < n; j++) if (reach[k][j]) reach[i][j] = true;
  for (let i = 0; i < n; i++) if (reach[i][i]) return false;
  return true;
}

/** A chain through all `n` courses in a shuffled order: order[0] → order[1] → … */
function shuffledChain(n, seed) {
  const rng = createRng(seed);
  const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
  const prereqs = [];
  for (let i = 0; i + 1 < n; i++) prereqs.push([order[i + 1], order[i]]);
  shuffle(rng, prereqs);
  return { prereqs, order };
}

describe('Course Schedule', () => {
  describe('examples from the problem', () => {
    it('2 courses, [[1, 0]] → true (take 0, then 1)', () => {
      expect(canFinish(2, [[1, 0]])).toBe(true);
    });

    it('2 courses, [[1, 0], [0, 1]] → false (they need each other)', () => {
      expect(canFinish(2, [[1, 0], [0, 1]])).toBe(false);
    });

    it('4 courses, cycle 1 → 2 → 3 → 1 hanging off course 0 → false', () => {
      expect(canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]])).toBe(false);
    });

    it('4 courses, diamond 0 → {1, 2} → 3 → true (two routes to 3 is not a cycle)', () => {
      expect(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]])).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('1 course, no prerequisites → true', () => {
      expect(canFinish(1, [])).toBe(true);
    });

    it('5 courses, no prerequisites at all → true', () => {
      expect(canFinish(5, [])).toBe(true);
    });

    it('a course that requires itself, [[0, 0]] → false (a self-loop is a cycle of length 1)', () => {
      expect(canFinish(1, [[0, 0]])).toBe(false);
    });

    it('one self-loop hidden in an otherwise fine schedule → false', () => {
      expect(canFinish(4, [[1, 0], [2, 1], [3, 3]])).toBe(false);
    });

    it('the same prerequisite listed twice, [[1, 0], [1, 0]] → true (duplicates are not a cycle)', () => {
      expect(canFinish(2, [[1, 0], [1, 0]])).toBe(true);
    });

    it('duplicates mixed with a genuine 2-cycle → false', () => {
      expect(canFinish(3, [[1, 0], [1, 0], [2, 1], [1, 2]])).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('[[1, 0], [2, 0], [2, 1]] → true (a triangle when drawn undirected, but no DIRECTED cycle)', () => {
      expect(canFinish(3, [[1, 0], [2, 0], [2, 1]])).toBe(true);
    });

    it('the cycle lives in a part of the graph unreachable from course 0 → false (check every component)', () => {
      expect(canFinish(6, [[1, 0], [2, 1], [4, 3], [5, 4], [3, 5]])).toBe(false);
    });

    it('a cycle among the highest-numbered courses only → false', () => {
      expect(canFinish(8, [[7, 6], [6, 7]])).toBe(false);
    });

    it('a 2-cycle at the end of a long chain → false', () => {
      expect(canFinish(5, [[1, 0], [2, 1], [3, 2], [4, 3], [3, 4]])).toBe(false);
    });

    it('a ring through all 10 courses → false', () => {
      const prereqs = Array.from({ length: 10 }, (_, i) => [(i + 1) % 10, i]);
      expect(canFinish(10, prereqs)).toBe(false);
    });

    it('the same ring with one edge removed → true (just a chain)', () => {
      const prereqs = Array.from({ length: 9 }, (_, i) => [i + 1, i]);
      expect(canFinish(10, prereqs)).toBe(true);
    });

    it('layered DAG where courses share prerequisites → true (a single "visited" flag would mistake shared prerequisites for a cycle)', () => {
      // Layered DAG: every course in layer L requires every course in layer L-1.
      const prereqs = [];
      for (let layer = 1; layer < 4; layer++)
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) prereqs.push([layer * 3 + a, (layer - 1) * 3 + b]);
      expect(canFinish(12, prereqs)).toBe(true);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a transitive-closure oracle on 300 random schedules (about half contain a cycle)', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 15);
        // Start from a random DAG (edges always go "forward" in a random order)…
        const rank = shuffle(rng, Array.from({ length: n }, (_, i) => i));
        const m = randomInt(rng, 0, 2 * n);
        const prereqs = [];
        for (let k = 0; k < m && n > 1; k++) {
          let x = randomInt(rng, 0, n - 1);
          let y = randomInt(rng, 0, n - 1);
          if (x === y) continue;
          if (rank[x] > rank[y]) [x, y] = [y, x];
          prereqs.push([y, x]); // x before y
        }
        // …then sometimes add one arbitrary edge, which may close a cycle.
        if (rng() < 0.5) prereqs.push([randomInt(rng, 0, n - 1), randomInt(rng, 0, n - 1)]);
        shuffle(rng, prereqs);
        const expected = canFinishBrute(n, prereqs);
        expect(canFinish(n, prereqs), `n=${n} prerequisites=${JSON.stringify(prereqs)}`).toBe(expected);
      }
    });
  });

  describe('performance', () => {
    it('dense layered DAG: 1,000 courses, 100,000 prerequisites → true (re-scanning all pairs for each course taken is O(V·E))', () => {
      const n = 1000;
      const rng = createRng(5);
      const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
      const prereqs = [];
      for (let i = 0; i + 1 < n; i++) prereqs.push([order[i + 1], order[i]]); // a spine forces 1,000 "levels"
      while (prereqs.length < 100_000) {
        const x = randomInt(rng, 0, n - 2);
        const y = randomInt(rng, x + 1, n - 1);
        prereqs.push([order[y], order[x]]);
      }
      shuffle(rng, prereqs);
      const { result, ms } = measure(() => canFinish(n, prereqs));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1000);
    });

    it('a chain of 20,000 courses → true (a recursive DFS overflows the call stack — go iterative)', () => {
      const n = 20_000;
      const { prereqs } = shuffledChain(n, 77);
      const { result, ms } = measure(() => canFinish(n, prereqs));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1500);
    });

    it('a 20,000-course chain closed into one giant cycle → false (the recursion-depth trap again)', () => {
      const n = 20_000;
      const { prereqs, order } = shuffledChain(n, 78);
      prereqs.push([order[0], order[n - 1]]);
      const { result, ms } = measure(() => canFinish(n, prereqs));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1500);
    });
  });
});

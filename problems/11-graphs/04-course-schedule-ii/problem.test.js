import { describe, it, expect } from 'vitest';
import { findOrder } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Checks that `order` lists every course exactly once and respects every prerequisite. */
function expectValidOrder(n, prerequisites, order) {
  expect(Array.isArray(order), 'should return an array').toBe(true);
  expect(order.length, 'the order must contain every course exactly once').toBe(n);
  const pos = new Array(n).fill(-1);
  order.forEach((course, i) => {
    if (!(Number.isInteger(course) && course >= 0 && course < n)) {
      expect.fail(`order[${i}] = ${course} is not a course label in 0..${n - 1}`);
    }
    if (pos[course] !== -1) expect.fail(`course ${course} appears twice (at ${pos[course]} and ${i})`);
    pos[course] = i;
  });
  for (const [a, b] of prerequisites) {
    if (pos[b] >= pos[a]) expect.fail(`course ${b} must come before course ${a} (prerequisite [${a}, ${b}])`);
  }
}

/**
 * Brute-force oracle for "is a valid order possible at all?": transitive
 * closure; impossible exactly when some course can reach itself.
 */
function possibleBrute(n, prerequisites) {
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

describe('Course Schedule II', () => {
  describe('examples from the problem', () => {
    it('2 courses, [[1, 0]] → [0, 1] (the only valid order)', () => {
      expect(findOrder(2, [[1, 0]])).toEqual([0, 1]);
    });

    it('diamond 0 → {1, 2} → 3 → [0, 1, 2, 3] or [0, 2, 1, 3]', () => {
      const pre = [[1, 0], [2, 0], [3, 1], [3, 2]];
      expectValidOrder(4, pre, findOrder(4, pre));
    });

    it('cycle 0 → 1 → 2 → 0 → []', () => {
      expect(findOrder(3, [[1, 0], [2, 1], [0, 2]])).toEqual([]);
    });

    it('1 course, no prerequisites → [0]', () => {
      expect(findOrder(1, [])).toEqual([0]);
    });
  });

  describe('edge cases', () => {
    it('3 courses, no prerequisites → any arrangement of 0, 1, 2', () => {
      expectValidOrder(3, [], findOrder(3, []));
    });

    it('self-prerequisite [[0, 0]] → [] (a self-loop is a cycle)', () => {
      expect(findOrder(1, [[0, 0]])).toEqual([]);
    });

    it('self-loop on one course of an otherwise valid schedule → [] (not the courses that could be taken)', () => {
      expect(findOrder(4, [[1, 0], [2, 1], [3, 3]])).toEqual([]);
    });

    it('the same pair listed three times → still a valid order with each course once', () => {
      const pre = [[1, 0], [1, 0], [1, 0], [2, 1]];
      expect(findOrder(3, pre)).toEqual([0, 1, 2]);
    });
  });

  describe('tricky cases', () => {
    it('a cycle makes the answer [] — never a partial order of the courses that could be taken', () => {
      // 0 and 1 are fine, 2 ⇄ 3 is a cycle.
      expect(findOrder(4, [[1, 0], [3, 2], [2, 3]])).toEqual([]);
    });

    it('a cycle in a component unreachable from course 0 → []', () => {
      expect(findOrder(6, [[1, 0], [2, 1], [4, 3], [5, 4], [3, 5]])).toEqual([]);
    });

    it('courses that appear in no pair must still be in the order', () => {
      const pre = [[3, 1]];
      expectValidOrder(6, pre, findOrder(6, pre));
    });

    it('labels run "backwards": [[0, 1], [1, 2], [2, 3], [3, 4]] → exactly [4, 3, 2, 1, 0]', () => {
      expect(findOrder(5, [[0, 1], [1, 2], [2, 3], [3, 4]])).toEqual([4, 3, 2, 1, 0]);
    });

    it('[[1, 0], [2, 0], [2, 1]] → exactly [0, 1, 2] (an undirected triangle, but a valid DAG)', () => {
      expect(findOrder(3, [[1, 0], [2, 0], [2, 1]])).toEqual([0, 1, 2]);
    });

    it('a course with many prerequisites must wait for ALL of them, not just the first one finished', () => {
      const pre = [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [2, 0], [3, 2]];
      expectValidOrder(6, pre, findOrder(6, pre));
    });

    it('two independent chains interleave freely, but each chain keeps its own order', () => {
      const pre = [[1, 0], [2, 1], [3, 2], [5, 4], [6, 5], [7, 6]];
      expectValidOrder(8, pre, findOrder(8, pre));
    });

    it('layered DAG where every course of a layer requires every course of the previous layer', () => {
      const pre = [];
      for (let layer = 1; layer < 4; layer++)
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) pre.push([layer * 3 + a, (layer - 1) * 3 + b]);
      expectValidOrder(12, pre, findOrder(12, pre));
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('returns a valid order (or [] exactly when impossible) for 300 random schedules', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 15);
        const rank = shuffle(rng, Array.from({ length: n }, (_, i) => i));
        const m = randomInt(rng, 0, 2 * n);
        const pre = [];
        for (let k = 0; k < m && n > 1; k++) {
          let x = randomInt(rng, 0, n - 1);
          let y = randomInt(rng, 0, n - 1);
          if (x === y) continue;
          if (rank[x] > rank[y]) [x, y] = [y, x];
          pre.push([y, x]);
        }
        if (rng() < 0.5) pre.push([randomInt(rng, 0, n - 1), randomInt(rng, 0, n - 1)]); // may close a cycle
        shuffle(rng, pre);
        const result = findOrder(n, pre);
        if (possibleBrute(n, pre)) expectValidOrder(n, pre, result);
        else expect(result, `n=${n} prerequisites=${JSON.stringify(pre)} has a cycle`).toEqual([]);
      }
    });
  });

  describe('performance', () => {
    it('dense layered DAG: 1,000 courses, 100,000 prerequisites (re-scanning all pairs for each course taken is O(V·E))', () => {
      const n = 1000;
      const rng = createRng(6);
      const order = shuffle(rng, Array.from({ length: n }, (_, i) => i));
      const pre = [];
      for (let i = 0; i + 1 < n; i++) pre.push([order[i + 1], order[i]]); // a spine through all 1,000 courses
      while (pre.length < 100_000) {
        const x = randomInt(rng, 0, n - 2);
        const y = randomInt(rng, x + 1, n - 1);
        pre.push([order[y], order[x]]);
      }
      shuffle(rng, pre);
      const { result, ms } = measure(() => findOrder(n, pre));
      expectValidOrder(n, pre, result); // only one valid order exists: `order`
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1000);
    });

    it('a chain of 20,000 courses → its unique order (a recursive DFS overflows the call stack — go iterative)', () => {
      const n = 20_000;
      const { prereqs } = shuffledChain(n, 90);
      const { result, ms } = measure(() => findOrder(n, prereqs));
      expectValidOrder(n, prereqs, result); // only one valid order exists: `order`
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1500);
    });

    it('a 20,000-course chain closed into one giant cycle → []', () => {
      const n = 20_000;
      const { prereqs, order } = shuffledChain(n, 91);
      prereqs.push([order[0], order[n - 1]]);
      const { result, ms } = measure(() => findOrder(n, prereqs));
      expect(result).toEqual([]);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1500);
    });

    it('100,000 courses with no prerequisites at all → every course once', () => {
      const n = 100_000;
      const { result, ms } = measure(() => findOrder(n, []));
      expectValidOrder(n, [], result);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(V + E)`).toBeLessThan(1000);
    });
  });
});

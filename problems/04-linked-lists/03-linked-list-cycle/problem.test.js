import { describe, it, expect } from 'vitest';
import { hasCycle } from './problem.js';
import { arrayToCyclicList } from '../../../lib/linked-list.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Records each node's value, next-index and own property names, so we can detect modifications. */
function snapshot(nodes) {
  const index = new Map(nodes.map((n, i) => [n, i]));
  return nodes.map((n) => ({
    val: n.val,
    next: n.next === null ? null : index.get(n.next) ?? 'foreign node',
    keys: Object.keys(n).sort().join(','),
  }));
}

/** Builds the list, runs hasCycle, checks the list wasn't modified, and returns the answer. */
function run(values, pos) {
  const { head, nodes } = arrayToCyclicList(values, pos);
  const before = snapshot(nodes);
  const answer = hasCycle(head);
  expect(snapshot(nodes), 'the list must not be modified (values, links or extra properties)').toEqual(before);
  return answer;
}

describe('Linked List Cycle', () => {
  describe('examples from the problem', () => {
    it('3 → 2 → 0 → -4 with the tail linking back to index 1 → true', () => {
      expect(run([3, 2, 0, -4], 1)).toBe(true);
    });

    it('1 → 2 with the tail linking back to the head → true', () => {
      expect(run([1, 2], 0)).toBe(true);
    });

    it('a single node with no cycle → false', () => {
      expect(run([1], -1)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('an empty list (null) has no cycle → false', () => {
      expect(hasCycle(null)).toBe(false);
    });

    it('a single node pointing to itself is a cycle → true', () => {
      expect(run([1], 0)).toBe(true);
    });

    it('two nodes, no cycle → false', () => {
      expect(run([1, 2], -1)).toBe(false);
    });

    it('the tail pointing to itself (pos = last index) → true', () => {
      expect(run([1, 2, 3, 4, 5], 4)).toBe(true);
    });
  });

  describe('tricky cases', () => {
    it('odd-length list without a cycle → false (fast pointer lands exactly on the tail)', () => {
      expect(run([1, 2, 3, 4, 5], -1)).toBe(false);
    });

    it('even-length list without a cycle → false (fast pointer runs off past the tail)', () => {
      // Classic crash: reading fast.next.next when fast.next is already null.
      expect(run([1, 2, 3, 4, 5, 6], -1)).toBe(false);
    });

    it('equal values are not a cycle: 1 → 1 → 1 → 1 → false (compare nodes, not values)', () => {
      expect(run([1, 1, 1, 1], -1)).toBe(false);
    });

    it('a long tail before a short cycle: 10 nodes then a cycle of length 2 → true', () => {
      expect(run([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10)).toBe(true);
    });

    it('a cycle through the whole list (tail → head) → true', () => {
      expect(run([5, 4, 3, 2, 1, 0, -1], 0)).toBe(true);
    });

    it('does not mark nodes: the list is left exactly as it was (also checked in every other test)', () => {
      const { head, nodes } = arrayToCyclicList([1, 2, 3, 4], 2);
      expect(hasCycle(head)).toBe(true);
      expect(nodes.map((n) => n.val)).toEqual([1, 2, 3, 4]);
      expect(nodes[3].next).toBe(nodes[2]);
      nodes.forEach((n) => expect(Object.keys(n).sort()).toEqual(['next', 'val']));
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('400 random lists with and without cycles', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 60);
        const values = randomIntArray(rng, n, -3, 3); // lots of duplicate values on purpose
        const pos = rng() < 0.5 ? -1 : randomInt(rng, 0, n - 1);
        expect(run(values, pos), `n=${n}, pos=${pos}`).toBe(pos !== -1);
      }
    });
  });

  describe('performance', () => {
    it('150,000-node lists with and without a cycle (checking each node against an array of visited nodes is O(n²) — too slow)', () => {
      const n = 150_000;
      const values = Array.from({ length: n }, (_, i) => (i % 200_001) - 100_000);
      const withCycle = arrayToCyclicList(values, 0).head; // tail links back to the head
      const withoutCycle = arrayToCyclicList(values, -1).head;
      const { result, ms } = measure(() => [hasCycle(withCycle), hasCycle(withoutCycle)]);
      expect(result).toEqual([true, false]);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(400);
    });
  });
});

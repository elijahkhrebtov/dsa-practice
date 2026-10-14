import { describe, it, expect } from 'vitest';
import { detectCycle } from './problem.js';
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

/**
 * Builds the list, runs detectCycle, checks the list wasn't modified, and
 * returns the INDEX of the returned node (-1 for null) so failures read nicely.
 */
function run(values, pos) {
  const { head, nodes } = arrayToCyclicList(values, pos);
  const before = snapshot(nodes);
  const result = detectCycle(head);
  expect(snapshot(nodes), 'the list must not be modified (values, links or extra properties)').toEqual(before);
  if (result === null) return -1;
  const index = nodes.indexOf(result);
  expect(index, 'must return one of the list nodes (or null), not a value or a new node').not.toBe(-1);
  return index;
}

describe('Linked List Cycle II', () => {
  describe('examples from the problem', () => {
    it('3 → 2 → 0 → -4 with the tail linking to index 1 → the node at index 1', () => {
      expect(run([3, 2, 0, -4], 1)).toBe(1);
    });

    it('1 → 2 with the tail linking to the head → the head', () => {
      expect(run([1, 2], 0)).toBe(0);
    });

    it('a single node with no cycle → null', () => {
      expect(run([1], -1)).toBe(-1);
    });
  });

  describe('edge cases', () => {
    it('an empty list (null) → null', () => {
      expect(detectCycle(null)).toBeNull();
    });

    it('a single node pointing to itself → that node', () => {
      const { head } = arrayToCyclicList([42], 0);
      expect(detectCycle(head)).toBe(head);
    });

    it('two nodes, no cycle → null', () => {
      expect(run([1, 2], -1)).toBe(-1);
    });

    it('odd and even lengths without a cycle → null (no crash when fast runs off the end)', () => {
      expect(run([1, 2, 3, 4, 5], -1)).toBe(-1);
      expect(run([1, 2, 3, 4, 5, 6], -1)).toBe(-1);
    });

    it('the tail pointing to itself → the tail node', () => {
      expect(run([1, 2, 3, 4, 5], 4)).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('the meeting point of fast & slow is usually NOT the cycle start (returning it is a common bug)', () => {
      // Tail of 6 nodes, cycle of 4 nodes (indices 6..9): slow and fast meet inside the loop, away from index 6.
      expect(run([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6)).toBe(6);
    });

    it('a tail much longer than the cycle (fast laps the loop many times): 50 nodes, cycle of 3', () => {
      const values = Array.from({ length: 53 }, (_, i) => i);
      expect(run(values, 50)).toBe(50);
    });

    it('a cycle much longer than the tail: 1 node before a loop of 40', () => {
      const values = Array.from({ length: 41 }, (_, i) => i);
      expect(run(values, 1)).toBe(1);
    });

    it('a cycle through the whole list (tail → head) → the head', () => {
      expect(run([9, 8, 7, 6, 5, 4, 3], 0)).toBe(0);
    });

    it('all values equal: 7 → 7 → 7 → 7 → 7 with the tail → index 2 must return THAT node (identity, not value)', () => {
      expect(run([7, 7, 7, 7, 7], 2)).toBe(2);
    });

    it('returns a node, not a value or an index', () => {
      const { head, nodes } = arrayToCyclicList([3, 2, 0, -4], 1);
      expect(detectCycle(head)).toBe(nodes[1]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('400 random lists with and without cycles, compared against the known pos', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 80);
        const values = randomIntArray(rng, n, -2, 2); // many duplicates on purpose
        const pos = rng() < 0.25 ? -1 : randomInt(rng, 0, n - 1);
        expect(run(values, pos), `n=${n}, pos=${pos}`).toBe(pos);
      }
    });
  });

  describe('performance', () => {
    it('150,000-node lists with a cycle in the middle and with none (an O(n²) search of visited nodes is too slow)', () => {
      const n = 150_000;
      const values = Array.from({ length: n }, (_, i) => (i % 200_001) - 100_000);
      const withCycle = arrayToCyclicList(values, 70_000);
      const withoutCycle = arrayToCyclicList(values, -1);
      const { result, ms } = measure(() => [detectCycle(withCycle.head), detectCycle(withoutCycle.head)]);
      // Compare indices rather than nodes, so a failure message doesn't try to print 150,000 nodes.
      expect(withCycle.nodes.indexOf(result[0]), 'should return the node at index 70,000').toBe(70_000);
      expect(result[1] === null, 'the list without a cycle should give null').toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(400);
    });
  });
});

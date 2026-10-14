import { describe, it, expect } from 'vitest';
import { canAttendMeetings } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** O(n²) reference: check every pair with the half-open overlap test. */
function bruteForce(intervals) {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [a, b] = [intervals[i], intervals[j]];
      if (a[0] < b[1] && b[0] < a[1]) return false;
    }
  }
  return true;
}

/** Deep copy so the function under test can sort freely. */
const copy = (intervals) => intervals.map((iv) => [...iv]);

describe('Meeting Rooms', () => {
  describe('examples from the problem', () => {
    it('[[0, 30], [5, 10], [15, 20]] → false ([0, 30] swallows the others)', () => {
      expect(canAttendMeetings([[0, 30], [5, 10], [15, 20]])).toBe(false);
    });

    it('[[7, 10], [2, 4]] → true (unsorted input)', () => {
      expect(canAttendMeetings([[7, 10], [2, 4]])).toBe(true);
    });

    it('[[1, 5], [5, 8]] → true (touching meetings do not conflict: half-open)', () => {
      expect(canAttendMeetings([[1, 5], [5, 8]])).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('no meetings → true', () => {
      expect(canAttendMeetings([])).toBe(true);
    });

    it('a single meeting → true', () => {
      expect(canAttendMeetings([[3, 9]])).toBe(true);
    });

    it('two identical meetings → false', () => {
      expect(canAttendMeetings([[2, 6], [2, 6]])).toBe(false);
    });

    it('meetings that share only a start time → false', () => {
      expect(canAttendMeetings([[4, 5], [4, 9]])).toBe(false);
    });

    it('meetings that share only an end time → false', () => {
      expect(canAttendMeetings([[1, 9], [6, 9]])).toBe(false);
    });

    it('overlapping by a single unit → false ([1, 6] and [5, 8])', () => {
      expect(canAttendMeetings([[1, 6], [5, 8]])).toBe(false);
    });

    it('extreme times 0 and 10^6', () => {
      expect(canAttendMeetings([[500_000, 1_000_000], [0, 500_000]])).toBe(true);
      expect(canAttendMeetings([[0, 1_000_000], [999_999, 1_000_000]])).toBe(false);
    });

    it('returns real booleans, not truthy/falsy values', () => {
      expect(canAttendMeetings([[1, 2]])).toBe(true);
      expect(canAttendMeetings([[1, 3], [2, 4]])).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('a long meeting listed last swallows the earlier-listed ones (input order is not time order)', () => {
      expect(canAttendMeetings([[50, 60], [2, 3], [1, 100]])).toBe(false);
    });

    it('a chain of back-to-back meetings in shuffled order → true', () => {
      expect(canAttendMeetings([[6, 9], [0, 2], [9, 10], [2, 6]])).toBe(true);
    });

    it('the only conflict is between the last two meetings in time order', () => {
      expect(canAttendMeetings([[30, 40], [0, 10], [10, 20], [39, 50]])).toBe(false);
    });

    it('numeric sort, not string sort: [[10, 20], [5, 8], [100, 200], [9, 10]] → true', () => {
      // Default .sort() would put "10,20" before "5,8" and "9,10".
      expect(canAttendMeetings([[10, 20], [5, 8], [100, 200], [9, 10]])).toBe(true);
    });

    it('numeric sort, not string sort: [[10, 20], [9, 11]] → false', () => {
      expect(canAttendMeetings([[10, 20], [9, 11]])).toBe(false);
    });
  });

  describe('randomized (seeded) against an O(n²) pairwise check', () => {
    it('matches the brute force on 400 random meeting lists', () => {
      const rng = createRng(252);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 8);
        const intervals = [];
        for (let i = 0; i < n; i++) {
          const s = randomInt(rng, 0, 60);
          intervals.push([s, s + randomInt(rng, 1, 8)]);
        }
        const expected = bruteForce(intervals);
        expect(canAttendMeetings(copy(intervals)), JSON.stringify(intervals)).toBe(expected);
      }
    });
  });

  describe('performance', () => {
    it('30,000 back-to-back meetings in shuffled order → true, quickly (checking all pairs is O(n²))', () => {
      const n = 30_000;
      const intervals = shuffle(
        createRng(5),
        Array.from({ length: n }, (_, i) => [i * 20, i * 20 + 20]),
      );
      const { result, ms } = measure(() => canAttendMeetings(intervals));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — sort by start, then compare neighbours`).toBeLessThan(500);
    });
  });
});

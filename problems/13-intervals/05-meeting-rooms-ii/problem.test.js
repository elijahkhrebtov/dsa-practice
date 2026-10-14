import { describe, it, expect } from 'vitest';
import { minMeetingRooms } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Brute force: at every meeting start, count how many meetings are in progress [s, e). */
function bruteForce(intervals) {
  let best = 0;
  for (const [t] of intervals) {
    let active = 0;
    for (const [s, e] of intervals) if (s <= t && t < e) active++;
    best = Math.max(best, active);
  }
  return best;
}

const copy = (intervals) => intervals.map((iv) => [...iv]);

describe('Meeting Rooms II', () => {
  describe('examples from the problem', () => {
    it('[[0, 30], [5, 10], [15, 20]] → 2 (the two short meetings share a room)', () => {
      expect(minMeetingRooms([[0, 30], [5, 10], [15, 20]])).toBe(2);
    });

    it('[[7, 10], [2, 4]] → 1', () => {
      expect(minMeetingRooms([[7, 10], [2, 4]])).toBe(1);
    });

    it('[[1, 5], [5, 10], [10, 15]] → 1 (a room freed at t can be reused at t)', () => {
      expect(minMeetingRooms([[1, 5], [5, 10], [10, 15]])).toBe(1);
    });

    it('[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]] → 4', () => {
      expect(minMeetingRooms([[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]])).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('no meetings → 0', () => {
      expect(minMeetingRooms([])).toBe(0);
    });

    it('a single meeting → 1', () => {
      expect(minMeetingRooms([[4, 9]])).toBe(1);
    });

    it('all meetings identical → n', () => {
      expect(minMeetingRooms([[2, 3], [2, 3], [2, 3], [2, 3]])).toBe(4);
    });

    it('all meetings start at the same time → n', () => {
      expect(minMeetingRooms([[0, 1], [0, 5], [0, 3]])).toBe(3);
    });

    it('all meetings end at the same time → n', () => {
      expect(minMeetingRooms([[1, 9], [5, 9], [8, 9]])).toBe(3);
    });

    it('times at the limits 0 and 10^6', () => {
      expect(minMeetingRooms([[0, 1_000_000], [999_999, 1_000_000], [0, 1]])).toBe(2);
    });
  });

  describe('tricky cases', () => {
    it('back-to-back pairs reuse rooms: [[1, 3], [1, 3], [3, 5], [3, 5]] → 2', () => {
      expect(minMeetingRooms([[1, 3], [1, 3], [3, 5], [3, 5]])).toBe(2);
    });

    it('nested meetings stack up: [[1, 10], [2, 9], [3, 8], [4, 7]] → 4', () => {
      expect(minMeetingRooms([[1, 10], [2, 9], [3, 8], [4, 7]])).toBe(4);
    });

    it('the peak is not at the first start: [[1, 2], [3, 10], [4, 10], [5, 10], [11, 12]] → 3', () => {
      expect(minMeetingRooms([[1, 2], [3, 10], [4, 10], [5, 10], [11, 12]])).toBe(3);
    });

    it('reuse the room that frees EARLIEST, not the one used most recently ([[0, 10], [1, 3], [4, 20], [11, 12]] → 2)', () => {
      expect(minMeetingRooms([[0, 10], [1, 3], [4, 20], [11, 12]])).toBe(2);
    });

    it('[[0, 10], [1, 3], [4, 6], [5, 12]] → 3 (at time 5: [0, 10], [4, 6] and [5, 12])', () => {
      expect(minMeetingRooms([[0, 10], [1, 3], [4, 6], [5, 12]])).toBe(3);
    });

    it('a staircase where each meeting overlaps only the next: [[0, 2], [1, 3], [2, 4], [3, 5]] → 2', () => {
      expect(minMeetingRooms([[0, 2], [1, 3], [2, 4], [3, 5]])).toBe(2);
    });

    it('numeric sort, not string sort: [[10, 20], [9, 10], [2, 11]] → 2', () => {
      expect(minMeetingRooms([[10, 20], [9, 10], [2, 11]])).toBe(2);
    });

    it('rooms must be assigned in START order — processing by end time gives 3 here: [[1, 2], [4, 5], [0, 4], [3, 7]] → 2', () => {
      expect(minMeetingRooms([[1, 2], [4, 5], [0, 4], [3, 7]])).toBe(2);
    });
  });

  describe('randomized (seeded) against an O(n²) brute force', () => {
    it('matches the brute force on 400 random meeting lists', () => {
      const rng = createRng(253);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 25);
        const intervals = [];
        for (let i = 0; i < n; i++) {
          const s = randomInt(rng, 0, 40);
          intervals.push([s, s + randomInt(rng, 1, 12)]);
        }
        const expected = bruteForce(intervals);
        expect(minMeetingRooms(copy(intervals)), JSON.stringify(intervals)).toBe(expected);
      }
    });
  });

  describe('performance', () => {
    it('100,000 shuffled meetings needing ~40,000 rooms finish quickly (scanning the open rooms for a free one is O(n · rooms))', () => {
      const n = 100_000;
      // One meeting starts every time unit and lasts 40,000–40,999 units.
      const intervals = Array.from({ length: n }, (_, i) => [i, i + 40_000 + ((i * 7919) % 1000)]);
      // Expected peak via a difference array over the (small) time range.
      const delta = new Int32Array(n + 41_001);
      for (const [s, e] of intervals) {
        delta[s]++;
        delta[e]--;
      }
      let running = 0;
      let expected = 0;
      for (let t = 0; t < delta.length; t++) expected = Math.max(expected, (running += delta[t]));

      shuffle(createRng(3), intervals);
      const { result, ms } = measure(() => minMeetingRooms(intervals));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — a min-heap of end times or a sorted sweep is O(n log n)`).toBeLessThan(500);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { asteroidCollision } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: find ANY adjacent pair that is about to collide
 * (right-mover immediately followed by a left-mover), resolve it, and repeat
 * until no such pair exists. Slow (O(n²)) but obviously faithful to the rules.
 */
function bruteCollide(input) {
  const a = [...input];
  for (;;) {
    let i = 0;
    while (i + 1 < a.length && !(a[i] > 0 && a[i + 1] < 0)) i++;
    if (i + 1 >= a.length) return a;
    const right = a[i];
    const left = -a[i + 1];
    if (right > left) a.splice(i + 1, 1);
    else if (right < left) a.splice(i, 1);
    else a.splice(i, 2);
  }
}

describe('Asteroid Collision', () => {
  describe('examples from the problem', () => {
    it('[5, 10, -5] → [5, 10] (10 destroys -5)', () => {
      expect(asteroidCollision([5, 10, -5])).toEqual([5, 10]);
    });

    it('[8, -8] → [] (equal sizes destroy each other)', () => {
      expect(asteroidCollision([8, -8])).toEqual([]);
    });

    it('[10, 2, -5] → [10] (-5 destroys 2, then is destroyed by 10)', () => {
      expect(asteroidCollision([10, 2, -5])).toEqual([10]);
    });

    it('[-2, -1, 1, 2] → unchanged (left-movers on the left never meet right-movers)', () => {
      expect(asteroidCollision([-2, -1, 1, 2])).toEqual([-2, -1, 1, 2]);
    });
  });

  describe('edge cases', () => {
    it('two asteroids moving right: [1, 2] → [1, 2]', () => {
      expect(asteroidCollision([1, 2])).toEqual([1, 2]);
    });

    it('two asteroids moving left: [-1, -2] → [-1, -2]', () => {
      expect(asteroidCollision([-1, -2])).toEqual([-1, -2]);
    });

    it('[-5, 5] → [-5, 5] (flying apart is not a collision)', () => {
      expect(asteroidCollision([-5, 5])).toEqual([-5, 5]);
    });

    it('[3, -7] → [-7] (the left-mover wins)', () => {
      expect(asteroidCollision([3, -7])).toEqual([-7]);
    });

    it('[7, -3] → [7] (the right-mover wins)', () => {
      expect(asteroidCollision([7, -3])).toEqual([7]);
    });

    it('sizes at the limits: [1000, -1000, -1, 1] → [-1, 1]', () => {
      expect(asteroidCollision([1000, -1000, -1, 1])).toEqual([-1, 1]);
    });

    it('does not modify the input array', () => {
      const input = [5, 10, -5];
      asteroidCollision(input);
      expect(input).toEqual([5, 10, -5]);
    });
  });

  describe('tricky cases', () => {
    it('one big left-mover destroys a whole chain: [1, 2, 3, 4, -10] → [-10]', () => {
      expect(asteroidCollision([1, 2, 3, 4, -10])).toEqual([-10]);
    });

    it('a left-mover keeps going after winning and is stopped later: [5, 1, 2, -3] → [5]', () => {
      expect(asteroidCollision([5, 1, 2, -3])).toEqual([5]);
    });

    it('after a tie, the next left-mover still has to be processed: [2, 1, -1, -2] → []', () => {
      expect(asteroidCollision([2, 1, -1, -2])).toEqual([]);
    });

    it('a tie stops the left-mover: [1, 2, -2] → [1] (the -2 must not continue)', () => {
      expect(asteroidCollision([1, 2, -2])).toEqual([1]);
    });

    it('a left-mover that survives everything ends up on the left: [-1, 3, 2, -4, 5] → [-1, -4, 5]', () => {
      expect(asteroidCollision([-1, 3, 2, -4, 5])).toEqual([-1, -4, 5]);
    });

    it('several left-movers chip away at one big right-mover: [10, -1, -2, -3] → [10]', () => {
      expect(asteroidCollision([10, -1, -2, -3])).toEqual([10]);
    });

    it('a right-mover appearing after left-movers is safe: [-3, -3, 3, 3] → [-3, -3, 3, 3]', () => {
      expect(asteroidCollision([-3, -3, 3, 3])).toEqual([-3, -3, 3, 3]);
    });

    it('everything explodes: [1, -1, 2, -2, 3, -3] → []', () => {
      expect(asteroidCollision([1, -1, 2, -2, 3, -3])).toEqual([]);
    });

    it('alternating wins: [4, -5, 6, -2, -7, 1] → [-5, -7, 1]', () => {
      expect(asteroidCollision([4, -5, 6, -2, -7, 1])).toEqual([-5, -7, 1]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force "resolve one collision at a time" simulation on 1,000 random rows', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 1000; t++) {
        const n = randomInt(rng, 2, 25);
        const maxSize = randomInt(rng, 1, 6); // small sizes → many ties
        const input = Array.from({ length: n }, () => randomInt(rng, 1, maxSize) * (rng() < 0.5 ? -1 : 1));
        expect(asteroidCollision(input), JSON.stringify(input)).toEqual(bruteCollide(input));
      }
    });
  });

  describe('performance', () => {
    it('100,000 small right-movers wiped out by one huge left-mover (restarting the scan after every collision is O(n²))', () => {
      const n = 100_000;
      const input = [...Array(n).fill(1), -1000];
      const { result, ms } = measure(() => asteroidCollision(input));
      expect(result).toEqual([-1000]);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n): each asteroid is pushed and popped at most once`).toBeLessThan(500);
    });

    it('100,000 asteroids in pairs that cancel out one by one', () => {
      const input = [];
      for (let i = 0; i < 50_000; i++) input.push((i % 1000) + 1, -((i % 1000) + 1));
      const { result, ms } = measure(() => asteroidCollision(input));
      expect(result).toEqual([]);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { MinStack } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

describe('Min Stack', () => {
  describe('example from the problem', () => {
    it('push -2, 0, -3 → getMin -3; pop → top 0, getMin -2', () => {
      const s = new MinStack();
      s.push(-2);
      s.push(0);
      s.push(-3);
      expect(s.getMin()).toBe(-3);
      s.pop();
      expect(s.top()).toBe(0);
      expect(s.getMin()).toBe(-2);
    });
  });

  describe('basic behaviour', () => {
    it('a single element is both the top and the minimum', () => {
      const s = new MinStack();
      s.push(5);
      expect(s.top()).toBe(5);
      expect(s.getMin()).toBe(5);
    });

    it('top() returns the last pushed value (LIFO), not the smallest', () => {
      const s = new MinStack();
      s.push(1);
      s.push(10);
      expect(s.top()).toBe(10);
      expect(s.getMin()).toBe(1);
    });

    it('top() and getMin() do not remove anything', () => {
      const s = new MinStack();
      s.push(3);
      s.push(2);
      expect(s.top()).toBe(2);
      expect(s.top()).toBe(2);
      expect(s.getMin()).toBe(2);
      expect(s.getMin()).toBe(2);
      s.pop();
      expect(s.top()).toBe(3);
    });

    it('instances are independent of each other', () => {
      const a = new MinStack();
      const b = new MinStack();
      a.push(1);
      b.push(100);
      expect(a.getMin()).toBe(1);
      expect(b.getMin()).toBe(100);
    });
  });

  describe('the minimum must be restored after pops', () => {
    it('decreasing pushes: each pop reveals the previous minimum', () => {
      const s = new MinStack();
      [5, 4, 3, 2, 1].forEach((v) => s.push(v));
      expect(s.getMin()).toBe(1);
      s.pop();
      expect(s.getMin()).toBe(2);
      s.pop();
      expect(s.getMin()).toBe(3);
      s.pop();
      expect(s.getMin()).toBe(4);
    });

    it('increasing pushes: the minimum stays at the bottom until the end', () => {
      const s = new MinStack();
      [1, 2, 3, 4, 5].forEach((v) => s.push(v));
      for (let i = 0; i < 4; i++) {
        expect(s.getMin()).toBe(1);
        s.pop();
      }
      expect(s.getMin()).toBe(1);
      expect(s.top()).toBe(1);
    });

    it('duplicate minimums: popping one copy keeps the other as the minimum', () => {
      // Classic bug: tracking only "a minimum" and forgetting there were two of them.
      const s = new MinStack();
      s.push(2);
      s.push(0);
      s.push(3);
      s.push(0);
      expect(s.getMin()).toBe(0);
      s.pop();
      expect(s.getMin()).toBe(0);
      s.pop();
      expect(s.getMin()).toBe(0);
      s.pop();
      expect(s.getMin()).toBe(2);
    });

    it('works again after being emptied completely', () => {
      const s = new MinStack();
      s.push(-1);
      s.pop();
      s.push(7);
      expect(s.getMin()).toBe(7);
      expect(s.top()).toBe(7);
    });
  });

  describe('value ranges', () => {
    it('handles negative numbers and zero', () => {
      const s = new MinStack();
      s.push(0);
      s.push(-5);
      s.push(-5);
      s.push(3);
      expect(s.getMin()).toBe(-5);
    });

    it('handles the 32-bit extremes', () => {
      const s = new MinStack();
      s.push(2 ** 31 - 1);
      expect(s.getMin()).toBe(2 ** 31 - 1);
      s.push(-(2 ** 31));
      expect(s.getMin()).toBe(-(2 ** 31));
      s.pop();
      expect(s.getMin()).toBe(2 ** 31 - 1);
    });
  });

  describe('randomized against a simple model (seeded)', () => {
    it('matches a brute-force stack over 5,000 random operations', () => {
      const rng = createRng(7);
      const s = new MinStack();
      const model = [];
      for (let step = 0; step < 5000; step++) {
        const op = model.length === 0 ? 0 : randomInt(rng, 0, 3);
        if (op === 0) {
          const v = randomInt(rng, -50, 50);
          s.push(v);
          model.push(v);
        } else if (op === 1) {
          s.pop();
          model.pop();
        } else if (op === 2) {
          expect(s.top()).toBe(model[model.length - 1]);
        } else {
          expect(s.getMin()).toBe(Math.min(...model));
        }
      }
    });
  });

  describe('performance', () => {
    it('300,000 operations with getMin() after every push stay fast (O(1) each, no scanning)', () => {
      const s = new MinStack();
      const n = 100_000;
      const { ms } = measure(() => {
        for (let i = 0; i < n; i++) {
          s.push(n - i);
          s.getMin();
        }
        for (let i = 0; i < n; i++) s.getMin();
      });
      expect(s.getMin()).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — getMin should not loop over the stack`).toBeLessThan(500);
    });
  });
});

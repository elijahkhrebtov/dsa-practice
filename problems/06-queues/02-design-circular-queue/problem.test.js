import { describe, it, expect } from 'vitest';
import { MyCircularQueue } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Runs `fn` while Array.prototype.shift / unshift / splice throw — a ring
 * buffer never needs to move elements.
 */
function noShifting(fn) {
  const proto = Array.prototype;
  const saved = { shift: proto.shift, unshift: proto.unshift, splice: proto.splice };
  const forbid = (name) =>
    function () {
      throw new Error(`Array.prototype.${name} moves elements. A ring buffer should only move indices.`);
    };
  proto.shift = forbid('shift');
  proto.unshift = forbid('unshift');
  proto.splice = forbid('splice');
  try {
    return fn();
  } finally {
    proto.shift = saved.shift;
    proto.unshift = saved.unshift;
    proto.splice = saved.splice;
  }
}

const METHODS = ['enQueue', 'deQueue', 'Front', 'Rear', 'isEmpty', 'isFull'];

/** Creates a queue whose every method call runs under `noShifting`. */
function makeQueue(k) {
  const q = noShifting(() => new MyCircularQueue(k));
  const wrapped = {};
  for (const m of METHODS) wrapped[m] = (...args) => noShifting(() => q[m](...args));
  return wrapped;
}

describe('Design Circular Queue', () => {
  describe('examples from the problem', () => {
    it('k = 3: fill, reject the 4th, dequeue, then the freed slot is reused', () => {
      const q = makeQueue(3);
      expect(q.enQueue(1)).toBe(true);
      expect(q.enQueue(2)).toBe(true);
      expect(q.enQueue(3)).toBe(true);
      expect(q.enQueue(4)).toBe(false);
      expect(q.Rear()).toBe(3);
      expect(q.isFull()).toBe(true);
      expect(q.deQueue()).toBe(true);
      expect(q.enQueue(4)).toBe(true);
      expect(q.Rear()).toBe(4);
      expect(q.Front()).toBe(2);
    });

    it('k = 2, empty queue: Front → -1, deQueue → false', () => {
      const q = makeQueue(2);
      expect(q.Front()).toBe(-1);
      expect(q.deQueue()).toBe(false);
    });
  });

  describe('empty and full states', () => {
    it('a new queue is empty and not full; Front and Rear are -1', () => {
      const q = makeQueue(4);
      expect(q.isEmpty()).toBe(true);
      expect(q.isFull()).toBe(false);
      expect(q.Front()).toBe(-1);
      expect(q.Rear()).toBe(-1);
    });

    it('k = 1: one element makes it both full and non-empty, and Front === Rear', () => {
      const q = makeQueue(1);
      expect(q.enQueue(9)).toBe(true);
      expect(q.isFull()).toBe(true);
      expect(q.isEmpty()).toBe(false);
      expect(q.Front()).toBe(9);
      expect(q.Rear()).toBe(9);
      expect(q.enQueue(10)).toBe(false);
      expect(q.deQueue()).toBe(true);
      expect(q.isEmpty()).toBe(true);
      expect(q.Rear()).toBe(-1);
    });

    it('k = 1 can be refilled over and over', () => {
      const q = makeQueue(1);
      for (let v = 0; v < 5; v++) {
        expect(q.enQueue(v)).toBe(true);
        expect(q.Front()).toBe(v);
        expect(q.deQueue()).toBe(true);
      }
      expect(q.isEmpty()).toBe(true);
    });

    it('a rejected enQueue on a full queue changes nothing (Front, Rear, order all intact)', () => {
      const q = makeQueue(2);
      q.enQueue(5);
      q.enQueue(6);
      expect(q.enQueue(7)).toBe(false);
      expect(q.enQueue(8)).toBe(false);
      expect(q.Front()).toBe(5);
      expect(q.Rear()).toBe(6);
      q.deQueue();
      expect(q.Front()).toBe(6);
    });

    it('deQueue on an empty queue returns false and the queue still works afterwards', () => {
      const q = makeQueue(2);
      expect(q.deQueue()).toBe(false);
      expect(q.deQueue()).toBe(false);
      expect(q.enQueue(1)).toBe(true);
      expect(q.Front()).toBe(1);
      expect(q.Rear()).toBe(1);
    });

    it('emptying a full queue completely makes it empty again (full vs empty must not be confused)', () => {
      const q = makeQueue(3);
      [1, 2, 3].forEach((v) => q.enQueue(v));
      q.deQueue();
      q.deQueue();
      q.deQueue();
      expect(q.isEmpty()).toBe(true);
      expect(q.isFull()).toBe(false);
      expect(q.Front()).toBe(-1);
      expect(q.Rear()).toBe(-1);
    });

    it('methods return real booleans, not truthy/falsy values', () => {
      const q = makeQueue(1);
      expect(q.isEmpty()).toBe(true);
      expect(q.isFull()).toBe(false);
      expect(q.enQueue(0)).toBe(true);
      expect(q.enQueue(0)).toBe(false);
      expect(q.deQueue()).toBe(true);
      expect(q.deQueue()).toBe(false);
    });
  });

  describe('wrap-around (tricky cases)', () => {
    it('Rear is correct right after the rear index wraps to slot 0', () => {
      // k = 3: fill slots 0..2, free slot 0, write 4 into slot 0. Rear must be 4, not data[-1].
      const q = makeQueue(3);
      [1, 2, 3].forEach((v) => q.enQueue(v));
      q.deQueue();
      q.enQueue(4);
      expect(q.Rear()).toBe(4);
      expect(q.Front()).toBe(2);
    });

    it('Front is correct after the front index wraps past the end', () => {
      const q = makeQueue(3);
      [1, 2, 3].forEach((v) => q.enQueue(v));
      q.deQueue();
      q.deQueue();
      q.enQueue(4);
      q.enQueue(5);
      q.deQueue(); // removes 3, the front moves from slot 2 to slot 0
      expect(q.Front()).toBe(4);
      expect(q.Rear()).toBe(5);
      expect(q.isFull()).toBe(false);
    });

    it('the queue cycles through its storage many times and keeps FIFO order', () => {
      const q = makeQueue(4);
      let next = 0;
      let expected = 0;
      for (let i = 0; i < 3; i++) q.enQueue(next++);
      for (let round = 0; round < 50; round++) {
        expect(q.enQueue(next++)).toBe(true);
        expect(q.isFull()).toBe(true);
        expect(q.Front()).toBe(expected);
        expect(q.Rear()).toBe(next - 1);
        expect(q.deQueue()).toBe(true);
        expected++;
      }
    });

    it('0 is a valid element: Front/Rear return 0, not -1, and the queue is not "empty"', () => {
      const q = makeQueue(2);
      q.enQueue(0);
      expect(q.Front()).toBe(0);
      expect(q.Rear()).toBe(0);
      expect(q.isEmpty()).toBe(false);
    });

    it('full again after wrapping: isFull is true with the elements spread across the seam', () => {
      const q = makeQueue(3);
      [1, 2, 3].forEach((v) => q.enQueue(v));
      q.deQueue();
      q.deQueue();
      expect(q.enQueue(4)).toBe(true);
      expect(q.enQueue(5)).toBe(true);
      expect(q.isFull()).toBe(true);
      expect(q.enQueue(6)).toBe(false);
      expect([q.Front(), q.Rear()]).toEqual([3, 5]);
    });

    it('instances are independent of each other', () => {
      const a = makeQueue(1);
      const b = makeQueue(2);
      a.enQueue(1);
      expect(b.isEmpty()).toBe(true);
      expect(b.enQueue(2)).toBe(true);
      expect(b.enQueue(3)).toBe(true);
      expect(a.Front()).toBe(1);
      expect(b.Rear()).toBe(3);
    });
  });

  describe('randomized against a simple model (seeded)', () => {
    for (const k of [1, 2, 3, 7, 50]) {
      it(`matches an unbounded-array model over 3,000 random operations with k = ${k}`, () => {
        const rng = createRng(100 + k);
        const model = [];
        let head = 0;
        const expected = [];
        const actual = noShifting(() => {
          const q = new MyCircularQueue(k);
          const out = [];
          for (let step = 0; step < 3000; step++) {
            const size = model.length - head;
            const op = randomInt(rng, 0, 5);
            if (op === 0 || op === 1) {
              // bias towards enQueue so the queue regularly fills up
              const v = randomInt(rng, 0, 1000);
              out.push(q.enQueue(v));
              if (size < k) {
                model.push(v);
                expected.push(true);
              } else expected.push(false);
            } else if (op === 2) {
              out.push(q.deQueue());
              expected.push(size > 0);
              if (size > 0) head++;
            } else if (op === 3) {
              out.push([q.Front(), q.Rear()]);
              expected.push(size === 0 ? [-1, -1] : [model[head], model[model.length - 1]]);
            } else if (op === 4) {
              out.push(q.isEmpty());
              expected.push(size === 0);
            } else {
              out.push(q.isFull());
              expected.push(size === k);
            }
          }
          return out;
        });
        expect(actual).toEqual(expected);
      });
    }
  });

  describe('performance', () => {
    it('300,000 operations with k = 1,000 finish quickly (each operation is O(1))', () => {
      const k = 1000;
      const { result, ms } = measure(() =>
        noShifting(() => {
          const q = new MyCircularQueue(k);
          let sum = 0;
          for (let i = 0; i < 100_000; i++) {
            if (q.isFull()) q.deQueue();
            q.enQueue(i % 1001);
            sum += q.Front();
          }
          return sum;
        }),
      );
      // Same sequence on a head-index model: Front is always the value enqueued k-1 steps earlier.
      let expectedSum = 0;
      for (let i = 0; i < 100_000; i++) expectedSum += Math.max(0, i - (k - 1)) % 1001;
      expect(result).toBe(expectedSum);
      expect(ms, `took ${ms.toFixed(0)}ms — every method should be a few arithmetic operations`).toBeLessThan(500);
    });
  });
});

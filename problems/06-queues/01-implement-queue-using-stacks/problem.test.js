import { describe, it, expect } from 'vitest';
import { MyQueue } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Runs `fn` while Array.prototype.shift / unshift / splice throw, so a queue
 * that secretly reads from the front of an array is caught.
 */
function onlyStackOps(fn) {
  const proto = Array.prototype;
  const saved = { shift: proto.shift, unshift: proto.unshift, splice: proto.splice };
  const forbid = (name) =>
    function () {
      throw new Error(`Array.prototype.${name} is not a stack operation. Use only push/pop/length.`);
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

/** Creates a queue whose every method call runs under `onlyStackOps`. */
function makeQueue() {
  const q = onlyStackOps(() => new MyQueue());
  return {
    push: (x) => onlyStackOps(() => q.push(x)),
    pop: () => onlyStackOps(() => q.pop()),
    peek: () => onlyStackOps(() => q.peek()),
    empty: () => onlyStackOps(() => q.empty()),
  };
}

describe('Implement Queue using Stacks', () => {
  describe('example from the problem', () => {
    it('push 1, push 2 → peek 1, pop 1, empty false, pop 2, empty true', () => {
      const q = makeQueue();
      q.push(1);
      q.push(2);
      expect(q.peek()).toBe(1);
      expect(q.pop()).toBe(1);
      expect(q.empty()).toBe(false);
      expect(q.pop()).toBe(2);
      expect(q.empty()).toBe(true);
    });

    it('push 1, push 2, pop → 1, push 3, pop → 2, pop → 3 (later pushes still come out later)', () => {
      const q = makeQueue();
      q.push(1);
      q.push(2);
      expect(q.pop()).toBe(1);
      q.push(3);
      expect(q.pop()).toBe(2);
      expect(q.pop()).toBe(3);
    });
  });

  describe('basic behaviour', () => {
    it('a new queue is empty', () => {
      expect(makeQueue().empty()).toBe(true);
    });

    it('empty() returns real booleans, not truthy/falsy values', () => {
      const q = makeQueue();
      expect(q.empty()).toBe(true);
      q.push(5);
      expect(q.empty()).toBe(false);
    });

    it('a single element is the front: peek and pop both return it', () => {
      const q = makeQueue();
      q.push(42);
      expect(q.peek()).toBe(42);
      expect(q.pop()).toBe(42);
      expect(q.empty()).toBe(true);
    });

    it('FIFO, not LIFO: push 1, 2, 3 → pops return 1, 2, 3', () => {
      const q = makeQueue();
      [1, 2, 3].forEach((x) => q.push(x));
      expect([q.pop(), q.pop(), q.pop()]).toEqual([1, 2, 3]);
    });

    it('peek() does not remove anything, even when called repeatedly', () => {
      const q = makeQueue();
      q.push(7);
      q.push(8);
      expect(q.peek()).toBe(7);
      expect(q.peek()).toBe(7);
      expect(q.peek()).toBe(7);
      expect(q.pop()).toBe(7);
      expect(q.peek()).toBe(8);
    });

    it('instances are independent of each other', () => {
      const a = makeQueue();
      const b = makeQueue();
      a.push(1);
      b.push(100);
      b.push(200);
      expect(a.pop()).toBe(1);
      expect(a.empty()).toBe(true);
      expect(b.pop()).toBe(100);
    });
  });

  describe('tricky cases', () => {
    it('pushing after a pop while the outgoing side is non-empty keeps the order', () => {
      // A classic bug: pouring new elements on top of old ones that are still waiting.
      const q = makeQueue();
      q.push(1);
      q.push(2);
      q.push(3);
      expect(q.pop()).toBe(1); // 2 and 3 are now waiting
      q.push(4);
      q.push(5);
      expect([q.pop(), q.pop(), q.pop(), q.pop()]).toEqual([2, 3, 4, 5]);
    });

    it('peek right after a push into a non-empty queue still shows the OLDEST element', () => {
      const q = makeQueue();
      q.push(10);
      expect(q.peek()).toBe(10);
      q.push(20);
      expect(q.peek()).toBe(10);
    });

    it('peek as the very first read (before any pop) returns the first pushed element', () => {
      const q = makeQueue();
      [9, 8, 7].forEach((x) => q.push(x));
      expect(q.peek()).toBe(9);
    });

    it('empty() is false when elements sit only on the "incoming" side', () => {
      const q = makeQueue();
      q.push(1);
      q.push(2);
      expect(q.pop()).toBe(1);
      expect(q.pop()).toBe(2);
      q.push(3);
      expect(q.empty()).toBe(false);
    });

    it('empty() is false when elements sit only on the "outgoing" side', () => {
      const q = makeQueue();
      q.push(1);
      q.push(2);
      q.peek(); // a typical implementation has moved everything to the outgoing side now
      expect(q.empty()).toBe(false);
    });

    it('can be drained and reused many times', () => {
      const q = makeQueue();
      for (let round = 0; round < 5; round++) {
        for (let i = 0; i < 4; i++) q.push(round * 10 + i);
        for (let i = 0; i < 4; i++) expect(q.pop()).toBe(round * 10 + i);
        expect(q.empty()).toBe(true);
      }
    });

    it('duplicate values come out the right number of times', () => {
      const q = makeQueue();
      [5, 5, 3, 5].forEach((x) => q.push(x));
      expect([q.pop(), q.pop(), q.pop(), q.pop()]).toEqual([5, 5, 3, 5]);
      expect(q.empty()).toBe(true);
    });

    it('handles values up to 10^9', () => {
      const q = makeQueue();
      q.push(1_000_000_000);
      q.push(1);
      expect(q.pop()).toBe(1_000_000_000);
      expect(q.peek()).toBe(1);
    });
  });

  describe('randomized against a simple model (seeded)', () => {
    it('matches an array-based model over 5,000 random operations', () => {
      const rng = createRng(2024);
      const model = [];
      let head = 0; // the model may use a head index — your queue may not
      const expected = [];
      const actual = onlyStackOps(() => {
        const q = new MyQueue();
        const out = [];
        for (let step = 0; step < 5000; step++) {
          const size = model.length - head;
          const op = size === 0 ? randomInt(rng, 0, 1) * 3 : randomInt(rng, 0, 3);
          if (op === 0) {
            const x = randomInt(rng, 1, 1000);
            q.push(x);
            model.push(x);
          } else if (op === 1) {
            out.push(q.pop());
            expected.push(model[head++]);
          } else if (op === 2) {
            out.push(q.peek());
            expected.push(model[head]);
          } else {
            out.push(q.empty());
            expected.push(model.length - head === 0);
          }
        }
        return out;
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('performance', () => {
    it('~100,000 interleaved operations on a 5,000-element queue stay fast (pouring everything back and forth on each pop is O(n) per call)', () => {
      const W = 5000;
      const cycles = 33_334;
      const { result, ms } = measure(() =>
        onlyStackOps(() => {
          const q = new MyQueue();
          for (let i = 0; i < W; i++) q.push(i);
          let next = W;
          let expected = 0;
          let mistakes = 0;
          for (let c = 0; c < cycles; c++) {
            q.push(next++);
            if (q.peek() !== expected) mistakes++;
            if (q.pop() !== expected) mistakes++;
            expected++;
          }
          return mistakes;
        }),
      );
      expect(result, 'peek/pop returned elements out of FIFO order').toBe(0);
      expect(ms, `took ${ms.toFixed(0)}ms — move elements between stacks only when the output stack is empty`).toBeLessThan(500);
    });
  });
});

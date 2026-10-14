import { describe, it, expect } from 'vitest';
import { MinHeap } from './problem.js';
import { createRng, randomInt, randomIntArray, shuffle, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

// Every call into MinHeap runs with Array.prototype.sort switched off, so the
// heap has to order things itself. Assertions stay OUTSIDE the wrapper.
const noSort = withoutBuiltinSort;

/** Pops until the heap reports size 0 (bounded so a broken size() can't loop forever). */
function drain(heap, limit = 2_000_000) {
  const out = [];
  while (heap.size() > 0 && out.length < limit) out.push(heap.pop());
  return out;
}

const ascending = (arr) => [...arr].sort((a, b) => a - b);

describe('Implement a Min Heap', () => {
  describe('examples from the problem', () => {
    it('push 5, 1, 3 → peek 1, pop 1, pop 3, size 1', () => {
      const seen = noSort(() => {
        const h = new MinHeap();
        h.push(5);
        h.push(1);
        h.push(3);
        return [h.peek(), h.pop(), h.pop(), h.size()];
      });
      expect(seen).toEqual([1, 1, 3, 1]);
    });

    it('new MinHeap([9, 4, 7, 1, 8]) → pop 1, pop 4, push 2, pop 2, pop 7', () => {
      const seen = noSort(() => {
        const h = new MinHeap([9, 4, 7, 1, 8]);
        const a = h.pop();
        const b = h.pop();
        h.push(2);
        return [a, b, h.pop(), h.pop()];
      });
      expect(seen).toEqual([1, 4, 2, 7]);
    });

    it('an empty heap: pop() and peek() return undefined, size() is 0', () => {
      const seen = noSort(() => {
        const h = new MinHeap();
        return [h.pop(), h.peek(), h.size()];
      });
      expect(seen).toEqual([undefined, undefined, 0]);
    });
  });

  describe('basic behaviour', () => {
    it('new MinHeap() with no argument starts empty', () => {
      expect(noSort(() => new MinHeap().size())).toBe(0);
    });

    it('new MinHeap([]) starts empty', () => {
      expect(noSort(() => new MinHeap([]).size())).toBe(0);
    });

    it('peek() does not remove anything: calling it twice gives the same value and size', () => {
      const seen = noSort(() => {
        const h = new MinHeap([4, 2, 6]);
        return [h.peek(), h.peek(), h.size()];
      });
      expect(seen).toEqual([2, 2, 3]);
    });

    it('size() goes up with every push and down with every pop', () => {
      const sizes = noSort(() => {
        const h = new MinHeap([10]);
        const s = [h.size()];
        h.push(3);
        s.push(h.size());
        h.push(7);
        s.push(h.size());
        h.pop();
        s.push(h.size());
        h.pop();
        h.pop();
        s.push(h.size());
        return s;
      });
      expect(sizes).toEqual([1, 2, 3, 2, 0]);
    });

    it('popping past empty keeps returning undefined and size() stays 0 (never negative)', () => {
      const seen = noSort(() => {
        const h = new MinHeap([1]);
        return [h.pop(), h.pop(), h.pop(), h.size(), h.peek()];
      });
      expect(seen).toEqual([1, undefined, undefined, 0, undefined]);
    });

    it('works again after being emptied completely', () => {
      const seen = noSort(() => {
        const h = new MinHeap([2, 1]);
        drain(h);
        h.push(8);
        h.push(6);
        return [h.size(), h.pop(), h.pop(), h.pop()];
      });
      expect(seen).toEqual([2, 6, 8, undefined]);
    });

    it('instances are independent of each other', () => {
      const seen = noSort(() => {
        const a = new MinHeap();
        const b = new MinHeap();
        a.push(1);
        b.push(100);
        return [a.peek(), b.peek(), a.size(), b.size()];
      });
      expect(seen).toEqual([1, 100, 1, 1]);
    });

    it('the constructor does not modify the array you pass in (copy it before heapifying)', () => {
      const input = [5, 3, 8, 1, 9, 2];
      const seen = noSort(() => {
        const h = new MinHeap(input);
        h.push(0);
        return drain(h);
      });
      expect(seen).toEqual([0, 1, 2, 3, 5, 8, 9]);
      expect(input, 'the original array must be left untouched').toEqual([5, 3, 8, 1, 9, 2]);
    });
  });

  describe('ordering', () => {
    it('ascending pushes 1..10 pop back out as 1..10', () => {
      const out = noSort(() => {
        const h = new MinHeap();
        for (let i = 1; i <= 10; i++) h.push(i);
        return drain(h);
      });
      expect(out).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('descending pushes 10..1 pop out as 1..10 (every push must sift all the way to the root)', () => {
      const out = noSort(() => {
        const h = new MinHeap();
        for (let i = 10; i >= 1; i--) h.push(i);
        return drain(h);
      });
      expect(out).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('duplicates are kept: [3, 1, 3, 1, 2, 1] → 1, 1, 1, 2, 3, 3', () => {
      expect(noSort(() => drain(new MinHeap([3, 1, 3, 1, 2, 1])))).toEqual([1, 1, 1, 2, 3, 3]);
    });

    it('all values equal: 50 sevens come back as 50 sevens', () => {
      const out = noSort(() => {
        const h = new MinHeap(new Array(25).fill(7));
        for (let i = 0; i < 25; i++) h.push(7);
        return drain(h);
      });
      expect(out).toEqual(new Array(50).fill(7));
    });

    it('negatives and zero: [0, -5, 3, -1, -5] → -5, -5, -1, 0, 3', () => {
      expect(noSort(() => drain(new MinHeap([0, -5, 3, -1, -5])))).toEqual([-5, -5, -1, 0, 3]);
    });

    it('floats and large magnitudes: [1e9, -1e9, 0.5, -0.25, 3.75]', () => {
      expect(noSort(() => drain(new MinHeap([1e9, -1e9, 0.5, -0.25, 3.75])))).toEqual([-1e9, -0.25, 0.5, 3.75, 1e9]);
    });

    it('interleaved pushes and pops: a new minimum can arrive at any time', () => {
      const seen = noSort(() => {
        const h = new MinHeap();
        const out = [];
        h.push(5);
        h.push(3);
        out.push(h.pop()); // 3
        h.push(4);
        h.push(1);
        out.push(h.pop()); // 1
        out.push(h.peek()); // 4
        h.push(2);
        out.push(h.pop(), h.pop(), h.pop(), h.pop()); // 2, 4, 5, undefined
        return out;
      });
      expect(seen).toEqual([3, 1, 4, 2, 4, 5, undefined]);
    });
  });

  describe('tricky cases', () => {
    it('0 is a real value, not "empty": [0, 5] → peek 0, pop 0 (beware truthiness checks)', () => {
      const seen = noSort(() => {
        const h = new MinHeap([5, 0]);
        return [h.peek(), h.pop(), h.pop(), h.pop()];
      });
      expect(seen).toEqual([0, 0, 5, undefined]);
    });

    it('sift-down must swap with the SMALLER child: [1, 5, 2] → pop 1, then peek 2', () => {
      // After removing 1, the root's children are 5 (left) and 2 (right).
      // Always swapping with the left child would put 5 on top.
      const seen = noSort(() => {
        const h = new MinHeap();
        h.push(1);
        h.push(5);
        h.push(2);
        return [h.pop(), h.peek(), h.pop(), h.pop()];
      });
      expect(seen).toEqual([1, 2, 2, 5]);
    });

    it('sift-down must handle a parent with only a LEFT child (even-sized heaps)', () => {
      // With 6 elements, index 2 has a left child (5) but no right child (6).
      // Reading heap[right] past the end gives undefined — comparisons with it are always false.
      const out = noSort(() => drain(new MinHeap([1, 2, 3, 4, 5, 6])));
      expect(out).toEqual([1, 2, 3, 4, 5, 6]);
      const out2 = noSort(() => drain(new MinHeap([6, 5, 4, 3, 2, 1, 0, -1])));
      expect(out2).toEqual([-1, 0, 1, 2, 3, 4, 5, 6]);
    });

    it('sift-down must keep going until the value settles, not stop after one swap', () => {
      // Removing 1 moves 100 to the root; it has to sink three levels.
      const seen = noSort(() => {
        const h = new MinHeap([1, 2, 50, 3, 60, 70, 80, 4, 90, 95, 99, 98, 97, 96, 100]);
        return [h.pop(), h.pop(), h.pop(), h.pop(), h.pop(), h.size()];
      });
      expect(seen).toEqual([1, 2, 3, 4, 50, 10]);
    });

    it('heapify handles reverse-sorted input, where every non-leaf has to sink', () => {
      const input = Array.from({ length: 31 }, (_, i) => 31 - i);
      expect(noSort(() => drain(new MinHeap(input)))).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
    });

    it('a single-element constructor array: peek and pop return it', () => {
      const seen = noSort(() => {
        const h = new MinHeap([42]);
        return [h.size(), h.peek(), h.pop(), h.size()];
      });
      expect(seen).toEqual([1, 42, 42, 0]);
    });

    it('values pushed after heapify mix correctly with the heapified ones', () => {
      const seen = noSort(() => {
        const h = new MinHeap([10, 30, 20]);
        h.push(25);
        h.push(5);
        h.push(15);
        return drain(h);
      });
      expect(seen).toEqual([5, 10, 15, 20, 25, 30]);
    });

    it('heap sort: pushing a shuffled 0..999 and popping everything gives 0..999 in order', () => {
      const values = shuffle(createRng(3), Array.from({ length: 1000 }, (_, i) => i));
      const out = noSort(() => {
        const h = new MinHeap();
        for (const v of values) h.push(v);
        return drain(h);
      });
      expect(out).toEqual(Array.from({ length: 1000 }, (_, i) => i));
    });
  });

  describe('randomized (seeded) against a sorted-array model', () => {
    it('200 random constructor arrays (length 0–60, many duplicates) drain in ascending order', () => {
      const rng = createRng(11);
      for (let t = 0; t < 200; t++) {
        const arr = randomIntArray(rng, randomInt(rng, 0, 60), -20, 20);
        const out = noSort(() => drain(new MinHeap(arr)));
        expect(out).toEqual(ascending(arr));
      }
    });

    it('matches a sorted-array model over 20,000 random push / pop / peek / size calls', () => {
      const rng = createRng(2024);
      const initial = randomIntArray(rng, 30, -100, 100);
      const h = noSort(() => new MinHeap(initial));
      const model = ascending(initial); // kept sorted ascending; model[0] is the minimum
      for (let step = 0; step < 20_000; step++) {
        const op = randomInt(rng, 0, 9);
        if (op <= 3) {
          const v = randomInt(rng, -100, 100);
          noSort(() => h.push(v));
          let i = 0;
          while (i < model.length && model[i] < v) i++;
          model.splice(i, 0, v);
        } else if (op <= 7) {
          expect(noSort(() => h.pop()), `step ${step}: pop`).toBe(model.shift());
        } else if (op === 8) {
          expect(noSort(() => h.peek()), `step ${step}: peek`).toBe(model[0]);
        } else {
          expect(noSort(() => h.size()), `step ${step}: size`).toBe(model.length);
        }
      }
    });
  });

  describe('performance', () => {
    it('100,000 random pushes then 100,000 pops (scanning the array on every pop is O(n²) overall)', () => {
      const values = randomIntArray(createRng(99), 100_000, -1_000_000, 1_000_000);
      const expected = ascending(values);
      const { result, ms } = measure(() =>
        noSort(() => {
          const h = new MinHeap();
          for (const v of values) h.push(v);
          const out = new Array(values.length);
          for (let i = 0; i < values.length; i++) out[i] = h.pop();
          return out;
        }),
      );
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — push and pop should be O(log n)`).toBeLessThan(500);
    });

    it('100,000 push+pop pairs on a heap holding 20,000 values (each operation must be O(log n), not O(n))', () => {
      const rng = createRng(5);
      const initial = randomIntArray(rng, 20_000, 0, 1_000_000);
      const incoming = randomIntArray(rng, 100_000, 0, 1_000_000);
      const { result, ms } = measure(() =>
        noSort(() => {
          const h = new MinHeap(initial);
          let checksum = 0;
          for (const v of incoming) {
            h.push(v);
            checksum = (checksum + h.pop()) % 1_000_000_007;
          }
          return [checksum, h.size()];
        }),
      );
      // Reference checksum computed with a simple, obviously-correct approach.
      const model = ascending(initial);
      let checksum = 0;
      for (const v of incoming) {
        // push v then pop the minimum: if v is <= current min, v pops right back out.
        if (v <= model[0]) {
          checksum = (checksum + v) % 1_000_000_007;
        } else {
          checksum = (checksum + model[0]) % 1_000_000_007;
          let lo = 1;
          let hi = model.length;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (model[mid] < v) lo = mid + 1;
            else hi = mid;
          }
          model.splice(0, 1); // drop the old minimum
          model.splice(lo - 1, 0, v);
        }
      }
      expect(result).toEqual([checksum, 20_000]);
      expect(ms, `took ${ms.toFixed(0)}ms — no linear scans per operation`).toBeLessThan(500);
    });

    it('the constructor heapifies 1,000,000 values quickly (bottom-up heapify is O(n))', () => {
      const values = randomIntArray(createRng(77), 1_000_000, -1_000_000_000, 1_000_000_000);
      const expected = ascending(values).slice(0, 1000);
      const { result, ms } = measure(() =>
        noSort(() => {
          const h = new MinHeap(values);
          const out = [h.size()];
          for (let i = 0; i < 1000; i++) out.push(h.pop());
          return out;
        }),
      );
      expect(result).toEqual([1_000_000, ...expected]);
      expect(ms, `took ${ms.toFixed(0)}ms — build the heap in place in one pass, no sorting`).toBeLessThan(1000);
    });
  });
});

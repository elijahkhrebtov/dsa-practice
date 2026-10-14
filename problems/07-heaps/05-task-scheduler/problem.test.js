import { describe, it, expect } from 'vitest';
import { leastInterval } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const repeat = (label, times) => new Array(times).fill(label);

/**
 * Exhaustive brute force (tiny inputs only): breadth-first search over CPU
 * states. A state is the multiset of (remaining count, cooldown left) per
 * label. Each time unit you either idle or run any label that is off cooldown.
 */
function bruteLeastInterval(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) ?? 0) + 1);
  const start = [...counts.values()].map((c) => [c, 0]);
  const key = (s) =>
    s
      .filter(([c]) => c > 0)
      .map(([c, cd]) => `${c}:${cd}`)
      .sort()
      .join(',');
  let frontier = [start];
  const seen = new Set([key(start)]);
  for (let time = 0; ; time++) {
    const next = [];
    for (const s of frontier) {
      if (s.every(([c]) => c === 0)) return time;
      const tick = (state) => state.map(([c, cd]) => [c, Math.max(0, cd - 1)]);
      const options = [tick(s)]; // idle
      s.forEach(([c, cd], i) => {
        if (c > 0 && cd === 0) {
          const ran = s.map((p, j) => (j === i ? [p[0] - 1, n + 1] : p));
          options.push(tick(ran));
        }
      });
      for (const o of options) {
        const k = key(o);
        if (!seen.has(k)) {
          seen.add(k);
          next.push(o);
        }
      }
    }
    frontier = next;
  }
}

describe('Task Scheduler', () => {
  describe('examples from the problem', () => {
    it("['A','A','A','B','B','B'], n=2 → 8 (A B idle A B idle A B)", () => {
      expect(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2)).toBe(8);
    });

    it("['A','C','A','B','D','B'], n=1 → 6 (enough variety, no idling)", () => {
      expect(leastInterval(['A', 'C', 'A', 'B', 'D', 'B'], 1)).toBe(6);
    });

    it("['A','A','A','B','B','B'], n=3 → 10", () => {
      expect(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 3)).toBe(10);
    });

    it("['A','A','A'], n=0 → 3 (no cooldown)", () => {
      expect(leastInterval(['A', 'A', 'A'], 0)).toBe(3);
    });
  });

  describe('edge cases', () => {
    it("a single task: ['Z'], n=100 → 1 (no cooldown is paid after the last task)", () => {
      expect(leastInterval(['Z'], 100)).toBe(1);
    });

    it("one label repeated: ['A' × 4], n=2 → 10 (A _ _ A _ _ A _ _ A)", () => {
      expect(leastInterval(repeat('A', 4), 2)).toBe(10);
    });

    it('all labels distinct: the answer is just the number of tasks, whatever n is', () => {
      expect(leastInterval(['A', 'B', 'C', 'D', 'E'], 50)).toBe(5);
    });

    it('n = 0 always gives tasks.length', () => {
      expect(leastInterval(['A', 'A', 'B', 'A', 'C', 'C'], 0)).toBe(6);
    });

    it('all 26 letters twice with n = 25 → 52 (exactly fills every cooldown)', () => {
      const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
      expect(leastInterval([...letters, ...letters], 25)).toBe(52);
    });
  });

  describe('tricky cases', () => {
    it("several labels tie for the max count: ['A'×3, 'B'×3, 'C'×3, 'D'], n=2 → 10", () => {
      // A B C A B C A B C … D has to go somewhere: (3-1)·3 + 3 = 9 is too small for 10 tasks.
      expect(leastInterval([...repeat('A', 3), ...repeat('B', 3), ...repeat('C', 3), 'D'], 2)).toBe(10);
    });

    it("ties for the max add to the LAST block: ['A'×3, 'B'×3, 'C'], n=2 → 8", () => {
      expect(leastInterval([...repeat('A', 3), ...repeat('B', 3), 'C'], 2)).toBe(8);
    });

    it("more variety than slots: ['A'×2, 'B'..'G'], n=1 → 8 (no idle, answer = tasks.length)", () => {
      expect(leastInterval(['A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 1)).toBe(8);
    });

    it("idle time comes only from the most frequent label: ['A'×6, 'B', 'C'], n=2 → 16", () => {
      // A B C A _ _ A _ _ A _ _ A _ _ A → (6-1)·3 + 1
      expect(leastInterval([...repeat('A', 6), 'B', 'C'], 2)).toBe(16);
    });

    it("order of the input doesn't matter: interleaved vs grouped give the same answer", () => {
      const grouped = [...repeat('A', 4), ...repeat('B', 2), ...repeat('C', 1)];
      const interleaved = ['C', 'A', 'B', 'A', 'B', 'A', 'A'];
      expect(leastInterval(grouped, 3)).toBe(13);
      expect(leastInterval(interleaved, 3)).toBe(13);
    });

    it('greedy must favour the most frequent label, not alphabetical order', () => {
      // Running B and C first wastes the cooldown windows of the many As.
      expect(leastInterval(['B', 'C', ...repeat('A', 4)], 2)).toBe(10);
    });
  });

  describe('randomized (seeded) against an exhaustive search', () => {
    it('300 tiny random task lists (up to 3 labels, up to 4 copies each, n ≤ 3)', () => {
      const rng = createRng(55);
      for (let t = 0; t < 300; t++) {
        const tasks = [];
        const labels = randomInt(rng, 1, 3);
        for (let l = 0; l < labels; l++) {
          const copies = randomInt(rng, 1, 4);
          for (let c = 0; c < copies; c++) tasks.push(String.fromCharCode(65 + l));
        }
        const n = randomInt(rng, 0, 3);
        expect(leastInterval(tasks, n), `tasks=${tasks.join('')}, n=${n}`).toBe(bruteLeastInterval(tasks, n));
      }
    });
  });

  describe('performance', () => {
    it("100,000 copies of 'A' with n = 100 → 9,999,901 (jump over idle stretches instead of stepping through ~10^7 units)", () => {
      const { result, ms } = measure(() => leastInterval(repeat('A', 100_000), 100));
      expect(result).toBe(99_999 * 101 + 1);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });

    it('100,000 random tasks over all 26 letters with n = 30 stays fast', () => {
      const rng = createRng(77);
      // Skewed frequencies so that idling actually happens.
      const tasks = Array.from({ length: 100_000 }, () => {
        const r = rng();
        return r < 0.3 ? 'E' : String.fromCharCode(65 + randomInt(rng, 0, 25));
      });
      // 'E' appears 32,508 times (more than any other letter), so the Es dictate the answer:
      // 32,507 full rounds of 31 units plus the final E.
      const { result, ms } = measure(() => leastInterval(tasks, 30));
      expect(result).toBe(32_507 * 31 + 1);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { floodFill } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Deep copy of a grid, so a reused input is never shared with the function. */
const copy = (grid) => grid.map((row) => row.slice());

/**
 * Calls floodFill on a copy of `image` whose rows count every cell access.
 * If the function touches cells far more often than any correct fill could,
 * we abort with a clear message instead of hanging forever (synchronous
 * infinite loops can't be interrupted by test timeouts).
 */
function fill(image, sr, sc, color) {
  const cells = image.length * image[0].length;
  const limit = 20 * cells + 1000;
  let ops = 0;
  let armed = true;
  const guard = {
    get(target, key, receiver) {
      if (armed && typeof key === 'string' && key !== 'length' && ++ops > limit) {
        throw new Error(
          `floodFill touched pixels more than ${limit} times on a ${cells}-pixel image — ` +
            'probably an endless fill (is the new colour equal to the original one?)',
        );
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      if (armed && ++ops > limit) {
        throw new Error(`floodFill wrote pixels more than ${limit} times — probably an endless fill`);
      }
      return Reflect.set(target, key, value, receiver);
    },
  };
  const guarded = copy(image).map((row) => new Proxy(row, guard));
  try {
    const result = floodFill(guarded, sr, sc, color);
    return result;
  } finally {
    armed = false;
  }
}

/** Brute-force oracle: keep growing the region until nothing changes. */
function bruteFill(image, sr, sc, color) {
  const m = image.length;
  const n = image[0].length;
  const original = image[sr][sc];
  const inRegion = Array.from({ length: m }, () => Array(n).fill(false));
  inRegion[sr][sc] = true;
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (inRegion[r][c] || image[r][c] !== original) continue;
        const touches =
          (r > 0 && inRegion[r - 1][c]) ||
          (r < m - 1 && inRegion[r + 1][c]) ||
          (c > 0 && inRegion[r][c - 1]) ||
          (c < n - 1 && inRegion[r][c + 1]);
        if (touches) {
          inRegion[r][c] = true;
          changed = true;
        }
      }
    }
  }
  return image.map((row, r) => row.map((v, c) => (inRegion[r][c] ? color : v)));
}

describe('Flood Fill', () => {
  describe('examples from the problem', () => {
    it('3×3 of mostly 1s from (1, 1) with colour 2 → the diagonal 1 in the corner stays 1', () => {
      const image = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
      ];
      expect(fill(image, 1, 1, 2)).toEqual([
        [2, 2, 2],
        [2, 2, 0],
        [2, 0, 1],
      ]);
    });

    it('new colour equal to the old colour → image unchanged (and the call must terminate)', () => {
      const image = [
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(fill(image, 0, 0, 0)).toEqual([
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });

    it('the fill goes around an obstacle: the right column is reached via the bottom row', () => {
      const image = [
        [5, 3, 5],
        [5, 3, 5],
        [5, 5, 5],
      ];
      expect(fill(image, 0, 0, 9)).toEqual([
        [9, 3, 9],
        [9, 3, 9],
        [9, 9, 9],
      ]);
    });
  });

  describe('edge cases', () => {
    it('1×1 image [[0]], colour 5 → [[5]]', () => {
      expect(fill([[0]], 0, 0, 5)).toEqual([[5]]);
    });

    it('1×1 image whose pixel already has the new colour → unchanged', () => {
      expect(fill([[7]], 0, 0, 7)).toEqual([[7]]);
    });

    it('single row [1, 1, 0, 1, 1] from (0, 0) → [3, 3, 0, 1, 1] (the 0 blocks the fill)', () => {
      expect(fill([[1, 1, 0, 1, 1]], 0, 0, 3)).toEqual([[3, 3, 0, 1, 1]]);
    });

    it('single column, starting in the middle, fills both up and down', () => {
      expect(fill([[4], [4], [4], [1], [4]], 1, 0, 8)).toEqual([[8], [8], [8], [1], [4]]);
    });

    it('a start pixel unlike all its neighbours → only that pixel changes', () => {
      const image = [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1],
      ];
      expect(fill(image, 1, 1, 3)).toEqual([
        [1, 1, 1],
        [1, 3, 1],
        [1, 1, 1],
      ]);
    });

    it('new colour 0 works (watch out for falsy checks like `if (!color)`)', () => {
      const image = [
        [2, 2],
        [2, 1],
      ];
      expect(fill(image, 0, 1, 0)).toEqual([
        [0, 0],
        [0, 1],
      ]);
    });

    it('original colour 0 and the largest colour 65535', () => {
      const image = [
        [0, 0, 1],
        [1, 0, 0],
      ];
      expect(fill(image, 1, 2, 65535)).toEqual([
        [65535, 65535, 1],
        [1, 65535, 65535],
      ]);
    });

    it('starting in the bottom-right corner (bounds checks on the far edges)', () => {
      const image = [
        [6, 6, 6],
        [0, 6, 6],
      ];
      expect(fill(image, 1, 2, 1)).toEqual([
        [1, 1, 1],
        [0, 1, 1],
      ]);
    });
  });

  describe('tricky cases', () => {
    it('diagonal neighbours are NOT connected: filling the centre of a checkerboard changes one pixel', () => {
      const image = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
      ];
      expect(fill(image, 1, 1, 5)).toEqual([
        [1, 0, 1],
        [0, 5, 0],
        [1, 0, 1],
      ]);
    });

    it('pixels of the same colour that are not connected to the start keep their colour', () => {
      const image = [
        [1, 1, 0, 1],
        [0, 0, 0, 1],
        [1, 0, 1, 1],
      ];
      expect(fill(image, 0, 0, 7)).toEqual([
        [7, 7, 0, 1],
        [0, 0, 0, 1],
        [1, 0, 1, 1],
      ]);
    });

    it('spreads only through the ORIGINAL colour, not through "anything that is not the new colour"', () => {
      const image = [
        [1, 2, 3],
        [1, 2, 3],
      ];
      expect(fill(image, 0, 0, 5)).toEqual([
        [5, 2, 3],
        [5, 2, 3],
      ]);
    });

    it('painting a region with the colour of its neighbour must not continue into the neighbour', () => {
      // After painting, the 1s look like the 2s — a fill that re-reads the start
      // pixel's colour mid-way would wrongly spread into the 2-region.
      const image = [
        [1, 1, 2, 2],
        [1, 1, 2, 3],
        [3, 3, 2, 3],
      ];
      expect(fill(image, 0, 0, 2)).toEqual([
        [2, 2, 2, 2],
        [2, 2, 2, 3],
        [3, 3, 2, 3],
      ]);
    });

    it('a spiral-shaped region: the fill has to turn every corner and come back inward', () => {
      const image = [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
      ];
      expect(fill(image, 0, 0, 4)).toEqual([
        [4, 4, 4, 4, 4],
        [0, 0, 0, 0, 4],
        [4, 4, 4, 0, 4],
        [4, 0, 0, 0, 4],
        [4, 4, 4, 4, 4],
      ]);
    });

    it('new colour equal to the old colour on a 50×50 region terminates and changes nothing', () => {
      const image = Array.from({ length: 50 }, (_, r) => Array.from({ length: 50 }, (_, c) => (r === c ? 9 : 3)));
      expect(fill(image, 10, 3, 3)).toEqual(image);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force "grow until stable" fill on 300 random images', () => {
      const rng = createRng(1201);
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 8);
        const n = randomInt(rng, 1, 8);
        const image = Array.from({ length: m }, () => Array.from({ length: n }, () => randomInt(rng, 0, 2)));
        const sr = randomInt(rng, 0, m - 1);
        const sc = randomInt(rng, 0, n - 1);
        const color = randomInt(rng, 0, 3); // sometimes equal to the original colour
        expect(fill(image, sr, sc, color), `image ${JSON.stringify(image)}, start (${sr}, ${sc}), colour ${color}`).toEqual(
          bruteFill(image, sr, sc, color),
        );
      }
    });
  });

  describe('performance & recursion depth', () => {
    it('500×500 image of a single colour (a recursive DFS goes ~250,000 calls deep and overflows the call stack)', () => {
      const image = Array.from({ length: 500 }, () => Array(500).fill(1));
      const { result, ms } = measure(() => floodFill(image, 250, 250, 2));
      expect(result.every((row) => row.every((v) => v === 2)), 'every pixel should become 2').toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(m·n)`).toBeLessThan(1000);
    });

    it('500×500 one-pixel-wide snake path (125,000+ pixels long — again too deep for recursion)', () => {
      // Rows 0, 2, 4, … are full of 1s; odd rows are 0 except one pixel that
      // links to the next row, alternating between the right and left edge.
      const n = 500;
      const image = Array.from({ length: n }, (_, r) => {
        if (r % 2 === 0) return Array(n).fill(1);
        const row = Array(n).fill(0);
        row[r % 4 === 1 ? n - 1 : 0] = 1;
        return row;
      });
      const expected = image.map((row) => row.map((v) => (v === 1 ? 7 : 0)));
      const { result, ms } = measure(() => floodFill(copy(image), 0, 0, 7));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(m·n)`).toBeLessThan(1000);
    });

    it('500×500 image where the new colour equals the old one returns at once, untouched', () => {
      const image = Array.from({ length: 500 }, () => Array(500).fill(4));
      const { result, ms } = measure(() => fill(image, 0, 0, 4));
      expect(result).toEqual(image);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});

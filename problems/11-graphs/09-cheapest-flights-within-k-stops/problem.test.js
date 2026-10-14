import { describe, it, expect } from 'vitest';
import { findCheapestPrice } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Brute force: try every route of at most k + 1 flights (tiny inputs only). */
function bruteForce(n, flights, src, dst, k) {
  let best = Infinity;
  const walk = (city, spent, flightsUsed) => {
    if (city === dst) best = Math.min(best, spent);
    if (flightsUsed === k + 1) return;
    for (const [a, b, p] of flights) if (a === city) walk(b, spent + p, flightsUsed + 1);
  };
  walk(src, 0, 0);
  return best === Infinity ? -1 : best;
}

/**
 * src → layer 0 → layer 1 → … → layer L-1 → dst, every layer fully connected
 * to the next, every flight costs 100. That is width^layers equally cheap
 * routes, each with exactly `layers` stops.
 */
function layeredGraph(width, layers) {
  const n = 2 + width * layers;
  const dst = n - 1;
  const id = (layer, i) => 1 + layer * width + i;
  const flights = [];
  for (let i = 0; i < width; i++) flights.push([0, id(0, i), 100]);
  for (let l = 0; l + 1 < layers; l++)
    for (let i = 0; i < width; i++) for (let j = 0; j < width; j++) flights.push([id(l, i), id(l + 1, j), 100]);
  for (let i = 0; i < width; i++) flights.push([id(layers - 1, i), dst, 100]);
  return { n, flights, src: 0, dst };
}

describe('Cheapest Flights Within K Stops', () => {
  describe('examples from the problem', () => {
    const flights = [[0, 1, 40], [1, 2, 40], [0, 2, 100]];

    it('k = 1 → 80 (one stop at city 1 is allowed)', () => {
      expect(findCheapestPrice(3, flights, 0, 2, 1)).toBe(80);
    });

    it('k = 0 → 100 (only the direct flight)', () => {
      expect(findCheapestPrice(3, flights, 0, 2, 0)).toBe(100);
    });

    it('the overall cheapest route (6) needs 3 stops; with k = 2 the answer is 7', () => {
      const f = [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2], [1, 4, 1], [4, 2, 1]];
      expect(findCheapestPrice(5, f, 0, 2, 2)).toBe(7);
    });

    it('a chain that needs two stops with k = 1 → -1', () => {
      expect(findCheapestPrice(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1]], 0, 3, 1)).toBe(-1);
    });
  });

  describe('edge cases', () => {
    it('no flights at all → -1', () => {
      expect(findCheapestPrice(2, [], 0, 1, 1)).toBe(-1);
    });

    it('single direct flight with k = 0 → its price', () => {
      expect(findCheapestPrice(2, [[0, 1, 10_000]], 0, 1, 0)).toBe(10_000);
    });

    it('flights are one-way: [[1,0,5]] does not get you from 0 to 1 → -1', () => {
      expect(findCheapestPrice(2, [[1, 0, 5]], 0, 1, 1)).toBe(-1);
    });

    it('dst is in a completely separate part of the graph → -1', () => {
      expect(findCheapestPrice(4, [[0, 1, 3], [2, 3, 3]], 0, 3, 3)).toBe(-1);
    });

    it('does not modify the input array', () => {
      const flights = [[0, 1, 40], [1, 2, 40], [0, 2, 100]];
      const copy = flights.map((f) => [...f]);
      findCheapestPrice(3, flights, 0, 2, 1);
      expect(flights).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('k = 0 allows only the direct flight → 5 (relaxing in place in one round would sneak in 0→1→2 = 2)', () => {
      // The flights are listed so that an in-place update of 0→1 is seen by 1→2
      // in the same round. You must read last round's costs, not this round's.
      expect(findCheapestPrice(3, [[0, 1, 1], [1, 2, 1], [0, 2, 5]], 0, 2, 0)).toBe(5);
    });

    it('k = 1 → 50 via 0→2→4, not 4 via the cheap four-flight chain (in-place relaxation overshoots here too)', () => {
      // Cheap chain 0→1→2→3→4 (1 each, 3 stops) vs. 0→2 (20) → 2→4 (30), 1 stop.
      const flights = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [0, 2, 20], [2, 4, 30]];
      expect(findCheapestPrice(5, flights, 0, 4, 1)).toBe(50);
    });

    it('the stop limit is inclusive: exactly k stops is allowed (chain of 3 flights, k = 2 → 3)', () => {
      const flights = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 100]];
      expect(findCheapestPrice(4, flights, 0, 3, 2)).toBe(3);
    });

    it('one fewer stop than the cheap route needs → fall back to the expensive one (k = 1 → 100)', () => {
      const flights = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 100]];
      expect(findCheapestPrice(4, flights, 0, 3, 1)).toBe(100);
    });

    it('a city reached cheaply-but-late must not hide its pricier, earlier arrival (Dijkstra-with-visited trap) → 13', () => {
      // City 2: cost 3 via 0→1→2 (2 flights) or cost 10 via 0→2 (1 flight).
      // With k = 1 only the direct arrival can continue to 3 in time.
      const flights = [[0, 1, 1], [1, 2, 2], [0, 2, 10], [2, 3, 3]];
      expect(findCheapestPrice(4, flights, 0, 3, 1)).toBe(13);
    });

    it('large k behaves like an ordinary cheapest-path search', () => {
      const f = [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2], [1, 4, 1], [4, 2, 1]];
      expect(findCheapestPrice(5, f, 0, 2, 4)).toBe(6);
    });

    it('cycles are harmless: 0→1→2→0 loop plus 2→3', () => {
      const flights = [[0, 1, 1], [1, 2, 1], [2, 0, 1], [2, 3, 1], [1, 0, 1]];
      expect(findCheapestPrice(4, flights, 0, 3, 3)).toBe(3);
    });

    it('flights leaving dst or entering src do not matter', () => {
      const flights = [[2, 0, 1], [0, 1, 4], [1, 2, 4], [2, 1, 1], [1, 0, 1]];
      expect(findCheapestPrice(3, flights, 0, 2, 1)).toBe(8);
    });

    it('src does not have to be city 0, dst does not have to be the last city', () => {
      const flights = [[3, 0, 7], [0, 1, 2], [3, 1, 20]];
      expect(findCheapestPrice(4, flights, 3, 1, 1)).toBe(9);
    });

    it('the cheapest route uses more flights than the fewest-flights route (BFS by hops alone is wrong)', () => {
      const flights = [[0, 3, 500], [0, 1, 100], [1, 2, 100], [2, 3, 100]];
      expect(findCheapestPrice(4, flights, 0, 3, 2)).toBe(300);
    });
  });

  describe('randomized (seeded) against brute-force route enumeration', () => {
    it('agrees on 400 random small networks with random k', () => {
      const rng = createRng(777);
      let impossible = 0;
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 2, 7);
        const pairs = [];
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (a !== b) pairs.push([a, b]);
        shuffle(rng, pairs);
        const m = randomInt(rng, 0, Math.min(pairs.length, 2 * n));
        const flights = pairs.slice(0, m).map(([a, b]) => [a, b, randomInt(rng, 1, 30)]);
        const src = randomInt(rng, 0, n - 1);
        let dst = randomInt(rng, 0, n - 1);
        if (dst === src) dst = (src + 1) % n;
        const k = randomInt(rng, 0, Math.min(3, n - 1));
        const expected = bruteForce(n, flights, src, dst, k);
        if (expected === -1) impossible++;
        expect(
          findCheapestPrice(n, flights, src, dst, k),
          `n=${n}, flights=${JSON.stringify(flights)}, src=${src}, dst=${dst}, k=${k}`,
        ).toBe(expected);
      }
      expect(impossible).toBeGreaterThan(40);
      expect(impossible).toBeLessThan(360);
    });
  });

  describe('performance', () => {
    it('layered graph with 10^8 equally priced routes, three queries, quickly (enumerating routes with DFS takes seconds)', () => {
      // 82 cities: src, 8 layers of 10, dst. Every route has exactly 8 stops.
      const { n, flights, src, dst } = layeredGraph(10, 8);
      const { result, ms } = measure(() => [
        findCheapestPrice(n, flights, src, dst, 8),
        findCheapestPrice(n, flights, src, dst, 20),
        findCheapestPrice(n, flights, src, dst, 7),
      ]);
      expect(result).toEqual([900, 900, -1]);
      expect(ms, `took ${ms.toFixed(0)}ms — think k + 1 rounds over the flight list`).toBeLessThan(500);
    });

    it('complete network of 100 cities (9,900 flights), k = 2 → matches an explicit search over all 2-stop routes, quickly', () => {
      const n = 100;
      const rng = createRng(4242);
      const price = Array.from({ length: n }, () => new Array(n).fill(Infinity));
      const flights = [];
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (a === b) continue;
          price[a][b] = randomInt(rng, 1, 10_000);
          flights.push([a, b, price[a][b]]);
        }
      }
      const src = 17;
      const dst = 83;
      // Direct, one stop (via a), or two stops (via a then b).
      let expected = price[src][dst];
      for (let a = 0; a < n; a++) {
        expected = Math.min(expected, price[src][a] + price[a][dst]);
        for (let b = 0; b < n; b++) expected = Math.min(expected, price[src][a] + price[a][b] + price[b][dst]);
      }
      const { result, ms } = measure(() => findCheapestPrice(n, flights, src, dst, 2));
      expect(result).toBe(expected);
      expect(ms).toBeLessThan(500);
    });
  });
});

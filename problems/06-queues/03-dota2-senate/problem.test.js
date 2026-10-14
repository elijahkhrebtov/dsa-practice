import { describe, it, expect } from 'vitest';
import { predictPartyVictory } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Exhaustive game search: tries EVERY possible ban at every turn (no greedy
 * assumption) and lets each senator pick a move that wins for their party
 * if one exists. Exponential state space — only for tiny n.
 */
function bruteForce(senate) {
  const n = senate.length;
  const memo = new Map();
  // alive: bitmask of senators with rights; cur: index of the senator about to act.
  const win = (alive, cur) => {
    const key = alive * 32 + cur;
    if (memo.has(key)) return memo.get(key);
    let hasR = false;
    let hasD = false;
    for (let i = 0; i < n; i++) {
      if (alive & (1 << i)) senate[i] === 'R' ? (hasR = true) : (hasD = true);
    }
    let result;
    if (!hasD) result = 'R';
    else if (!hasR) result = 'D';
    else {
      const me = senate[cur];
      result = me === 'R' ? 'D' : 'R';
      for (let v = 0; v < n && result !== me; v++) {
        if (v === cur || !(alive & (1 << v))) continue;
        const nextAlive = alive & ~(1 << v);
        let nxt = (cur + 1) % n;
        while (!(nextAlive & (1 << nxt))) nxt = (nxt + 1) % n;
        if (win(nextAlive, nxt) === me) result = me;
      }
    }
    memo.set(key, result);
    return result;
  };
  return win((1 << n) - 1, 0) === 'R' ? 'Radiant' : 'Dire';
}

describe('Dota2 Senate', () => {
  describe('examples from the problem', () => {
    it('"RD" → "Radiant" (whoever acts first bans the other)', () => {
      expect(predictPartyVictory('RD')).toBe('Radiant');
    });

    it('"RDD" → "Dire" (the banned senator 1 is skipped, senator 2 retaliates)', () => {
      expect(predictPartyVictory('RDD')).toBe('Dire');
    });

    it('"DDRRR" → "Dire" (order beats numbers: 2 early D senators beat 3 R senators)', () => {
      expect(predictPartyVictory('DDRRR')).toBe('Dire');
    });
  });

  describe('edge cases', () => {
    it('"R" → "Radiant" (a lone senator wins immediately)', () => {
      expect(predictPartyVictory('R')).toBe('Radiant');
    });

    it('"D" → "Dire"', () => {
      expect(predictPartyVictory('D')).toBe('Dire');
    });

    it('"DR" → "Dire"', () => {
      expect(predictPartyVictory('DR')).toBe('Dire');
    });

    it('a single party only: "RRRR" → "Radiant", "DDD" → "Dire"', () => {
      expect(predictPartyVictory('RRRR')).toBe('Radiant');
      expect(predictPartyVictory('DDD')).toBe('Dire');
    });

    it('returns the exact strings "Radiant" / "Dire" (not "R" / "D")', () => {
      expect(predictPartyVictory('RRD')).toBe('Radiant');
      expect(predictPartyVictory('DDR')).toBe('Dire');
    });
  });

  describe('tricky cases', () => {
    it('"RDRDRD" → "Radiant" (perfect alternation: the first mover keeps the edge)', () => {
      expect(predictPartyVictory('RDRDRD')).toBe('Radiant');
    });

    it('"DRDRR" → "Dire" (the minority wins because both D senators act before the R they target)', () => {
      // D0 bans R1, D2 bans R3, R4 bans D0 (wrapping around); round 2: D2 bans R4.
      expect(predictPartyVictory('DRDRR')).toBe('Dire');
    });

    it('"RRDDD" → "Radiant" (2 R first beat 3 D, mirror of example 3)', () => {
      expect(predictPartyVictory('RRDDD')).toBe('Radiant');
    });

    it('"DRRR" → "Radiant" (the first D bans only one R; the rest outnumber it)', () => {
      expect(predictPartyVictory('DRRR')).toBe('Radiant');
    });

    it('"RDDDR" → "Dire" (ban the NEXT opponent in turn order: D2 must ban R4, who acts before R0 again)', () => {
      expect(predictPartyVictory('RDDDR')).toBe('Dire');
    });

    it('"RDDRR" → "Radiant" and "DRDDR" → "Dire" (sometimes the majority does win — no shortcut either way)', () => {
      expect(predictPartyVictory('RDDRR')).toBe('Radiant');
      expect(predictPartyVictory('DRDDR')).toBe('Dire');
    });

    it('"DDRRRR" → "Radiant" but "DDRRR" → "Dire" (one extra R tips the balance)', () => {
      expect(predictPartyVictory('DDRRRR')).toBe('Radiant');
      expect(predictPartyVictory('DDRRR')).toBe('Dire');
    });

    it('"RRDDRDD" → "Radiant" and "DDRRDRR" → "Dire" (the side with fewer senators wins both times)', () => {
      expect(predictPartyVictory('RRDDRDD')).toBe('Radiant');
      expect(predictPartyVictory('DDRRDRR')).toBe('Dire');
    });
  });

  describe('exhaustive and randomized (seeded) against a full game search', () => {
    it('matches an exhaustive game search for every senate of length 1 to 8', () => {
      for (let n = 1; n <= 8; n++) {
        for (let mask = 0; mask < 1 << n; mask++) {
          let s = '';
          for (let i = 0; i < n; i++) s += mask & (1 << i) ? 'R' : 'D';
          expect(predictPartyVictory(s), s).toBe(bruteForce(s));
        }
      }
    });

    it('matches the game search on 150 random senates of length 9 to 12', () => {
      const rng = createRng(77);
      for (let t = 0; t < 150; t++) {
        const n = randomInt(rng, 9, 12);
        let s = '';
        for (let i = 0; i < n; i++) s += rng() < 0.5 ? 'R' : 'D';
        expect(predictPartyVictory(s), s).toBe(bruteForce(s));
      }
    });
  });

  describe('performance', () => {
    it('80,000 senators "RRR…RDDD…D" finish quickly (scanning for the next victim on every ban is O(n²))', () => {
      const n = 80_000;
      const senate = 'R'.repeat(n / 2) + 'D'.repeat(n / 2);
      const { result, ms } = measure(() => predictPartyVictory(senate));
      expect(result).toBe('Radiant');
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) with two queues`).toBeLessThan(500);
    });

    it('80,000 senators with one D in front "DRRR…RDDD…D" finish quickly', () => {
      const n = 80_000;
      const senate = 'D' + 'R'.repeat(n / 2) + 'D'.repeat(n / 2 - 1);
      const { result, ms } = measure(() => predictPartyVictory(senate));
      expect(result).toBe('Radiant');
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) with two queues`).toBeLessThan(500);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { suggestedProducts } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute force: for every prefix, filter, sort, take 3. */
function brute(products, searchWord) {
  const out = [];
  for (let i = 1; i <= searchWord.length; i++) {
    const prefix = searchWord.slice(0, i);
    out.push(
      products
        .filter((p) => p.startsWith(prefix))
        .sort()
        .slice(0, 3),
    );
  }
  return out;
}

const randomLetters = (rng, n, alphabet = 26) => {
  let s = '';
  for (let i = 0; i < n; i++) s += String.fromCharCode(97 + randomInt(rng, 0, alphabet - 1));
  return s;
};

describe('Search Suggestions System', () => {
  describe('examples from the problem', () => {
    it('mobile, mouse, moneypot, monitor, mousepad / "mouse" → the 3 smallest matches per prefix', () => {
      expect(suggestedProducts(['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse')).toEqual([
        ['mobile', 'moneypot', 'monitor'],
        ['mobile', 'moneypot', 'monitor'],
        ['mouse', 'mousepad'],
        ['mouse', 'mousepad'],
        ['mouse', 'mousepad'],
      ]);
    });

    it('["havana"] / "havana" → ["havana"] for each of the 6 prefixes', () => {
      expect(suggestedProducts(['havana'], 'havana')).toEqual(Array.from({ length: 6 }, () => ['havana']));
    });

    it('bags, baggage, banner, box, cloths / "bags" → "baggage" sorts before "bags"', () => {
      expect(suggestedProducts(['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags')).toEqual([
        ['baggage', 'bags', 'banner'],
        ['baggage', 'bags', 'banner'],
        ['baggage', 'bags'],
        ['bags'],
      ]);
    });

    it('["havana"] / "tatiana" → seven empty lists (one per typed character, even with no matches)', () => {
      expect(suggestedProducts(['havana'], 'tatiana')).toEqual([[], [], [], [], [], [], []]);
    });
  });

  describe('edge cases', () => {
    it('a one-letter search word → exactly one list', () => {
      expect(suggestedProducts(['apple', 'banana'], 'b')).toEqual([['banana']]);
    });

    it('matches run out midway: ["ab"] / "abc" → [["ab"], ["ab"], []]', () => {
      expect(suggestedProducts(['ab'], 'abc')).toEqual([['ab'], ['ab'], []]);
    });

    it('no match from the very first letter → all lists empty', () => {
      expect(suggestedProducts(['dog', 'deer'], 'cat')).toEqual([[], [], []]);
    });

    it('the first letter matches, then a later one breaks the path for good: ["abc", "abd"] / "axbc"', () => {
      expect(suggestedProducts(['abc', 'abd'], 'axbc')).toEqual([['abc', 'abd'], [], [], []]);
    });

    it('exactly three matches are all shown; a fourth is cut off', () => {
      expect(suggestedProducts(['ca', 'cb', 'cc'], 'c')).toEqual([['ca', 'cb', 'cc']]);
      expect(suggestedProducts(['cd', 'ca', 'cb', 'cc'], 'c')).toEqual([['ca', 'cb', 'cc']]);
    });

    it('does not modify the products array', () => {
      const products = ['mouse', 'mobile', 'monitor'];
      const copy = [...products];
      suggestedProducts(products, 'mo');
      expect(products).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('lexicographic, not by length: abd, abcd, ab / "a" → ["ab", "abcd", "abd"]', () => {
      expect(suggestedProducts(['abd', 'abcd', 'ab'], 'a')).toEqual([['ab', 'abcd', 'abd']]);
    });

    it('a product equal to the prefix comes before its extensions: mousepad, mouse, mousetrap / "mouse"', () => {
      expect(suggestedProducts(['mousepad', 'mouse', 'mousetrap'], 'mouse').at(-1)).toEqual([
        'mouse',
        'mousepad',
        'mousetrap',
      ]);
    });

    it('products that do NOT start with the prefix are ignored even if they contain it: amouse, xmo / "mo"', () => {
      expect(suggestedProducts(['amouse', 'xmo', 'mop'], 'mo')).toEqual([['mop'], ['mop']]);
    });

    it('the input is given in reverse order: 26 one-letter-tail products za…zz / "z"', () => {
      const products = Array.from({ length: 26 }, (_, i) => 'z' + String.fromCharCode(122 - i)); // zz, zy, …, za
      expect(suggestedProducts(products, 'z')).toEqual([['za', 'zb', 'zc']]);
    });

    it('a deep shared prefix: suggestions shrink as the word gets longer', () => {
      const products = ['a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaab'];
      expect(suggestedProducts(products, 'aaaa')).toEqual([
        ['a', 'aa', 'aaa'],
        ['aa', 'aaa', 'aaaa'],
        ['aaa', 'aaaa', 'aaaaa'],
        ['aaaa', 'aaaaa'],
      ]);
    });

    it('each returned list is a fresh array (mutating one does not affect another call)', () => {
      const products = ['mobile', 'mouse'];
      const first = suggestedProducts(products, 'mo');
      first[0].push('HACKED');
      first[1].length = 0;
      expect(suggestedProducts(products, 'mo')).toEqual([
        ['mobile', 'mouse'],
        ['mobile', 'mouse'],
      ]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a filter-and-sort brute force on 300 random inputs over a small alphabet', () => {
      const rng = createRng(606);
      for (let t = 0; t < 300; t++) {
        const pool = new Set();
        const n = randomInt(rng, 1, 30);
        while (pool.size < n) pool.add(randomLetters(rng, randomInt(rng, 1, 6), 3));
        const products = [...pool];
        const searchWord = randomLetters(rng, randomInt(rng, 1, 7), 3);
        expect(suggestedProducts(products, searchWord), `${JSON.stringify(products)} / ${searchWord}`).toEqual(
          brute(products, searchWord),
        );
      }
    });
  });

  describe('performance', () => {
    it('25,000 products sharing prefixes with a 400-letter search word (re-filtering and re-sorting per prefix is far too slow)', () => {
      const rng = createRng(3);
      const L = 400;
      const searchWord = randomLetters(rng, L);
      const pool = new Set();
      // Each product follows the search word for a random distance, then branches off.
      while (pool.size < 25_000) pool.add(searchWord.slice(0, randomInt(rng, 0, L)) + randomLetters(rng, randomInt(rng, 1, 5)));
      const products = [...pool];

      const { result, ms } = measure(() => suggestedProducts(products, searchWord));
      expect(result).toHaveLength(L);
      // Spot-check a few prefixes against the brute force on just that prefix.
      for (const i of [0, 1, 50, 199, 300, 398, 399]) {
        const prefix = searchWord.slice(0, i + 1);
        const expected = products
          .filter((p) => p.startsWith(prefix))
          .sort()
          .slice(0, 3);
        expect(result[i], `prefix length ${i + 1}`).toEqual(expected);
      }
      expect(ms, `took ${ms.toFixed(0)}ms — sort once, then answer each prefix cheaply`).toBeLessThan(750);
    });
  });
});

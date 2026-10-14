# Numbers and Bits

Some problems have no interesting container at all: the input is one integer (or an array whose structure doesn't matter) and the work happens in the number itself, either its arithmetic properties or its binary representation. This topic covers how JavaScript stores numbers, the bitwise operators and their tricks, a bit of number theory (modular arithmetic, gcd, the sieve) and dynamic programming over integers.

## How JavaScript represents numbers

Every `number` is an **IEEE-754 double (float64)**: 1 sign bit, 11 exponent bits and 52 fraction bits.

- **Integers are exact only up to 2^53.** `Number.MAX_SAFE_INTEGER` is `2^53 - 1 = 9_007_199_254_740_991`. Past it, not every integer can be represented: `2 ** 53 + 1 === 2 ** 53` is `true`. Check with `Number.isSafeInteger(x)`.
- **Products overflow precision silently.** `a * b` with two values around 10^9 gives about 10^18, which is way past 2^53. The result is rounded, and no error is raised. This is the classic bug in "compute `(a * b) % m`".
- **`BigInt`** (`123n`, `BigInt(x)`) gives arbitrary-precision integers when you really need them. It's much slower, and you can't mix it with `number` in arithmetic (`1n + 1` throws).
- **Division doesn't truncate.** `7 / 2` is `3.5`. Use `Math.floor(a / b)` for floor division, or `Math.trunc(a / b)` to round toward zero (they differ for negatives: `Math.floor(-7 / 2)` is `-4`, `Math.trunc(-7 / 2)` is `-3`).
- **`%` is a remainder, not a modulo.** It takes the sign of the dividend: `-7 % 3` is `-1`. For a non-negative result use `((a % m) + m) % m`.
- **Floats are approximate.** `0.1 + 0.2 !== 0.3`. Compare with a tolerance, and in tests use `toBeCloseTo`.
- **`-0` exists.** `Object.is(-0, 0)` is `false`, and `toEqual` treats them as different.

## Bitwise operators

Bitwise operators **convert both operands to signed 32-bit integers** (two's complement), do the operation, and return a signed 32-bit result. Bits above bit 31 are thrown away.

| Operator | Meaning | Example |
| --- | --- | --- |
| `a & b` | AND: 1 where both bits are 1 | `0b1100 & 0b1010` = `0b1000` |
| `a \| b` | OR: 1 where either bit is 1 | `0b1100 \| 0b1010` = `0b1110` |
| `a ^ b` | XOR: 1 where the bits differ | `0b1100 ^ 0b1010` = `0b0110` |
| `~a` | NOT: flip every bit (`~a === -a - 1`) | `~5` = `-6` |
| `a << k` | shift left, filling with 0 (×2^k while it fits) | `1 << 4` = `16` |
| `a >> k` | arithmetic shift right, copying the sign bit (floor-divides by 2^k) | `-8 >> 1` = `-4` |
| `a >>> k` | logical shift right, filling with 0. Result is **unsigned** | `-1 >>> 0` = `4294967295` |

Gotchas:

- **32-bit truncation.** `2 ** 32 | 0` is `0`, and `(2 ** 31) | 0` is `-2147483648`. Don't use `x | 0` or `~~x` to floor numbers that may exceed 2^31.
- **`>>> 0` reinterprets as unsigned.** `(-1) >>> 0` is `4294967295`. Use it when you want to print or compare the bit pattern as a non-negative number. `x | 0` converts back to signed.
- **Shift counts are taken mod 32.** `1 << 32` is `1`, not `0`.
- **Precedence is low.** `x & 1 === 0` parses as `x & (1 === 0)`. Always parenthesize: `(x & 1) === 0`.
- `Math.clz32(x)` counts leading zero bits of a 32-bit value. `x.toString(2)` shows the binary form of a non-negative number (for negatives it prints `-101`, not two's complement; use `(x >>> 0).toString(2)`).

### Bit tricks

| Expression | What it does | Example (x = `0b10110`) |
| --- | --- | --- |
| `(x >> k) & 1` | read bit k | k = 1 → `1` |
| `x \| (1 << k)` | set bit k | k = 0 → `0b10111` |
| `x & ~(1 << k)` | clear bit k | k = 1 → `0b10100` |
| `x ^ (1 << k)` | toggle bit k | k = 3 → `0b11110` |
| `x & (x - 1)` | clear the lowest set bit | `0b10100` |
| `x & -x` | isolate the lowest set bit | `0b00010` |
| `x > 0 && (x & (x - 1)) === 0` | is x a power of two? | `false` |
| `(1 << k) - 1` | mask of the k lowest bits | k = 3 → `0b111` |
| `x & ((1 << k) - 1)` | keep the k lowest bits (x mod 2^k) | k = 3 → `0b110` |
| `i >> 1`, `i & 1` | i without its last bit, and its last bit | `0b1011`, `0` |

**XOR** deserves its own list, because a lot of puzzles rest on it:

- `x ^ x = 0` and `x ^ 0 = x`.
- It's commutative and associative, so the order of a chain of XORs doesn't matter.
- Together, these mean XOR-ing a list cancels out every value that appears an even number of times.
- `a ^ b` has a 1 exactly where a and b differ. It's addition without carries, while `(a & b) << 1` is the carry.

**Counting set bits (popcount).** Loop `while (x) { x &= x - 1; count++; }`: one iteration per set bit. Or build counts for every number from smaller ones: `bits[i] = bits[i >> 1] + (i & 1)`.

**Subsets as masks.** With n ≤ ~20 items, the integers `0 … (1 << n) - 1` enumerate every subset, and bit i says whether item i is in it.

## Number theory toolkit

- **Modular arithmetic.** `(a + b) % m = ((a % m) + (b % m)) % m`, and the same for `*`. Reduce after every step so values stay small. If `a, b < m ≈ 10^9 + 7`, then `a * b` can reach 10^18 and loses precision as a `number`: use `BigInt` or split the multiplication.
- **Fast exponentiation (exponentiation by squaring).** `x^n = (x^(n/2))^2`, times one more `x` if n is odd. That's O(log n) multiplications instead of n. It works with a modulus too.
- **gcd (Euclid).** `gcd(a, b) = gcd(b, a % b)`, stopping at `gcd(a, 0) = a`. O(log min(a, b)). Then `lcm(a, b) = a / gcd(a, b) * b` (divide first to keep numbers small).
- **Primality.** Trial division only needs to test divisors up to √n. To find *all* primes below n, use the **sieve of Eratosthenes**: cross out multiples of each prime p starting at p², for O(n log log n) total.
- **Digits.** `x % 10` is the last digit and `Math.floor(x / 10)` drops it. Watch the sign for negatives.

## DP on integers

When the answer for n depends on answers for smaller numbers ("ways to reach step n", "fewest squares summing to n", "bits in i"), write the recurrence, then fill a table bottom-up from 0 to n. Plain recursion recomputes the same subproblems an exponential number of times. **Memoization** (cache results by n) or a **bottom-up table** makes each subproblem cost O(1) or O(√n) once. If the recurrence only looks a constant number of steps back, two variables replace the whole table.

## Complexity cheat sheet

| Operation | Time |
| --- | --- |
| any bitwise operator, `+ - * /`, `%` | O(1) |
| popcount with `x &= x - 1` | O(number of set bits) ≤ 32 |
| fast power `x^n` | O(log n) |
| gcd(a, b) | O(log min(a, b)) |
| trial-division primality test of n | O(√n) |
| sieve of Eratosthenes up to n | O(n log log n) time, O(n) space |
| DP over 0 … n with O(1) work per state | O(n) |
| DP over 0 … n trying every square ≤ i | O(n√n) |

## Patterns in this topic

- **Bit Manipulation:** XOR cancellation (Single Number), building answers from smaller numbers' bits (Counting Bits), simulating hardware addition with XOR and carries (Sum of Two Integers).
- **Dynamic Programming:** recurrences over the integers (Climbing Stairs, Counting Bits, Perfect Squares).
- **Divide & Conquer:** halving the exponent (Pow(x, n)).
- **Math:** primes and the sieve (Count Primes), number-theory shortcuts (the four-square theorem in Perfect Squares).
- **Graph BFS:** shortest path where the "nodes" are numbers (Perfect Squares as a BFS over remainders).

## Problem order

1. **01-climbing-stairs** (Easy): the first DP recurrence, and why plain recursion is exponential.
2. **02-single-number** (Easy): XOR cancellation in O(1) space.
3. **03-counting-bits** (Easy): popcount for 0 … n, reusing smaller answers.
4. **04-sum-of-two-integers** (Medium): addition from XOR and carries, with 32-bit two's complement.
5. **05-pow-x-n** (Medium): exponentiation by squaring and negative exponents.
6. **06-count-primes** (Medium): the sieve of Eratosthenes.
7. **07-perfect-squares** (Medium): DP over integers, BFS over remainders, and a theorem shortcut.

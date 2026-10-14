/*
 * Title:      Asteroid Collision
 * Difficulty: Medium
 * Patterns:   Stack, Simulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A row of asteroids is given as an array of non-zero integers `asteroids`,
 * listed in the order they sit on a line (index 0 is the leftmost).
 *
 *   • The absolute value is the asteroid's size.
 *   • The sign is its direction: positive moves RIGHT, negative moves LEFT.
 *   • All asteroids move at the same speed.
 *
 * Two asteroids collide only when a right-moving one is to the LEFT of a
 * left-moving one (they move toward each other). When they collide:
 *
 *   • the smaller one explodes;
 *   • if both have the same size, both explode;
 *   • the survivor keeps moving in its direction and may collide again.
 *
 * Asteroids moving in the same direction never meet, and a left-moving
 * asteroid that is to the left of a right-moving one never meets it either
 * (they fly apart).
 *
 * Return the asteroids that remain after all collisions, in their original
 * left-to-right order. Return an empty array if none survive. Do not modify
 * the input array.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  asteroids = [5, 10, -5]
 *     Output: [5, 10]
 *     Why:    10 and -5 collide and 10 survives. 5 and 10 move the same way.
 *
 *   Example 2
 *     Input:  asteroids = [8, -8]
 *     Output: []
 *     Why:    Equal sizes — both explode.
 *
 *   Example 3
 *     Input:  asteroids = [10, 2, -5]
 *     Output: [10]
 *     Why:    -5 destroys 2, then runs into 10 and is destroyed itself.
 *
 *   Example 4
 *     Input:  asteroids = [-2, -1, 1, 2]
 *     Output: [-2, -1, 1, 2]
 *     Why:    The left-movers are already on the left; nothing ever meets.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 2 <= asteroids.length <= 10^4 (the performance test uses 100,001)
 *   • -1000 <= asteroids[i] <= 1000
 *   • asteroids[i] !== 0
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(n) space. Simulating "find the next colliding pair,
 *   resolve it, start over" is O(n²) and the performance test will catch it.
 */

// ▶ Run tests:   npm run solve asteroid-collision
// ⟳ Watch mode:  npm run watch asteroid-collision

/**
 * Computes which asteroids survive after every collision has happened.
 *
 * @param {number[]} asteroids - Non-zero sizes; the sign is the direction (positive → right, negative → left).
 * @returns {number[]} The surviving asteroids, in their original left-to-right order.
 */
export function asteroidCollision(asteroids) {
  // Your code here
}

# Hint 3

Start with `low = 0`, `mid = 0`, `high = n - 1`, and loop while `mid <= high`:

- `nums[mid] === 0` → swap it with `nums[low]`, then advance **both** `low` and `mid` (whatever came back from `low` is a 1 you've already seen).
- `nums[mid] === 1` → it's already in the right region; just advance `mid`.
- `nums[mid] === 2` → swap it with `nums[high]` and shrink `high`, but **don't** advance `mid`: the element you just received from the right hasn't been examined yet.

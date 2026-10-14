# Hint 2

That tree is exactly what **backtracking** explores. Write a recursive function `build(index, current)`:

- if `index === digits.length`, `current` is complete — record it;
- otherwise, for each letter mapped to `digits[index]`, call `build(index + 1, current + letter)`.

Handle the empty input before starting the recursion, otherwise you'll return `[""]`.

# Hint 3

One pass: for each string, compute its key and append the **original string** to the map's array for that key, creating the array on first sight. When you're done, the map's values are the answer: `[...map.values()]`.

Remember that arrays aren't usable as `Map` keys by value (`[1,2] !== [1,2]`), so make the key a string.

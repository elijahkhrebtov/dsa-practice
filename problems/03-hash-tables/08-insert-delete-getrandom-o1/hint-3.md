# Hint 3

To remove `val` at index `i`: pop the last element, put it at index `i`, update **its** index in the map, then delete `val` from the map. Watch the special case where `val` *is* the last element, so you don't re-register it.

For `getRandom`, use `Math.floor(Math.random() * length)`. Check membership with `map.has(val)`, because index 0 is falsy.

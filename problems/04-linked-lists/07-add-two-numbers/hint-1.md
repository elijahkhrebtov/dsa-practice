# Hint 1

Remember adding on paper: you start at the ones column, add the two digits plus a carry, write down `sum % 10` and carry `Math.floor(sum / 10)` into the next column.

The digits are already stored ones-first, which is exactly the order you need for that. Why won't converting the lists to numbers, adding them and converting back work here?

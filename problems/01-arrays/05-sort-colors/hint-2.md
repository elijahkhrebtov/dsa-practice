# Hint 2

Use **three pointers** that split the array into four regions:

```
[ 0 0 0 | 1 1 1 | ? ? ? ? | 2 2 2 ]
          low     mid       high
```

Everything before `low` is 0, `low..mid-1` is 1, `mid..high` is still unexamined, and everything after `high` is 2. Look at `nums[mid]` and swap it into the right region, shrinking the unknown part by one each step.

# Hint 2

Put every value into a **hash set**, so "is `v` present?" is O(1). Then from a value `x` you can count `x + 1`, `x + 2`, … while they're present.

But starting that walk from *every* value repeats work: in the run 1..m you'd walk from 1, then again from 2, then from 3… How can you tell that a value is the **first** value of its run?

# Hint 2

Use **two heaps**:

- `low`, a **max**-heap holding the smaller half, so its top is the largest of the small numbers;
- `high`, a **min**-heap holding the larger half, so its top is the smallest of the large numbers.

If every element of `low` is `<=` every element of `high`, and their sizes differ by at most one, the median can be read straight off the tops.

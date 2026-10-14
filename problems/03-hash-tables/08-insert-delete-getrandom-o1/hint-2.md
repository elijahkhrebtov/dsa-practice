# Hint 2

Store the elements in an array, plus a **hash map from value → its index in that array**. Insert pushes onto the array and records the index.

Removing from the middle of an array with `splice` is O(n), though. The order of the array doesn't matter to anyone, so is there a way to remove from the middle by touching only one other element?

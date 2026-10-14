# Hint 3

Heap version: sort by start. For each meeting, if the heap is non-empty and its smallest end is `<= start`, pop it, because that room is free again (`<=`, since touching is fine). Then push this meeting's end. The answer is the largest size the heap ever reaches, which is also its final size.

Sweep version: `starts` and `ends` are both sorted ascending. Walk the starts with `i`, keeping a pointer `j` into the ends. Before counting the meeting at `starts[i]`, release every meeting whose `ends[j] <= starts[i]`. Rooms in use = started − ended. Track the maximum.

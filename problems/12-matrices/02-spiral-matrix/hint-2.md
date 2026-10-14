# Hint 2

Keep four boundaries for the unvisited rectangle: `top`, `bottom`, `left`, `right`. Walk one side, then move that side's boundary inward by one, and repeat while `top <= bottom && left <= right`.

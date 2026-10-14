# Hint 2

The greedy move is to ban the next opposing senator in turn order. To simulate that without scanning, keep **two queues** of indices: one for Radiant and one for Dire, each in the order they will act.

Compare the two fronts. The smaller index acts first and bans the other front.

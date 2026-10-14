# Hint 3

Pop both fronts, `r` and `d`. Whichever is smaller survives and acts again **next round**. Push it back onto its own queue with index `+ n`, so it sorts after everyone still waiting in this round. The other one is gone for good.

Repeat until one queue is empty. The party whose queue still has senators wins. Each step removes one senator, so the loop runs at most n times.

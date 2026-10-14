# Hint 1

Walk the list. If there is no cycle, you'll hit `null`. If there is one, you'll walk forever, so you need a way to notice that you've been somewhere before.

The simplest way to notice is to remember every node you've passed (by identity, not by value). Which data structure answers "have I seen this exact object?" in O(1)?

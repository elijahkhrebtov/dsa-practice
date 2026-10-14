# Hint 1

Don't think of `'*'` as a character of its own. Read the pattern as **tokens**: a letter or `.`, optionally followed by `*`. At each step, look at the current token and peek at whether the next pattern character is a `*`.

For a token `x*`, there are only two choices at any moment. What are they?

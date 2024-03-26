# ValoBuddy

## A Note About Hashing and Salting Passwords with `bcrypt`

`bcrypt` claims to salt passwords before it hashes them, but neither its `hash()`
nor `compare()` functions return a plaintext salt, so I was confused about where
that salt is stored for later reference. Our User model doesn't have a column
meant for a password salt, either. When a user attempts to log in, how does
bcrypt retrieve the plaintext salt for use when reconstructing a hash with the
password they provided?

Turns out the salt is stored in the final result that `hash()` outputs. `bcrypt`
generates one for you, adds it to the plaintext password before hashing it
(multiple times, in accordance with the bcrypt algorithm), and then includes that
salt in its final output.
https://stackoverflow.com/a/20399775

# Getting Started

Scallop is a neuro-symbolic programming language based on Datalog.
You can use it simply as discrete Datalog, and can also use it as
probabilistic Datalog or even differentiable Datalog.
We currently provide three ways to interact with Scallop:

- Scallop Interpreter `scli` [(download)](/download.html#scli).
  This interpreter can be ran as a command line program.
  `scli` accepts a `.scl` which will be then executed to produce the
  reasoning result.
  This version of Scallop supports discrete reasoning and probabilistic
  reasoning.

- Scallop REPL `sclrepl` [(download)](/download.html#sclrepl).
  This interpreter can be ran in an interactive shell environment,
  therefore it is nice for demo.
  Similar to `scli`, this version of Scallop supports discrete reasoning
  and probabilistic reasoning.

- Python Binding `scallopy` [(download)](/download.html#scallopy).
  This is a Python binding for Scallop, which allows you to run Scallop
  in native Python environment.
  In addition to allowing for discrete and probabilistic reasoning, this
  Python library includes PyTorch support and enables differentiable
  reasoning.
  You can integrate Scallop modules with your PyTorch machine learning
  pipelines.

We will start by introducing how to write your first `.scl` file and run
it with `scli`.
After that, we will dive into how to use Scallop as a Python library and
use it under some simple learning tasks.

# Your First Scallop Program

Let's write a very simple "Hello World" program with Scallop.
Create a new file named `hello.scl` and write the following inside:

``` scl
// hello.scl
rel hello = {"Hello World"}
```

In this program, we defined a relation `hello` that is a set of strings,
though there is only one string in this set, `"Hello World"`.
Also, as you might have seen, Scallop allows for writing comments with `//`,
just like C and Java.
Now, use your downloaded `scli` executable inside a terminal by doing the
following:

```
$ scli hello.scl
```

The execution result should show the following, which confirms our input
that there is a relation called `hello` and it is a set containing only
one string `"Hello World"`.
Note that here we have parenthesis wrapping around the string since internally
every relation inside Scallop stores *tuples* of simple values.
In this case, `hello` is an *arity-1* relation (all the tuples in this relation
is of size 1), and therefore you see the tuple only wrapping one single value.

```
hello: {("Hello World")}
```

# Scallop by Example

We then demonstrate Scallop by a few examples.

## Parent and Grandparent

Scallop is a full logic programming language based on Datalog.
Here is a traditional relational logic program expressed in Datalog:

``` scl
rel parent = {
  ("Emily", "Bob"), // Emily is Bob's parent
  ("Bob", "Alice"), // Bob is Alice's parent
}

rel grandparent(a, c) = parent(a, b), parent(b, c)

query grandparent // {("Emily", "Alice")}
```

The first four lines, just like your first scallop program, defines a relation
called `parent`.
Now, `parent` is an arity-2 relation since every tuple inside of this relation
contains two elements -- more specifically, two strings.
As the comment suggests, the relation `parent` contains two tuples.
The first one encodes "Emily is Bob's parent" and the second one encodes
"Bob is Alice's parent".
The second item in this program is what we call a **rule** in Scallop.
We read the rule from right-hand-side of the `=` sign as

> If `a` is `b`'s parent, and `b` is `c`'s parent, then `a` is `c`'s grandparent.

Certainly, we have introduced a new relation `grandparent` here which will also
be an arity-2 relation.
The last line of this program says we want to query the tuples in the relation
`grandparent`, which will be `{("Emily", "Alice")}`, as expected.

## Fibonnacci Sequence

While we've been dealing with strings in our previous examples, Scallop supports
various numeric manipulations.
Here's how one would write a Fibonacci Sequence computation in Scallop:

``` scl
// The two base cases for fibonacci sequence
rel fib = {(0, 1), (1, 1)}

// The recursive formula: fib(x) = fib(x - 1) + fib(x - 2)
rel fib(x, a + b) = fib(x - 1, a), fib(x - 2, b), x < 10

// We want to compute the 8-th fibonacci number
query fib(8, y) // fib(8, y): {(8, 34)}
```

The Fibonacci Sequence is a recursive formula with two base cases `fib(0) = 1`
and `fib(1) = 1`.
With Scallop, we encode this sequence as an arity-2 relation where the first
element in the tuple represents the "index" of the number and the second element
represents that number.
Therefore you see that we are defining `fib` relation with a base set of tuples
`(0, 1)` and `(1, 1)`.

Of course, Fibonacci Sequence is an infinite sequence that can expand indefinitely.
We encode this recursive rule as the second item in the program.
If we want to get the `x`-th fib number, we need to first compute the `(x - 1)`-th
and also the `(x - 2)`-th fib numbers, denoted by `a` and `b`.
Then, the `x`-th fib number is simply `a + b`.
You might have noticed that we have included `x < 10` here, and this is because
we want our program to terminate and not compute the infinite sequence.

At the end, we just query `fib` with the index `8`, meaning that we want to
compute the 8-th fibonacci number.
Executing `scli` on this program will give you `fib(8, y): {(8, 34)}` -- that is,
the 8-th fib number is 34.

## Probabilistic Reasoning with Counting Objects

Scallop supports probabilistic reasoning, and this means that Scallop

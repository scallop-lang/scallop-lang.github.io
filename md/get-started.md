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

# Hello World, Your First Scallop Program

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
We call such a tuple **fact**.

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

## Would the Alarm Go Off?

Scallop can be used to reason about probabilistic events.
In the following classical probabilistic reasoning example, we can see Scallop
calculating the resulting probability of whether there will be an alarm:

``` scl
// examples/alarm-2.scl
// earthquake happens with 0.01 probability
rel 0.01::earthquake()

// burglary happens with 0.12 probability
rel 0.12::burglary()

// alarm goes off when either earthquake or burglary happens
rel alarm() = earthquake() or burglary()

query alarm
```

Note that here we introduced a new syntax for defining facts (`rel earthquake()`).
When we associate a floating point in front of a fact, we are associating a
probability with this fact being happening.

If you simply follow the previous instruction to execute this file, you might end
up with a simple result `alarm: {()}`.
This is because when executing this, we have not used a proper **provenance** to
perform probabilistic reasoning, yet.
To allow probabilistic reasoning, use the following command:

```
$ scli alarm-2.scl --provenance topkproofs
```

and the result will be

```
alarm: {0.1288::()}
```

suggesting that the `alarm` will go off with `0.1288` probability.

**provenance** is a core concept when using Scallop, since it configures how to
perform logical, probabilistic, and differentiable reasoning.
A provenance will associate some information along with the deduction process,
and can facilitate the probabilistic reasoning in this case.
Here we are suggesting you use a provenance called `topkproofs`.
There are other probabilistic reasoning provenances as well:

- `minmaxprob`
- `addmultprob`
- `samplekproofs`
- `topbottomkclauses`
- ...

each of them will approximate the probabilistic result in different ways.
Some might be very fast but inaccurate, others might be slow but very accurate.
For the sake of this example, let's stick with `topkproofs`.

## Counting Objects Probabilistically

Scallop supports aggregation, allowing people to perform operations such as
`count`, `exists`, `(arg)min`, and `sum`.
In the following example, we assume that we are in a learning setting, where
each conceptual "object" can be predicted as having colors "red", "green",
and "blue".
We represent the prediction in this way:

``` scl
// count-green.scl
rel object_color = {
  0.98::(0, "red"), 0.01::(0, "green"), 0.01::(0, "blue"),
  0.01::(1, "red"), 0.98::(1, "green"), 0.01::(1, "blue"),
  0.02::(2, "red"), 0.97::(2, "green"), 0.01::(2, "blue"),
}
```

`object_color` is an arity-2 relation where the first element is integer and
the second element is string.
Conceptually, we represent each object using an ID.
In this case, we have three objects, marked using `0`, `1`, and `2`.
Now, each object can be three colors with different probabilities.
Object `0` is most likely red;
object `1` is most likely green;
and object `2` is also most likely green.

Now, one can count over the set using the following rule:

``` scl
// count-green.scl
rel how_many_green(x) = x = count(o: object_color(o, "green"))
```

This rule has an aggregation `count(o: object_color(o, "green"))`, which reads

> Count the number of object `o`, such that the color of that object is `"green"`.

The result of this aggregation is then stored in the variable `x`, which is
stored in the arity-1 relation `how_many_green` at the end.

Since aggregation requires more provenance information to be stored, `topkproofs`
is not sufficient here.
We will use a provenance called `topbottomkclauses`, which supports negation and
aggregation, to aid the execution of this probabilistic program:

```
$ scli count-green.scl --provenance topbottomkclauses
```

After executing this command, you will get the result

```
how_many_green: {0.000594::(0), 0.048318::(1), 0.941582::(2), 0.009506::(3)}
```

We interpret this result this way:
by counting over a set of 3 probabilistic objects, there could be 4 outcomes.
There could be either 0 green objects, or 1, or 2, or 3.
In this case, we indeed have 2 ranked the highest, with around 0.94 probability.
This matches our expectation where the object `1` and object `2` are most likely
to be of color green.

# Scallop as Python Library

The most exciting thing of Scallop is when it can be used with PyTorch, a
very popular machine learning framework.
But before that, we need to first get familiar with how to use Scallop inside
Python, by using our Python binding, `scallopy`.
Make sure you [follow the instruction](/download.html?scallopy) and let's jump
right in this following example.

## Hello World, Revisited

First, make sure you can import `scallopy` inside Python:

``` python
import scallopy
```

With this, we can now create a Scallop context where you can execute arbitrary
Scallop program within:

``` python
ctx = scallopy.ScallopContext()
```

Since we are recreating our "hello world" example with `scallopy`,
we first introduce a relation called `hello`:

``` python
ctx.add_relation("hello", str)
```

This line says that we want to add a relation into the context, with a name
`hello` and its type `str`.
Then, we can add simple fact into this context:

``` python
ctx.add_facts("hello", [("Hello World",)])
```

Here we are adding the list of tuples `[("Hello World",)]` into the relation
`"hello"`.
Note that we intentionally made that `"Hello World"` into a tuple by
`("Hello World",)` (pay attention to the comma near the end), because
`scallopy` only accepts tuple as fact.

Now, with a simple execution of the Scallop program context,

``` python
ctx.run()
```

we can obtain the final result

``` python
print(list(ctx.relation("hello")))
```

Here the `ctx.relation("hello")` obtains an iterator over tuples in the
relation `hello`.
We wrap it with a `list` and print the list.
You should obtain the result back:

```
[('Hello World',)]
```

## Probabilistic Digit Addition

This example will tell you how to associate probabilistic information
when using `scallopy`.
Let's imagine inside a learning application, there are two hand-written
digits ranging from 0 to 3, and the goal is to compute the most likely
sum of the two digits.
In such case, we write the following Python code:

``` python
import scallopy
import random

# Create a scallop context using the `topkproofs` provenance
ctx = scallopy.ScallopContext(provenance="topkproofs")

# Add a relation storing the possibilities for the first digit (0-3)
ctx.add_relation("digit_1", int)
ctx.add_facts("digit_1", [(random.random(), (i,)) for i in range(4)])

# Add a relation storing the possibilities for the second digit (0-3)
ctx.add_relation("digit_2", int)
ctx.add_facts("digit_2", [(random.random(), (i,)) for i in range(4)])

ctx.add_rule("sum_2(a + b) = digit_1(a), digit_2(b)")

# Run the scallop program
ctx.run()

# Get the results from relation sum_2
for prob, tup in ctx.relation("sum_2"):
  print(prob, tup)
```

The general usage is similar to our previous example.
However there are few important points to note:

- When initializing a `ScallopContext`, we added the `provenance="topkproofs"`
  option so that this Scallop context can help us do probabilistic reasoning.

- When inserting facts (tuples) into the relation, each tuple is now additionally
  wrapped with another tuple, where the first element is the probability of that
  tuple, and the second element is that tuple itself.
  (i.e. the arity-1 tuple `(i,)` now becomes a 2-tuple `(random.random(), (i,))`
  and the `random.random()` expression will create a random 0.0 to 1.0 value to
  represent a probability)

- We add a rule `sum_2(a + b) = digit_1(a), digit_2(b)` to the context.
  Note that we did not add a `rel` prefix here.

- Since we are using a probabilistic provenance here, all the resulting tuple
  will also be associated with a probability, in a similar format as our input
  tuples: `(probability, tuple)`.
  Therefore when we are iterating through `ctx.relation("sum_2")` we can
  decompose each element into `prob` and `tup`, and print them individually.

After running the above program, we should see something like the following:

``` python
0.08434000433501627 (0,)
0.21680020593483537 (1,)
0.2357574207282053 (2,)
0.510827111694817 (3,)
0.5148603492582838 (4,)
0.3488522080940467 (5,)
0.4995156659539793 (6,)
```

You can see that since the two digits are both ranging from 0 to 3, the
summation of the two will be ranging from 0 to 6.
Now, not only do we get the result, we also get the probabilities associated
with the result (e.g. the sum is `0` with 0.084 probability).

# MNIST Sum2 Experiment with Scallop

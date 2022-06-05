# Bootcamp

Here are a few interesting Scallop program that you can tackle.
We will only provide you vague directions and initial sample code.
But the problem themselves are pretty open-ended, so it really depends on how far you want to push them.
Hopefully, you will get to know the expressiveness of Datalog and Scallop in general.
Have fun!

## 1. Type Inference

Here is a piece of starter code in Scallop for a simply typed language.
Associated with it there is a small program `let x = 3 in x + 4` encoded as Scallop facts.
Try achieve the following:

- Make sense of the relations and be able to encode a few other program using facts
- Finish the definition for the `type_of` relation. At the end, it should produce the example output!
  - Make sure your `type_of` definition handles the variable shadowing!
- Add more language constructs such as function declaration and function application!
  - And add new `type_of` definition to support that!
  - See if you can allow recursive function and even mutual recursive function to be defined!
- Can you write an evaluator for this simple language in Scallop?
  - With functions and recursive functions?

``` scl
// EXP ::= let V = EXP in EXP
//       | if EXP then EXP else EXP
//       | X + Y | X - Y
//       | X and Y | X or Y | not X
//       | X == Y | X != Y | X < Y | X <= Y | X > Y | X >= Y

// Basic syntax constructs
type number(usize, i32)
type boolean(usize, bool)
type variable(usize, String)
type bexp(usize, String, usize, usize)
type aexp(usize, String, usize, usize)
type let_in(usize, String, usize, usize)
type if_then_else(usize, usize, usize, usize)

// Comparison operations
rel comparison_op = {"==", "!=", ">=", "<=", ">", "<"}
rel logical_op = {"&&", "||", "^"}
rel arith_op = {"+", "-", "*", "/"}

// A program with number 0-4 denoting sub-expression ID
//   let x = 3 in x >= 4
//   -------------------0
//           -1   ------2
//                -3   -4
rel let_in = {(0, "x", 1, 2)}
rel number = {(1, 3), (4, 4)}
rel bexp = {(2, ">=", 3, 4)}
rel variable = {(3, "x")}

// Type Inference:

// - Base case
rel type_of(x, "bool") = boolean(x, _)
rel type_of(x, "int") = number(x, _)
// TODO: Fill in the rest! You will probably need to define other relation to hold the environment variable type too!

query type_of
```

Example output:

```
type_of: {(0, "bool"), (1, "int"), (2, "bool"), (3, "int"), (4, "int")}
```

## 2. Formula Parser

![hwf](/img/hwf/banner.png)

In this example, we encode a probabilistic formula using the following two relations `symbol` and `length`.
The `symbol` relation maps the index of the symbol to its actual `String` symbol (from one of `0`-`9`, `+`, `-`, `*`, `/`).
The `length` relation stores the length of this formula.

In the following Scallop code we encoded a formula of length 3, and therefore it contains a sequence of 3 symbols.
The first symbol could be `1`, `4`, and `/` with their respective probability, and the other symbols follow.
Obviously, the formula represents `1 * 8` the most likely and therefore the most likely result should be `8`.

Please try to write a Parser that can take in these two relations as input and output all possible parse trees.
Make sure you take the precedence level of `+-` and `*/` into consideration.
Then, try to write an evaluator that can actually compute the floating point result from each parse tree.

> Note:
> Here are things that you might or might not need:
> 1) a hand-crafted "hash" function,
> 2) you probably don't need negation or aggregation.

``` scl
// Inputs
type symbol(i32, String)
type length(i32)

// Facts for lexing
rel digit = {("0", 0.0), ("1", 1.0), ("2", 2.0), ("3", 3.0), ("4", 4.0), ("5", 5.0), ("6", 6.0), ("7", 7.0), ("8", 8.0), ("9", 9.0)}
rel mult_div = {"*", "/"}
rel plus_minus = {"+", "-"}

// Example Formula
rel symbol = {
  0.9::(0, "1"), 0.05::(0, "4"), 0.05::(0, "/"),
  0.1::(1, "4"),  0.8::(1, "*"),  0.1::(1, "/"),
  0.2::(2, "2"),  0.7::(2, "8"),  0.1::(2, "/"),
}
rel length(3)

// The result should be a relation containing floating point numbers
type result(f32)
query result
```

Example output:

```
result: {0.063::(0.125), 0.018::(0.5), 0.144::(2), 0.504::(8), 0.0252::(32)}
```

## 3. Meta Datalog

![datalog_in_datalog](/img/summer_school/datalog_in_datalog.png)
![datalog_in_datalog_2](/img/summer_school/datalog_in_datalog_2.png)

For those of you who want to do more stuffs with Datalog,
it turns out you can actually encode Datalog program in Datalog (Scallop)!
The images above show how you can declare Datalog programs, coming from [this paper](https://creichen.net/papers/metadl.pdf).
Try to accomplish the following yourself:

- Understand the syntax and semantics for Datalog programs
- Understand our program encoding and manually encode another Datalog program
- Write an analysis that checks the consistency of the arity of each predicate
- Compute dependency graph of your Datalog program
- Extend the definition and allow for negative atoms in a rule
  - Check if there is unbound variable: a variable cannot be bounded solely by a negative atom
  - Compute dependency with their positive/negative property
  - Check if the program is stratified: no dependency cycle can contain negative edge
- Add type to the predicates and write a type checker for Datalog program
  - You can draw some inspiration from our first bootcamp problem!
- Can you write an interpreter for Datalog in Scallop?

The following is a piece of sample code that you can start from.
Note that it has a slightly different encoding than the one shown on the picture.

``` scl
type RuleID <: usize
type AtomListID <: usize
type AtomID <: usize
type VarListID <: usize
type VarID <: usize

type rule(RuleID, AtomID, AtomListID)
type atom_list(AtomListID, usize, AtomID)
type atom(AtomID, String, VarListID)
type var_list(VarListID, usize, VarID)
type var(VarID, String)

// Rule 1: path(a, b) :- edge(a, b)
rel rule = {(0, 0, 0)}
rel atom_list = {(0, 0, 1)}
rel atom = {(0, "path", 0), (1, "edge", 1)}
rel var_list = {(0, 0, 0), (0, 1, 1), (1, 0, 2), (1, 1, 3)}
rel var = {(0, "a"), (1, "b"), (2, "a"), (3, "b")}

// Rule 2: path(a, b) :- path(a, c), edge(c, b)
rel rule = {(1, 2, 1)}
rel atom_list = {(1, 0, 3), (1, 1, 4)}
rel atom = {(2, "path", 2), (3, "path", 3), (4, "edge", 4)}
rel var_list = {(2, 0, 4), (2, 1, 5), (3, 0, 6), (3, 1, 7), (4, 0, 8), (4, 1, 9)}
rel var = {(4, "a"), (5, "b"), (6, "a"), (7, "c"), (8, "c"), (9, "b")}
```

## 4. Music Theory

![circle_of_fifths](/img/summer_school/circle_of_fifth.svg)

This is an exercise that people who are into music theory can try out!
As you can see in the example, we can use relations to define `half_step` as our basis for reasoning about notes.
After that, we can gradually define `whole_step`, `lower`, `minor_third`, and so on.
The relations shown right here are just the most basic.
To advance further, try to define relations and accomplish the following:

- Define scales and modes
  - In Ionian, Dorian, Phrygian, and Lydian
- Find all major 7 and 9 chords
- Define circle of fifths (as shown in the above picture!)
- See if you can come up with chord sequences and resolution using relations and rules!

It certainly does not stop here, musicians!
See if you can encode some of your favorite chord progressions!

``` scl
rel half_step = {
  ("A", "Bb"),
  ("Bb", "B"),
  ("B", "C"),
  ("C", "Db"),
  ("Db", "D"),
  ("D", "Eb"),
  ("Eb", "E"),
  ("E", "F"),
  ("F", "Gb"),
  ("Gb", "G"),
  ("G", "Ab"),
  ("Ab", "A"),
}

rel accidental = {"Bb", "Db", "Eb", "Gb", "Ab"}

type whole_step(String, String)
type lower(String, String)

type minor_third(String, String)
type major_third(String, String)
type major_fourth(String, String)
type major_fifth(String, String)
```

## 5. How Many Yellow Objects?

![clevr](/img/clevr/CLEVR_train_000013.png)

In this task you are going to let neural networks to learn to recognize yellow objects,
just by telling them how many yellow objects are there in the scene.
We will provide you with [the data](#) and a `Dataset` class so that you can load the data.
Then, please try to setup and train neural network with Scallop within the training loop
to do the logical counting.
For example, the image above should have only 1 yellow object.

``` scl
number_of_yellow_objs(n) :- n = count(o: obj_color(o, "yellow"))
```

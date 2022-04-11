# Getting Started

Scallop is a neuro-symbolic programming language based on Datalog.
You can use it simply as discrete Datalog, and can also use it as
probabilistic Datalog or even differentiable Datalog.
We currently provide three ways to interact with Scallop:

- Scallop Interpreter `scli` [(download)](/download.html#scli).
  This interpreter can be run as a command-line program.
  `scli` accepts a `.scl` file which is executed to produce the
  reasoning result.
  This version of Scallop supports discrete reasoning and probabilistic
  reasoning.

- Scallop REPL `sclrepl` [(download)](/download.html#sclrepl).
  This interpreter can be run in an interactive shell environment and is
  suitable for demo purposes.
  Similar to `scli`, this version of Scallop supports discrete reasoning
  and probabilistic reasoning.

- Python Binding `scallopy` [(download)](/download.html#scallopy).
  This is a Python binding for Scallop, which allows you to run Scallop
  in a native Python environment.
  In addition to supporting discrete and probabilistic reasoning, this
  Python library includes PyTorch support and enables differentiable
  reasoning.
  You can integrate Scallop modules with your PyTorch machine learning
  pipelines.

We will start by introducing how to write your first `.scl` file and run
it with `scli`.
After that, we will dive into how to use Scallop as a Python library and
apply it to some simple learning tasks.

# Hello World in Scallop

Let's write a very simple "Hello World" program in Scallop.
Create a new file named `hello.scl` with the following code:

``` scl
// hello.scl
rel hello = {"Hello World"}
```

In this program, we defined a relation `hello` that is a set of strings,
though there is only one string in this set, `"Hello World"`.
Also, note that Scallop allows comments starting with `//`,
just like C and Java.
Now, run your downloaded `scli` executable inside a terminal as follows:

```
$ scli hello.scl
```

The execution result should show the following, which reflects the occurrence
of a relation named `hello` that contains only one string `"Hello World"`.
Note that the string is wrapped in parentheses since internally every relation
in Scallop stores *tuples* of simple values.
In this case, `hello` is an *arity-1* relation (all the tuples in this relation
are of size 1), and it contains a single tuple.
We call each tuple a **fact**.

```
hello: {("Hello World")}
```

# Scallop by Example

We now demonstrate Scallop using a few examples.

## Parent and Grandparent

Scallop is a full-fledged logic programming language based on Datalog.
Here is a traditional relational logic program expressed in Datalog:

``` scl
rel parent = {
  ("Emily", "Bob"), // Emily is Bob's parent
  ("Bob", "Alice"), // Bob is Alice's parent
}

rel grandparent(a, c) = parent(a, b), parent(b, c)

query grandparent // {("Emily", "Alice")}
```

The first four lines, just like your first Scallop program, define a relation
called `parent`.
Now, `parent` is an arity-2 relation since every tuple in this relation
contains two elements -- more specifically, two strings.
As the comments indicate, the relation `parent` contains two tuples.
The first one encodes "Emily is Bob's parent" and the second one encodes
"Bob is Alice's parent".
The second item in this program is what we call a **rule** in Scallop.
We read the rule from right to left as

> If `a` is `b`'s parent, and `b` is `c`'s parent, then `a` is `c`'s grandparent.

The rule introduced a new relation `grandparent` which will also
be an arity-2 relation.
The last line of the program queries the tuples in the relation
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
In Scallop, we encode this sequence as an arity-2 relation where the first
element in the tuple represents the "index" of the number and the second element
represents that number.
We thereby set out by defining the `fib` relation with a base set of tuples
`(0, 1)` and `(1, 1)`.

The Fibonacci Sequence is an infinite sequence that can expand indefinitely.
We encode this recursive rule as the second item in the program.
To get the `x`-th fib number, we need to first compute the `(x - 1)`-th
and also the `(x - 2)`-th fib numbers, denoted by `a` and `b`.
Then, the `x`-th fib number is simply `a + b`.
You might have noticed that we have included `x < 10` in the rule; this is because
we want the program to terminate and not compute the infinite sequence.

At the end, we query `fib` with the index `8`, meaning that we want to compute
the 8-th fib number.
Executing `scli` on this program will yield `fib(8, y): {(8, 34)}` -- that is,
the 8-th fib number is 34.

## Would the Alarm Go Off?

Scallop can be used to reason about probabilistic events.
The following classical probabilistic reasoning example shows how to use Scallop
to calculate the resulting probability of whether there will be an alarm:

``` scl
// alarm-2.scl
// earthquake happens with 0.01 probability
rel 0.01::earthquake()

// burglary happens with 0.12 probability
rel 0.12::burglary()

// alarm goes off when either earthquake or burglary happens
rel alarm() = earthquake() or burglary()

query alarm
```

Here, we introduced new syntax for defining facts (`rel earthquake()`).
When we associate a floating point in front of a fact, we are associating a
probability with this fact being happening.

Executing this file as before will produce the result `alarm: {()}`.
Scallop performs probabilistic reasoning by using a particular form of
**provenance** which is enabled via the command:

```
$ scli alarm-2.scl --provenance topkproofs
```

which yields the desired result suggesting that the `alarm` will go off with `0.1288` probability:

```
alarm: {0.1288::()}
```

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
Make sure you first [follow the instruction](/download.html?scallopy) to
install `scallopy` in your Python environment.

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

## Learning MNIST Sum-2

The most exciting thing about Scallop is that it is a Neuro-symbolic
programming language that can be easily integrated with popular machine
learning libraries such as [PyTorch](https://pytorch.org/).
In the following example, we will demonstrate how to create a very simple
experiment that will learn to recognize hand-written digits (MNIST digits)
with the only supervision being the sum of two digits.
We have already seen a part of this experiment in our previous example.
Now, let's make it into a full fledged learning pipeline!

<div class="center flex">
  <img src="/img/mnist/mnist_2.png" width="40px" />
  <div style="font-size: 36px">+</div>
  <img src="/img/mnist/mnist_5.png" width="50px" />
  <div style="font-size: 36px">= 7</div>
</div>

Before we dive in, please be informed that we provide the full
version of this Python program [`sum_2.py`](/examples/sum_2.py).
The file includes the construction of a `Sum2` dataset from normal
MNIST dataset, constructing the `Dataloader`, the `Trainer`, and
of course, the model `MNISTSum2Net`.
The whole file only contains 200+ lines of code.
Before running it, please make sure that you have the following
prerequisites installed:

- `scallopy`
- `torch`
- `torchvision`
- `tqdm`

The first step to create a model that recognizes MNIST digit is to create
a Convolutional Neural Network (CNN) based digit recognition model.
The following is a text-book implementation of such a digit recognition model:

``` python
class MNISTNet(nn.Module):
  def __init__(self):
    super(MNISTNet, self).__init__()
    self.conv1 = nn.Conv2d(1, 32, kernel_size=5)
    self.conv2 = nn.Conv2d(32, 64, kernel_size=5)
    self.fc1 = nn.Linear(1024, 1024)
    self.fc2 = nn.Linear(1024, 10)

  def forward(self, x):
    x = F.max_pool2d(self.conv1(x), 2)
    x = F.max_pool2d(self.conv2(x), 2)
    x = x.view(-1, 1024)
    x = F.relu(self.fc1(x))
    x = F.dropout(x, p = 0.5, training=self.training)
    x = self.fc2(x)
    return F.softmax(x, dim=1)
```

Then, it's time to create our core model `MNISTSum2Net`.
Usually, when defining a module inside PyTorch one would implement two
member functions: the constructor and the `forward` function.
Let's start with the constructor first:

``` python
class MNISTSum2Net(nn.Module):
  def __init__(self):
    super(MNISTSum2Net, self).__init__()

    # MNIST Digit Recognition Network
    self.mnist_net = MNISTNet()

    # Scallop Context
    self.scl_ctx = scallopy.ScallopContext(provenance="difftopkproofs")
    self.scl_ctx.add_relation("digit_1", (int,), input_mapping=[(i,) for i in range(10)])
    self.scl_ctx.add_relation("digit_2", (int,), input_mapping=[(i,) for i in range(10)])
    self.scl_ctx.add_rule("sum_2(a + b) :- digit_1(a), digit_2(b)")

    # The `sum_2` logical reasoning module
    self.sum_2 = self.scl_ctx.forward_function("sum_2", output_mapping=[(i,) for i in range(19)])
```

The first component of our `MNISTSum2Net` is just our MNIST digit
recognition network `MNISTNet`.
Then, we come to include a Scallop context within our network.
Note that when providing the `provenance`, we will use the `"difftopkproofs"`
provenance.
This is the differentiable version of the `"topkproofs"` provenance we used
in the previous examples.

Similar to before, we add two relations `digit_1` and `digit_2`.
They are both arity-1 relation with the only element being an `int`.
This time, however, we also tell our context that there is an `input_mapping`
to this relation.
This is because when interacting with PyTorch, probabilities are usually stored
in high-dimensional tensors.
We want to map each element inside this tensor to a symbolic tuple in scallop.
In our case, since each digit will be predicted to be 0 to 9, we will have a
size 10 tensor representing the distribution.
The first element of this tensor will represent the probability for tuple `(0,)`,
and the second element will represent that of `(1,)`,
so on and so forth.

After adding the rule just like our previous example,
we compose a **Forward Function** from this Scallop context.
The forward function encodes the output we want to get from Scallop:
we want the symbols being computed in the relation `sum_2`,
and we want to vectorize the output probabilities with an `output_mapping`.
That is, when we get the probability for an outcome, say `(0,)`, we want to put it
at the first position inside of a size 19 tensor.
Similarly a tuple `(18,)` will be put at the last position.
We have the magic-number 19 here because if we have the two digits recognized as
0 to 9, the sum of the two will be ranging from 0 to 18, hence the 19 output elements.

Lastly, let's look at the `forward` function of our module:

``` python
# MNISTSum2Net.forward
def forward(self, x: Tuple[torch.Tensor, torch.Tensor]):
  (a_imgs, b_imgs) = x

  # First recognize the two digits
  a_distrs = self.mnist_net(a_imgs) # Tensor 64 x 10
  b_distrs = self.mnist_net(b_imgs) # Tensor 64 x 10

  # Then execute the reasoning module; the result is a size 19 tensor
  return self.sum_2(digit_1=a_distrs, digit_2=b_distrs) # Tensor 64 x 19
```

Here, our forward function is used for computing the result of the sum of two
hand-written digits.
In our case, each input image is a size `(1, 27, 27)` tensor:
the first 1 is the number of color channels (since we only have black and white
hand-written digit),
and the second and third 27 are the width and height of each image.
When used in a learning setting, the input is usually batched.
Assuming a batch size of 64, we would have the image tensors
being of size `(64, 1, 27, 27)`.
Since the input to our network, `x`, contains two (batches of) images,
we decompose `x` into `a_imgs` and `b_imgs`, each of them being of size
`(64, 1, 27, 27)`.

We then apply our MNIST neural network to the two (batches of) images.
Each image will be recognized into a tensor of size 10 since we want a
distribution over probabilities of 0 to 9.
The resulting `a_distrs` and `b_distrs` will be of size `(64, 10)`:
the first dimension 64 is still our batch size, and the second dimension
10 represents the probability of 10 classes we classify each image into.

Lastly, we put the two distributions as relations `digit_1` and `digit_2`
into our Scallop forward function `sum_2`.
Internally, since we have a batch size of 64, Scallop will be executed 64
times to obtain the sum for each pair of input images.
This gives us our final result being size `(64, 19)` -- note that the second
dimension 19 represents the size of our output mapping.
The tensor can then be passed to any loss functions, such as
NLL loss, Binary Cross Entropy loss, and so on.

Now, the whole training loop is closed.
With a simple training script, we can train the whole pipeline comfortably.
Here is some training log you might see if you execute this file.
(The data is obtained on an Apple M1-Pro MacBook Pro, Late 2021)

```
[Test Epoch 0] Total loss: 16.5859, Accuracy: 417/5000 (8.34%): 100%|█████| 79/79 [00:04<00:00, 16.53it/s]
[Train Epoch 1] Loss: 0.0148: 100%|███████████████████████████████████████| 469/469 [00:43<00:00, 10.83it/s]
[Test Epoch 1] Total loss: 0.7494, Accuracy: 4841/5000 (96.82%): 100%|████| 79/79 [00:04<00:00, 16.63it/s]
[Train Epoch 2] Loss: 0.0274: 100%|███████████████████████████████████████| 469/469 [00:43<00:00, 10.86it/s]
[Test Epoch 2] Total loss: 0.5645, Accuracy: 4889/5000 (97.78%): 100%|████| 79/79 [00:04<00:00, 16.57it/s]
[Train Epoch 3] Loss: 0.0271: 100%|███████████████████████████████████████| 469/469 [00:43<00:00, 10.88it/s]
...
```

# More Applications

## MNIST

The second example we will go through is MNIST, a digit recognition task.
The task provides a set of handwritten digits, and we want to identify what are the numerical form of the digits.

<div>
  <img src="/img/summer_school/lab1/mnist_example.png" width="300"/>
</div>

#### Relations: Digit

We can represent the image with the relation, `digit`.

``` scl
type digit(usize, usize)
rel digit = {
    (0, 2),
    (1, 3),
    (2, 7)
}
```

#### Min and Max
Question: What is the minimum/maximum value among the digits?

We can identify the max and min value among the digits through `min` and `max`.
The syntax in Scallop is `r1(<arg>, <max_element>) = <max_element> = max[<arg>](<element>: r2(<arg>, <element>))`.

``` scl
type max_value(usize, usize)
type min_value(usize, usize)
rel max_value(i, max_val) = max_val = max[i](v: digit(i, v))
rel min_value(i, min_val) = min_val = min[i](v: digit(i, v))
```

#### Natives
We can use the natives such as `>`, `<`, `+`, `-`, `*`, `/` in Scallop.
Thus, we can use Scallop to answer a series of numerical calculation problems.

Question 1: What are the digits larger than 6?

``` scl
type larger_than_6(usize, usize)
rel larger_than_6(i, v) = digit(i, v), v > 6
```

Question 2: What is the sum of the three digits?

We can represent the result of summing up the three digits as a fourth argument in the relation `add3`, and use the native `+` operation to calculate the sum.

``` scl
type add3(usize, usize, usize, usize)
rel add3(i1, i2, i3, v1 + v2 + v3) = digit(i1, v1), digit(i2, v2), digit(i3, v3)
```

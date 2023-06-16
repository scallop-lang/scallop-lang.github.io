## Evaluating Hand-Written Formulae

In this task, we are given a sequence of hand-written symbols, including 0 to 9
and simple arithmetic operations.
The goal is to recognize the formula and evaluate the expression.
In the adjoining example, the input represents the formula 1 + 3 / 5, which
evaluates to 1.6.
One can craft a full context-free grammar parser in Scallop that can parse
probabilistic inputs.
A parser and evaluator for the above formulae can be written in just 5 lines
of Scallop code shown below.
This program can be trained in an end-to-end fashion with the neural model
for recognizing individual symbols.
Once trained, the resulting program will automatically find the most likely
formula and return the evaluated result.

``` scl
type symbol(index: usize, symbol: String)
type length(n: usize)

rel digit = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}

rel factor(x as f32, b, b + 1) = symbol(b, x) and digit(x)
rel mult_div(x, b, r) = factor(x, b, r)
rel mult_div(x * y, b, e) = mult_div(x, b, m) and symbol(m, "*") and factor(y, m + 1, e)
rel mult_div(x / y, b, e) = mult_div(x, b, m) and symbol(m, "/") and factor(y, m + 1, e)
rel add_minus(x, b, r) = mult_div(x, b, r)
rel add_minus(x + y, b, e) = add_minus(x, b, m) and symbol(m, "+") and mult_div(y, m + 1, e)
rel add_minus(x - y, b, e) = add_minus(x, b, m) and symbol(m, "-") and mult_div(y, m + 1, e)

rel result(y) = add_minus(y, 0, l) and length(l)
```

## Evaluating Hand-Written Formula

In this task, the model is given a sequence of hand-written symbols
including 0 to 9 and simple arithmetic operations.
The goal is to recognize the formula and evaluate the expression.
In this example, the input should be representing a formula 1 + 3 / 5 and
be evaluated to 1.6.
One can easily craft a full context-free grammar parser with Scallop
that can parse probabilistic inputs.
Our Scallop program will automatically find the most likely parse
and return the evaluated result.
Therefore the whole pipeline can be trained in an end-to-end fashion.

Here is how a probabilistic parser for this grammar can be written
in just 5 lines of Scallop code:

``` scl
rel value_node(x, v) = symbol(x, d), digit(d, v), length(n), x < n
rel mult_div_node(x, "v", x, x, x, x, x) = value_node(x, _)
rel mult_div_node(x, s, x, l, end, begin, end) = symbol(x, s), mult_div(s), symbol_id(s, sid), length(n), mult_div_node(l, _, _, _, _, begin, x - 1), value_node(end, _), end == x + 1
rel plus_minus_node(x, t, i, l, r, begin, end) = mult_div_node(x, t, i, l, r, begin, end)
rel plus_minus_node(x, s, x, l, r, begin, end) = symbol(x, s), plus_minus(s), symbol_id(s, sid), length(n), plus_minus_node(l, _, _, _, _, begin, x - 1), mult_div_node(r, _, _, _, _, x + 1, end)
```

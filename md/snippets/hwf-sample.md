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
// Node ID Hashing
@demand("bbbbf")
rel node_id_hash(x, s, l, r, x + sid * n + l * 4 * n + r * 4 * n * n) = symbol_id(s, sid), length(n)

// Parsing
rel value_node(x, v) = symbol(x, d), digit(d, v), length(n), x < n
rel mult_div_node(x, "", x, x, x, x, x) = value_node(x, _)
rel mult_div_node(h, s, x, l, end, begin, end) = symbol(x, s), mult_div(s), node_id_hash(x, s, l, end, h), mult_div_node(l, _, _, _, _, begin, x - 1), value_node(end, _), end == x + 1
rel plus_minus_node(x, t, i, l, r, begin, end) = mult_div_node(x, t, i, l, r, begin, end)
rel plus_minus_node(h, s, x, l, r, begin, end) = symbol(x, s), plus_minus(s), node_id_hash(x, s, l, r, h), plus_minus_node(l, _, _, _, _, begin, x - 1), mult_div_node(r, _, _, _, _, x + 1, end)

// Evaluate AST
rel eval(x, y, x, x) = value_node(x, y)
rel eval(x, y1 + y2, b, e) = plus_minus_node(x, "+", i, l, r, b, e), eval(l, y1, b, i - 1), eval(r, y2, i + 1, e)
rel eval(x, y1 - y2, b, e) = plus_minus_node(x, "-", i, l, r, b, e), eval(l, y1, b, i - 1), eval(r, y2, i + 1, e)
rel eval(x, y1 * y2, b, e) = mult_div_node(x, "*", i, l, r, b, e), eval(l, y1, b, i - 1), eval(r, y2, i + 1, e)
rel eval(x, y1 / y2, b, e) = mult_div_node(x, "/", i, l, r, b, e), eval(l, y1, b, i - 1), eval(r, y2, i + 1, e), y2 != 0.0
```

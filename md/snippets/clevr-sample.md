## [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/), Compositional Language and Elementary Visual Reasoning

This task concerns reasoning about simple 3D objects in a given image in order to
answer questions such as "how many objects are colored blue?".
To express this task in Scallop, we use neural components to generate a symbolic
representation of the image, in the form of a *scene graph*, as well as a
*programmatic query* to represent the question.  On the other hand, the reasoning
component specifies various operations such as selecting, comparing, and counting
objects with the specified attributes.
Scallop enables to integrate all of these components in a common framework
and perform training in an end-to-end fashion.

``` scl
type Color = RED | GREEN | BLUE
type Size = LARGE | SMALL
type Expr = Scene() | Color(Color, Expr) | Size(Size, Expr) | Count(Expr)

// Programmatic query evaluator
rel eval(e, output_obj) = case e is Scene(), input_obj_ids(output_obj)
rel eval(e, output_obj) = case e is Color(c, e1), eval(e1, output_obj), input_obj_color(output_obj, c)
rel eval(e, output_obj) = case e is Size(s, e1), eval(e1, output_obj), input_obj_size(output_obj, s)
rel eval_num(e, n) = n := count(o: eval(e1, o) where e1: case e is Count(e1))
rel result(n) = root(e) and eval_num(e, n)

// Scene Graph
rel input_obj_ids = {0, 1}
rel input_obj_color = {(0, RED), (1, GREEN)}
rel input_obj_size = {(0, LARGE), (1, SMALL)}

// Count how many large red objects
const MY_QUERY = Count(Color(RED, Size(LARGE, Scene())))
rel root(MY_QUERY)
```

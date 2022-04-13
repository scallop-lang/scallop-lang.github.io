## CLEVR, Compositional Language and Elementary Visual Reasoning

In [this task](https://cs.stanford.edu/people/jcjohns/clevr/), we seek to reason
about objects in a scene such as that in the adjoining image, in order to answer
questions such as "how many blue objects are there in the scene?".
Neural components are responsible for generating a symbolic representation of
the image, in the form of a *scene graph*, as well as a *programmatic query*
representing the question.
Scallop enables to integrate all of these components in a common framework
and perform training in an end-to-end fashion.

``` scl
// 3 objects in the scene; the first and the third are blue, and the second is red
rel obj = {0, 1, 2}
rel color = {(0, "blue"), (1, "red"), (2, "blue")}

// the programmatic query asks for the number of blue objects occurring in the scene
rel scene_expr = {0}
rel filter_color_expr = {(1, 0, "blue")}
rel count_expr = {(2, 1)}
rel root_expr = {2}
query num_result // query should return `(2)`
```

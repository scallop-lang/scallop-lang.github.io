import scallopy
import random

ctx = scallopy.ScallopContext(provenance="topkproofs")

# Add a relation storing the possibilities for the first digit
ctx.add_relation("digit_1", int)
ctx.add_facts("digit_1", [(random.random(), (i,)) for i in range(4)])

# Add a relation storing the possibilities for the second digit
ctx.add_relation("digit_2", int)
ctx.add_facts("digit_2", [(random.random(), (i,)) for i in range(4)])

ctx.add_rule("sum_2(a + b) = digit_1(a), digit_2(b)")

# Run the scallop program
ctx.run()

# Get the results from relation sum_2
for prob, tup in ctx.relation("sum_2"):
  print(prob, tup)

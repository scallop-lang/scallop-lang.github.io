import scallopy

ctx = scallopy.ScallopContext()

# Setup the context by adding relations and facts
ctx.add_relation("hello", str)
ctx.add_facts("hello", [("Hello World",)])

# Run the scallop program
ctx.run()

# Print the result
print(list(ctx.relation("hello")))

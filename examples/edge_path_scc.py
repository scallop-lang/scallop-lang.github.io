import scallopy

ctx = scallopy.ScallopContext()

ctx.add_relation("node", int)
ctx.add_relation("edge", (int, int))
ctx.add_relation("path", (int, int))
ctx.add_relation("scc", (int, int))

ctx.add_facts("node", [(0,), (1,), (2,), (3,), (4,)])
ctx.add_facts("edge", [(0, 2), (2, 1), (1, 0), (0, 3), (3, 4)])

ctx.add_rule("path(a, c) = edge(a, c) or (edge(a, b) and path(b, c))")

ctx.run()
print("path:", list(ctx.relation("path")))

ctx.add_rule("scc(a, a) = node(a)")
ctx.add_rule("scc(a, b) = path(a, b) and path(b, a)")

ctx.run()
print("scc:", list(ctx.relation("scc")))

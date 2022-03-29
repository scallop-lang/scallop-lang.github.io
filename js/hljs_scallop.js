/*! `Scallop` grammar compiled for Highlight.js 11.5.0 */
(() => {
  var e = (() => {
    "use strict"; return e => {
      const n = {
        keyword: ["import", "type", "input", "rel", "relation", "query", "if", "then", "else"],
        type: [
          "i8", "i16", "i32", "i64", "i128", "isize",
          "u8", "u16", "u32", "u64", "u128", "usize",
          "f32", "f64", "bool", "char",
          "&str", "String", "Rc<String>",
        ],
        literal: ["true", "false"],
        built_in: ["count", "sum", "prod", "min", "max", "exists", "unique"]
      }; return {
        name: "Scallop",
        aliases: ["scl", "scallop"],
        keywords: n,
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          {
            className: "string",
            variants: [
              e.QUOTE_STRING_MODE,
            ]
          },
          {
            className: "number", variants: [
              {
                begin: e.C_NUMBER_RE + "[i]", relevance: 1
              },
              e.C_NUMBER_MODE
            ]
          }
        ]
      }
    }
  })();
  hljs.registerLanguage("scl", e)
})();

import * as monaco from "monaco-editor";

export const llvmIrLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: ";",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
};

export const llvmIrTokensProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".ll",

  keywords: [
    "define",
    "declare",
    "target",
    "datalayout",
    "triple",
    "attributes",
    "module",
    "source_filename",
    "global",
    "constant",
    "private",
    "internal",
    "external",
    "linkonce",
    "weak",
    "type",
    "null",
    "undef",
    "to",
    "tail",
    "align",
    "addrspace",
    "section",
    "alias",
    "unnamed_addr",
    "personality",
    "noundef",
  ],

  types: [
    "void",
    "i1",
    "i8",
    "i16",
    "i32",
    "i64",
    "i128",
    "float",
    "double",
    "fp128",
    "x86_fp80",
    "label",
    "metadata",
  ],

  instructions: [
    "add",
    "sub",
    "mul",
    "udiv",
    "sdiv",
    "urem",
    "srem",
    "shl",
    "lshr",
    "ashr",
    "and",
    "or",
    "xor",
    "alloca",
    "load",
    "store",
    "getelementptr",
    "icmp",
    "fcmp",
    "br",
    "switch",
    "call",
    "ret",
    "phi",
    "select",
    "bitcast",
    "trunc",
    "zext",
    "sext",
    "fptrunc",
    "fpext",
    "fptoui",
    "fptosi",
    "uitofp",
    "sitofp",
    "ptrtoint",
    "inttoptr",
    "addrspacecast",
  ],

  operators: ["=", "->", "*", "&"],

  symbols: /[=><!~?,:&|+\-*\\/^%]+/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[%@!]?[a-zA-Z_][a-zA-Z0-9._-]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@types": "type",
            "@instructions": "keyword.operator",
            "@default": "identifier",
          },
        },
      ],

      // Labels
      [/^[a-zA-Z$._][\w$._-]*:/, "type.identifier"],

      // Constants
      [/\d+/, "number"],
      [/0x[0-9A-Fa-f]+/, "number.hex"],

      // Comments
      [/;.*/, "comment"],

      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // Non-terminated string
      [/"/, { token: "string.quote", next: "@string" }],

      // Operators and punctuation
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      [/[{}()[\],]/, "@brackets"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", next: "@pop" }],
    ],
  },
};

import * as monaco from "monaco-editor";

export const wrenLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["begin", "end"],
    ["then", "end"],
    ["do", "end"],
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const wrenTokensProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".wren",

  keywords: [
    "func",
    "begin",
    "end",
    "program",
    "is",
    "has",
    "do",
    "if",
    "then",
    "else",
    "while",
    "for",
    "return",
    "var",
    "skip",
    "stop",
    "not",
    "write",
    "read",
  ],
  types: ["void", "integer", "float", "string", "boolean"],

  operators: [
    "=",
    "<",
    ">",
    "not",
    ":",
    "==",
    "<=",
    ">=",
    "<>",
    "and",
    "or",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "%",
  ],

  symbols: /[=><:+\-*\\/\\%]+/,

  tokenizer: {
    root: [
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@types": "type",
            "@default": "identifier",
          },
        },
      ],

      { include: "@whitespace" },

      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

      [/\d+/, "number"],
      [/\btrue\b/, "true"],
      [/\bfalse\b/, "false"],

      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", next: "@string" }],

      // Punctuation
      [/[{}()\\[\]]/, "@brackets"],
      [/[;,]/, "delimiter"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", next: "@pop" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\/.*$/, "comment"],
      [/\/\*.*\*\//, "comment"],
    ],
  },
};

export const WrenStudioTheme: monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "#a390ff" }, // Purple for keywords
    { token: "number", foreground: "#7ad9fb" }, // Cyan for numbers
    { token: "string", foreground: "#bfd084" }, // Soft green for strings
    { token: "comment", foreground: "#6f6f6f", fontStyle: "italic" }, // Gray with italics for comments
    { token: "type", foreground: "#779ceb" }, // Light green for types
    { token: "operator", foreground: "#b3e8b4" }, // Light teal for operators
    { token: "identifier", foreground: "#ffffff" }, // White for identifiers
    { token: "custom-token", foreground: "#e5a1c2", fontStyle: "bold" }, // Soft pink for custom tokens
  ],

  colors: {
    "editor.background": "#121721", // Dark background
    "editor.foreground": "#e5e5e5", // Light gray text
    "editor.lineHighlightBackground": "#e5e5e51f", // Subtle highlight for current line
    "editorCursor.foreground": "#a390ff", // Purple cursor
    "editor.selectionBackground": "#6f6f6f7f", // Grayish selection background
    "editor.inactiveSelectionBackground": "#6f6f6f3f", // Faded selection background
    "editorIndentGuide.background": "#404040", // Subtle indent guide
    "editor.selectionHighlightBorder": "#00000000", // No border for selection highlight
    "editorLineNumber.foreground": "#858585", // Dim gray for line numbers
    "editorLineNumber.activeForeground": "#c6c6c6", // Bright gray for active line number
  },
};

export const WrenStudioLightTheme: monaco.editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "#7b3fe4" }, // Darker purple for keywords
    { token: "number", foreground: "#098658" }, // Dark green for numbers
    { token: "string", foreground: "#a31515" }, // Dark red for strings
    { token: "comment", foreground: "#008000", fontStyle: "italic" }, // Green for comments
    { token: "type", foreground: "#267f99" }, // Blue for types
    { token: "operator", foreground: "#000000" }, // Black for operators
    { token: "identifier", foreground: "#000000" }, // Black for identifiers
    { token: "custom-token", foreground: "#9b1d1d", fontStyle: "bold" }, // Dark red for custom tokens
  ],
  colors: {
    "editor.background": "#98a7c8", // White background
    "editor.foreground": "#000000", // Black text
    "editor.lineHighlightBackground": "#0000000f", // Subtle highlight for current line
    "editorCursor.foreground": "#000000", // Black cursor
    "editor.selectionBackground": "#add6ff", // Light blue selection background
    "editor.inactiveSelectionBackground": "#e5ebf1", // Light gray selection background
    "editorIndentGuide.background": "#d3d3d3", // Light gray indent guide
    "editor.selectionHighlightBorder": "#00000000", // No border for selection highlight
    "editorLineNumber.foreground": "#858585", // Gray for line numbers
    "editorLineNumber.activeForeground": "#000000", // Black for active line number
  },
};

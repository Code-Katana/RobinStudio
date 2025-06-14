import { AbstractSyntaxTree } from "@renderer/components/abstract-syntax-tree";
import { useMemo } from "react";
// import { useLanguageClient } from "@renderer/hooks/use-languageclient";
// import { TreeNode } from "@renderer/types";
// import { ParserOptions } from "@shared/types";

// type AstResponse = {
//   ast: TreeNode;
//   parserOption: ParserOptions;
// };

export const AstPanel = () => {
  const tree = {
    name: "Source",
    attribute: {
      location: "line: 1, col: 0 - line: 6, col: 81",
    },
    children: [
      {
        name: "ProgramDefinition",
        attributes: { globals: "[1 Globals]", location: "line: 1, col: 0 - line: 5, col: 80" },
        children: [
          {
            children: [
              {
                attributes: { location: "line: 1, col: 8 - line: 1, col: 12", varname: "main" },
                name: "Identifier",
              },
            ],
            name: "programName",
          },
          {
            children: [
              {
                attributes: {
                  location: "line: 2, col: 17 - line: 2, col: 44",
                  type: "initialization",
                },
                children: [
                  {
                    children: [
                      {
                        attributes: {
                          location: "line: 2, col: 21 - line: 2, col: 25",
                          varname: "name",
                        },
                        name: "Identifier",
                      },
                    ],
                    name: "identifier",
                  },
                  {
                    children: [
                      {
                        attributes: {
                          location: "line: 2, col: 36 - line: 2, col: 43",
                          value: "Robin",
                        },
                        name: "StringLiteral",
                      },
                    ],
                    name: "initializer",
                  },
                  {
                    children: [
                      {
                        attributes: {
                          location: "line: 2, col: 27 - line: 2, col: 33",
                          type: "string",
                        },
                        name: "PrimitiveDataType",
                      },
                    ],
                    name: "datatype",
                  },
                ],
                name: "VariableDefinition",
              },
            ],
            name: "globals",
          },
          {
            children: [
              {
                attributes: {
                  arguments: "[1 Arguments]",
                  location: "line: 4, col: 52 - line: 4, col: 75",
                },
                children: [
                  {
                    children: [
                      {
                        attributes: {
                          location: "line: 4, col: 58 - line: 4, col: 74",
                          operator: "+",
                        },
                        children: [
                          {
                            children: [
                              {
                                attributes: {
                                  location: "line: 4, col: 58 - line: 4, col: 67",
                                  value: "Hello, ",
                                },
                                children: [],
                                name: "StringLiteral",
                              },
                            ],
                            name: "left",
                          },
                          {
                            children: [
                              {
                                attributes: {
                                  location: "line: 4, col: 70 - line: 4, col: 74",
                                  varname: "name",
                                },
                                children: [],
                                name: "Identifier",
                              },
                            ],
                            name: "right",
                          },
                        ],
                        name: "AdditiveExpression",
                      },
                    ],
                    name: "arguments",
                  },
                ],
                name: "WriteStatement",
              },
            ],
            name: "body",
          },
        ],
      },
      {
        name: "functions",
        children: [],
      },
    ],
  };

  const Component = useMemo(() => {
    return <AbstractSyntaxTree tree={tree} />;
  }, []);

  // const response = useLanguageClient("parseAst");

  // if (!response) {
  //   return <div>No response</div>;
  // }

  // const result = response.result as AstResponse;

  return <div>{Component}</div>;
};

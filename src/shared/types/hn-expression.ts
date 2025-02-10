export type HnNode = {
  name: string;
  type: string;
  path: string;
  size?: number;
};

export type HnExpressionNode = [HnNode, HnExpressionNode[]?];

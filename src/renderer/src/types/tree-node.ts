export type TreeNode = {
  name: string;
  type?: string;
  attributes?: Record<string, string | number | boolean>;
  children?: TreeNode[];
};

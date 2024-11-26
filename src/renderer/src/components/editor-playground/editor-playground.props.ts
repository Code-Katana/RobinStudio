export interface IEditorPlaygroundProps {
  source: string;
  onChange: (code: string | undefined) => void;
}

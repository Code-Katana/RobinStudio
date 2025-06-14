import { TokensTable } from "@renderer/components/tokens-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";
import { ScannerOptions, Token } from "@shared/types";

type TokenizeResponse = {
  tokens: Token[];
  tokenCount: number;
};

export const TokensPanel: React.FC = () => {
  const response = useLanguageClient("compilerAction/tokenize");

  if (!response) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          No tokens to display yet. Run the tokenizer first.
        </div>
      </div>
    );
  }

  const result = response.result as TokenizeResponse;

  if (!result || !result.tokens) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Failed to load tokens. Please try again.
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="hand-coded" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary">
        <TabsTrigger value="hand-coded">Hand-coded</TabsTrigger>
        <TabsTrigger value="finite-automata">Finite Automata</TabsTrigger>
      </TabsList>
      <TabsContent value="hand-coded">
        <TokensTable tokens={result.tokens} scannerOption={ScannerOptions.HandCoded} />
      </TabsContent>
      <TabsContent value="finite-automata">
        <TokensTable tokens={result.tokens} scannerOption={ScannerOptions.FA} />
      </TabsContent>
    </Tabs>
  );
};

import { TokensTable } from "@renderer/components/tokens-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useLanguageClient } from "@renderer/hooks/use-languageclient";
import { ScannerOptions, Token } from "@shared/types";

type TokenizeResponse = {
  tokens: Token[];
  tokenCount: number;
};

export const TokensPanel: React.FC = () => {
  const response = useLanguageClient("tokenize");

  if (!response) {
    return null;
  }

  const { tokens } = response.result as TokenizeResponse;
  console.log(tokens);

  // return <TokensTable tokens={tokens} />;
  return (
    <Tabs defaultValue="hand-coded" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary">
        <TabsTrigger value="hand-coded">Hand-coded</TabsTrigger>
        <TabsTrigger value="finite-automata">Finite Automata</TabsTrigger>
      </TabsList>
      <TabsContent value="hand-coded">
        <TokensTable tokens={tokens} scannerOption={ScannerOptions.HandCoded} />
      </TabsContent>
      <TabsContent value="finite-automata">
        <TokensTable tokens={tokens} scannerOption={ScannerOptions.FA} />
      </TabsContent>
    </Tabs>
  );
};

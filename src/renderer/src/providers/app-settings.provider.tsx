import { ParserOptions, ScannerOptions } from "@shared/types";
import { createContext, useState } from "react";

type DirectionType = "horizontal" | "vertical";

export type AppSettingsContextType = {
  direction: DirectionType;
  scannerOption: ScannerOptions;
  parserOption: ParserOptions;
  setDirection: (dir: DirectionType) => void;
  setScannerOption: (opt: ScannerOptions) => void;
  setParserOption: (opt: ParserOptions) => void;
};

export const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, _setDirection] = useState<DirectionType>("horizontal");
  const [scannerOption, _setScannerOption] = useState<ScannerOptions>(ScannerOptions.FA);
  const [parserOption, _setParserOption] = useState<ParserOptions>(ParserOptions.RecursiveDecent);

  function setDirection(dir: DirectionType) {
    _setDirection(dir);
  }

  function setScannerOption(opt: ScannerOptions) {
    _setScannerOption(opt);
  }

  function setParserOption(opt: ParserOptions) {
    _setParserOption(opt);
  }

  return (
    <AppSettingsContext.Provider
      value={{
        direction,
        scannerOption,
        parserOption,
        setDirection,
        setScannerOption,
        setParserOption,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

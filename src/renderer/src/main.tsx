import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { loader } from "@monaco-editor/react";
import App from "./App";
import { AppProviders } from "./providers";

loader.config({
  paths: {
    vs: "app-asset://wren-studio/node_modules/monaco-editor/min/vs",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);

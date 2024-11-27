import { WrenLang } from "./wren-lang";
import { BrowserWindowActions } from "./browser-window-actions";

export const Channels = {
  WrenLang,
  BrowserWindowActions,
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];

import { useState } from "react";

type useToggleIconStateParams = {
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  initialState?: boolean;
};

type ToggleIconState = {
  isActive: boolean;
  icon: JSX.Element;
  toggle: () => void;
};

export const useToggleIconState = (params: useToggleIconStateParams): ToggleIconState => {
  const [isActive, setIsActive] = useState<boolean>(params.initialState || false);

  const icon = isActive ? params.activeIcon : params.inactiveIcon;

  const toggle = () => setIsActive(!isActive);

  return { isActive, icon, toggle };
};

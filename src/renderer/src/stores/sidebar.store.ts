import { create } from "zustand";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarStoreState {
  state: "expanded" | "collapsed";
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useSidebarStore = create<SidebarStoreState>((set, get) => {
  // Initialize with default values
  const initialState = {
    open: true,
    openMobile: false,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    state: "expanded" as const,
  };

  // Helper to toggle the sidebar
  const toggleSidebar = () => {
    const { isMobile, open, openMobile, setOpen, setOpenMobile } = get();
    return isMobile ? setOpenMobile(!openMobile) : setOpen(!open);
  };

  // Function to set open state with cookie persistence
  const setOpen = (value: boolean) => {
    set({
      open: value,
      state: value ? "expanded" : "collapsed",
    });
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  // Function to set mobile open state
  const setOpenMobile = (value: boolean) => {
    set({ openMobile: value });
  };

  // Function to update mobile state
  const setIsMobile = (value: boolean) => {
    set({ isMobile: value });
  };

  return {
    ...initialState,
    setOpen,
    setOpenMobile,
    toggleSidebar,
    setIsMobile,
  };
});

// Setup mobile detection outside of React
if (typeof window !== "undefined") {
  const mql = window.matchMedia("(max-width: 767px)");

  const handleMobileChange = (e: MediaQueryListEvent) => {
    useSidebarStore.getState().setIsMobile(e.matches);
  };

  // Initial set
  useSidebarStore.getState().setIsMobile(mql.matches);

  // Add listener
  mql.addEventListener("change", handleMobileChange);

  // Add keyboard shortcut listener
  window.addEventListener("keydown", (event) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      useSidebarStore.getState().toggleSidebar();
    }
  });
}

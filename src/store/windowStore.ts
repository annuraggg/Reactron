import { create } from "zustand";

type Window = {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  appType?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  isFocused?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  zIndex?: number;
  resizable?: boolean;
  prevState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type WindowStore = {
  windows: Window[];
  nextZIndex: number;

  addWindow: (window: Window) => void;
  removeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 100,

  addWindow: (window) => {
    const { nextZIndex } = get();
    const newWindow: Window = {
      ...window,
      zIndex: nextZIndex,
      isFocused: true,
      width: window.width || 500,
      height: window.height || 400,
      x: window.x || 100,
      y: window.y || 100,
      isMaximized: false,
      isMinimized: false,
      resizable: window.resizable ?? true,
    };

    set((state) => ({
      windows: [
        ...state.windows.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ],
      nextZIndex: nextZIndex + 1,
    }));
  },

  removeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  focusWindow: (id) => {
    const { windows, nextZIndex } = get();
    const targetWindow = windows.find((w) => w.id === id);

    if (targetWindow?.isFocused && !targetWindow.isMinimized) return;

    set((state) => ({
      windows: state.windows.map((w) => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized,
      })),
      nextZIndex: nextZIndex + 1,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id === id) {
          if (!w.isMaximized) {
            return {
              ...w,
              isMaximized: true,
              prevState: {
                x: w.x || 100,
                y: w.y || 100,
                width: w.width || 500,
                height: w.height || 400,
              },
            };
          } else {
            return {
              ...w,
              isMaximized: false,
              x: w.prevState?.x || w.x,
              y: w.prevState?.y || w.y,
              width: w.prevState?.width || w.width,
              height: w.prevState?.height || w.height,
            };
          }
        }
        return w;
      }),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x: position.x, y: position.y } : w
      ),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width: size.width, height: size.height } : w
      ),
    }));
  },

  bringToFront: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, zIndex: nextZIndex, isFocused: true }
          : { ...w, isFocused: false }
      ),
      nextZIndex: nextZIndex + 1,
    }));
  },

  sendToBack: (id) => {
    set((state) => {
      const minZ = Math.min(...state.windows.map((w) => w.zIndex || 0));
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: minZ - 1, isFocused: false } : w
        ),
      };
    });
  },
}));

export default useWindowStore;

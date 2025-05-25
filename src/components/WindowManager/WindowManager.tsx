import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IconX,
  IconMinus,
  IconMaximize,
  IconSquare,
} from "@tabler/icons-react";
import clsx from "clsx";

type WindowManagerProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isFocused: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;

  onFocus?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;

  position?: { x: number; y: number };
  size?: { width: number; height: number };
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
};

const WindowManager: React.FC<WindowManagerProps> = ({
  title,
  children,
  icon,
  isFocused,
  isMaximized,
  isMinimized,
  zIndex,
  onFocus,
  onMaximize,
  onMinimize,
  onClose,
  onPositionChange,
  onSizeChange,
  position,
  size,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 500, height: 400 },
}) => {
  const [internalPosition, setInternalPosition] = useState(
    position || defaultPosition
  );
  const [internalSize, setInternalSize] = useState(size || defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  const currentPosition = position || internalPosition;
  const currentSize = size || internalSize;

  const debug = (action: string, data?: any) => {
    console.log(`[WindowManager] ${title} - ${action}`, data);
  };

  const handleFocus = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      debug("Focus clicked", { isFocused, onFocus: !!onFocus });
      if (!isFocused && onFocus) {
        onFocus();
      }
    },
    [isFocused, onFocus, title]
  );

  const handleMaximize = useCallback(() => {
    debug("Maximize clicked", { isMaximized, onMaximize: !!onMaximize });
    if (onMaximize) {
      onMaximize();
    }
  }, [onMaximize, isMaximized, title]);

  const handleMinimize = useCallback(() => {
    debug("Minimize clicked", { isMinimized, onMinimize: !!onMinimize });
    if (onMinimize) {
      onMinimize();
    }
  }, [onMinimize, isMinimized, title]);

  const handleClose = useCallback(() => {
    debug("Close clicked", { onClose: !!onClose });
    if (onClose) {
      onClose();
    }
  }, [onClose, title]);

  const handleMaximizeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debug("Maximize button clicked");
      handleMaximize();
    },
    [handleMaximize]
  );

  const handleMinimizeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debug("Minimize button clicked");
      handleMinimize();
    },
    [handleMinimize]
  );

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debug("Close button clicked");
      handleClose();
    },
    [handleClose]
  );

  const handleTitleBarDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debug("Titlebar double-clicked");
      handleMaximize();
    },
    [handleMaximize]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;

      const target = e.target as HTMLElement;
      const isButton = target.closest("button");
      const isTitleBar = target.closest(".window-drag-handle");

      if (isButton || !isTitleBar) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      setDragOffset({
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y,
      });

      handleFocus();
    },
    [isMaximized, currentPosition, handleFocus]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - currentSize.width;
      const maxY = window.innerHeight - currentSize.height;

      const constrainedPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      };

      if (onPositionChange) {
        onPositionChange(constrainedPosition);
      } else {
        setInternalPosition(constrainedPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, currentSize, onPositionChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      if (e.altKey && e.key === "F4") {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Escape" && isMaximized) {
        handleMaximize();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, isMaximized, handleClose, handleMaximize]);

  useEffect(() => {
    debug("Props updated", {
      isFocused,
      isMaximized,
      isMinimized,
      hasCallbacks: {
        onFocus: !!onFocus,
        onMaximize: !!onMaximize,
        onMinimize: !!onMinimize,
        onClose: !!onClose,
      },
    });
  }, [
    isFocused,
    isMaximized,
    isMinimized,
    onFocus,
    onMaximize,
    onMinimize,
    onClose,
  ]);

  if (isMinimized) return null;

  const windowStyle = isMaximized
    ? {
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 55px)",
        zIndex: zIndex,
      }
    : {
        top: currentPosition.y,
        left: currentPosition.x,
        width: currentSize.width,
        height: currentSize.height,
        zIndex: zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      className={clsx(
        "fixed flex flex-col rounded-lg shadow-2xl",
        isFocused ? "bg-zinc-900" : "bg-zinc-900/90",
        isMaximized && "rounded-none",
        isDragging && "select-none"
      )}
      onClick={handleFocus}
    >
      {/* Titlebar */}
      <div
        className={clsx(
          "window-drag-handle flex items-center justify-between px-4 py-3 select-none",
          isFocused ? "bg-zinc-800" : "bg-zinc-850",
          isMaximized ? "rounded-none" : "rounded-t-lg",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onDoubleClick={handleTitleBarDoubleClick}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0 w-4 h-4 text-zinc-400">{icon}</div>
          )}
          <span
            className={clsx(
              "text-sm font-medium truncate",
              isFocused ? "text-white" : "text-zinc-400"
            )}
          >
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex gap-1 ml-2">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleMinimizeClick}
            className="flex items-center justify-center w-8 h-6 rounded hover:bg-yellow-500/20 z-10"
            title="Minimize"
            type="button"
          >
            <IconMinus
              size={14}
              className="text-zinc-400 hover:text-yellow-400 pointer-events-none"
            />
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleMaximizeClick}
            className="flex items-center justify-center w-8 h-6 rounded hover:bg-green-500/20 z-10"
            title={isMaximized ? "Restore" : "Maximize"}
            type="button"
          >
            {isMaximized ? (
              <IconSquare
                size={12}
                className="text-zinc-400 hover:text-green-400 pointer-events-none"
              />
            ) : (
              <IconMaximize
                size={14}
                className="text-zinc-400 hover:text-green-400 pointer-events-none"
              />
            )}
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleCloseClick}
            className="flex items-center justify-center w-8 h-6 rounded hover:bg-red-500/20 z-10"
            title="Close"
            type="button"
          >
            <IconX
              size={14}
              className="text-zinc-400 hover:text-red-400 pointer-events-none"
            />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-zinc-900">{children}</div>

      {/* Simple resize handle (bottom-right corner only) */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = currentSize.width;
            const startHeight = currentSize.height;

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = Math.max(300, startWidth + (e.clientX - startX));
              const newHeight = Math.max(
                200,
                startHeight + (e.clientY - startY)
              );
              const newSize = { width: newWidth, height: newHeight };

              if (onSizeChange) {
                onSizeChange(newSize);
              } else {
                setInternalSize(newSize);
              }
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-zinc-600 opacity-50" />
        </div>
      )}
    </div>
  );
};

export default WindowManager;

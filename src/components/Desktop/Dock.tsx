import { useEffect, useState, type ReactNode } from "react";
import { IconClipboardTextFilled, IconFolderFilled } from "@tabler/icons-react";
import useWindowStore from "../../store/windowStore";
import { createNotepadWindow } from "../../apps/Notepad/Notepad";

const Dock = () => {
  const { addWindow, focusWindow, minimizeWindow, windows } = useWindowStore();

  const handleNotepadClick = () => {
    const existingNotepad = windows.find((w) => w.title.includes("Notepad"));
    if (existingNotepad) {
      if (existingNotepad.isMinimized) {
        focusWindow(existingNotepad.id);
      } else if (existingNotepad.isFocused) {
        minimizeWindow(existingNotepad.id);
      } else {
        focusWindow(existingNotepad.id);
      }
    } else {
      const notepadWindow = createNotepadWindow();
      addWindow(notepadWindow);
    }
  };

  const handleAppClick = (window: any) => {
    if (window.isMinimized) {
      focusWindow(window.id);
    } else if (window.isFocused) {
      minimizeWindow(window.id);
    } else {
      focusWindow(window.id);
    }
  };

  const notepadWindows = windows.filter((w) => w.title.includes("Notepad"));
  const hasNotepadOpen = notepadWindows.length > 0;
  const notepadState =
    notepadWindows.length > 0
      ? {
          isFocused: notepadWindows.some((w) => w.isFocused && !w.isMinimized),
          isMinimized: notepadWindows.every((w) => w.isMinimized),
        }
      : null;

  return (
    <div className="bg-zinc-900 text-white bottom-0 p-1 h-[55px] grid grid-cols-3 gap-4 border-t border-zinc-600">
      <div className="justify-self-start"></div>
      <div className="justify-self-center flex items-center justify-center">
        <DockItem icon="logo.png" label="Home" />
        <DockItem icon={<IconFolderFilled color="#feca3c" />} label="Files" />
        <DockItem
          icon={<IconClipboardTextFilled color="#5ac1df" />}
          label="Notepad"
          onClick={handleNotepadClick}
          hasIndicator={hasNotepadOpen}
          isFocused={notepadState?.isFocused}
          isMinimized={notepadState?.isMinimized}
        />

        {/* Running Apps (excluding Notepad since it's already shown) */}
        {windows
          .filter((w) => !w.title.includes("Notepad"))
          .map((window) => (
            <DockItem
              key={window.id}
              icon={window.icon}
              label={window.title}
              onClick={() => handleAppClick(window)}
              hasIndicator={true}
              isFocused={window.isFocused && !window.isMinimized}
              isMinimized={window.isMinimized}
            />
          ))}
      </div>
      <div className="justify-self-end flex items-center gap-2">
        <DockEnd />
      </div>
    </div>
  );
};

const DockItem = ({
  icon,
  label,
  onClick,
  hasIndicator = false,
  isFocused = false,
  isMinimized = false,
}: {
  icon: string | ReactNode;
  label: string;
  onClick?: () => void;
  hasIndicator?: boolean;
  isFocused?: boolean;
  isMinimized?: boolean;
}) => {
  return (
    <div className="relative">
      <div
        className="flex flex-col items-center justify-center hover:bg-zinc-700 p-1 w-10 h-10 rounded-lg transition-colors cursor-pointer"
        onClick={onClick}
        title={label}
      >
        {typeof icon === "string" ? (
          <img src={icon} alt={label} className="w-6 h-6 mb-1" />
        ) : (
          icon
        )}
      </div>

      {/* Windows 11 Style Bottom Indicator */}
      {hasIndicator && (
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
          <div
            className={`
              h-0.5 rounded-full transition-all duration-200
              ${
                isFocused
                  ? "w-6 bg-blue-400"
                  : isMinimized
                  ? "w-2 bg-zinc-500"
                  : "w-2 bg-zinc-400"
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

const DockEnd = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end justify-center p-1 mr-3">
      <div className="text-xs">{time?.toLocaleTimeString()}</div>
      <div className="text-xs">{time?.toLocaleDateString()}</div>
    </div>
  );
};

export default Dock;

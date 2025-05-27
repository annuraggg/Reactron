import React, { useState } from "react";
import {
  IconLogout,
  IconSearch,
  IconWindow,
  IconWorld,
} from "@tabler/icons-react";
import Browser from "../../apps/Browser/Browser";
import { IconClipboardTextFilled, IconFolderFilled } from "@tabler/icons-react";
import useWindowStore from "../../store/windowStore";
import TaskManager from "../../apps/TaskManager/TaskManager";

export type StartMenuApp = {
  name: string;
  icon: React.ReactNode;
  action: () => void;
};

type StartMenuProps = {
  visible: boolean;
  onClose: () => void;
  appList?: StartMenuApp[];
  userName?: string;
};

export default function StartMenu({
  visible,
  onClose,
  userName,
}: StartMenuProps) {
  const [search, setSearch] = useState("");
  const { addWindow } = useWindowStore();

  const defaultAppList: StartMenuApp[] = [
    {
      name: "File Explorer",
      icon: <IconFolderFilled size={22} color="#feca3c" />,
      action: () => {
        onClose();
        addWindow({
          id: `explorer-${Date.now()}`,
          title: "File Explorer",
          content: (
            <React.Fragment>
              {/* Your FileExplorer component here */}
            </React.Fragment>
          ),
          icon: <IconFolderFilled color="#feca3c" />,
          width: 440,
          height: 520,
          x: 120 + Math.random() * 200,
          y: 120 + Math.random() * 150,
          isFocused: true,
          isMaximized: false,
          isMinimized: false,
          zIndex: 1,
          resizable: true,
          appType: "explorer",
        });
      },
    },
    {
      name: "Notepad",
      icon: <IconClipboardTextFilled size={18} color="#5ac1df" />,
      action: () => {
        onClose();
        addWindow({
          id: `notepad-${Date.now()}`,
          title: "Notepad",
          content: (
            <React.Fragment>{/* Your Notepad component here */}</React.Fragment>
          ),
          icon: <IconClipboardTextFilled color="#5ac1df" />,
          width: 520,
          height: 440,
          x: 120 + Math.random() * 200,
          y: 120 + Math.random() * 150,
          isFocused: true,
          isMaximized: false,
          isMinimized: false,
          zIndex: 1,
          resizable: true,
          appType: "notepad",
        });
      },
    },
    {
      name: "Browser",
      icon: <IconWorld size={22} color="#38bdf8" />,
      action: () => {
        onClose();
        addWindow({
          id: `browser-${Date.now()}`,
          title: "Browser",
          content: <Browser />,
          icon: <IconWorld color="#38bdf8" />,
          width: 950,
          height: 670,
          x: 160 + Math.random() * 200,
          y: 110 + Math.random() * 120,
          isFocused: true,
          isMaximized: false,
          isMinimized: false,
          zIndex: 1,
          resizable: true,
          appType: "browser",
        });
      },
    },
    {
      name: "Task Manager",
      icon: <IconWindow size={22} color="#60a5fa" />,
      action: () => {
        onClose();
        addWindow({
          id: `taskmanager-${Date.now()}`,
          title: "Task Manager",
          content: <TaskManager />,
          icon: <IconWindow color="#60a5fa" />,
          width: 700,
          height: 440,
          x: 160 + Math.random() * 200,
          y: 110 + Math.random() * 120,
          isFocused: true,
          isMaximized: false,
          isMinimized: false,
          zIndex: 1,
          resizable: true,
          appType: "taskmanager",
        });
      },
    },
  ];

  const menuAppList = defaultAppList;

  if (!visible) return null;

  const filteredApps = search
    ? menuAppList.filter((app) =>
        app.name.toLowerCase().includes(search.toLowerCase())
      )
    : menuAppList;

  return (
    <div
      tabIndex={-1}
      className="fixed left-1/2 bottom-20 z-[999] w-[520px] h-[520px] max-w-[98vw] rounded-2xl shadow-2xl border border-zinc-800 bg-zinc-900/90 text-zinc-100 flex flex-col animate-fade-in"
      style={{
        transform: "translateX(-50%)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Search Bar */}
      <div className="flex items-center bg-zinc-900/90 rounded-t-2xl px-7 py-3 border-b border-zinc-800/60">
        <IconSearch size={18} className="text-zinc-400 mr-2" />
        <input
          type="text"
          className="bg-transparent outline-none border-0 text-base flex-1 text-zinc-100"
          placeholder="Type to search apps…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* App Grid */}
      <div className="flex-1 overflow-y-auto flex flex-wrap gap-x-7 gap-y-5 px-8 pt-8 pb-2 content-start">
        {filteredApps.length === 0 && (
          <div className="text-zinc-400 text-base py-10 w-full text-center">
            No apps found
          </div>
        )}
        {filteredApps.map((app) => (
          <button
            key={app.name}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-blue-800/30 transition-all gap-2"
            onClick={app.action}
            tabIndex={0}
          >
            <span className="drop-shadow-md">
              {/* For Tabler icons, size prop works, else fallback */}
              {"size" in (app.icon as any).props
                ? React.cloneElement(app.icon as any, { size: 22 })
                : app.icon}
            </span>
            <span className="text-[13px] font-semibold text-zinc-100 mt-1 truncate max-w-[72px]">
              {app.name}
            </span>
          </button>
        ))}
      </div>
      {/* Footer - details at bottom */}
      <div className="flex items-center justify-between px-7 py-3 border-t border-zinc-800/70 bg-zinc-800/80 rounded-b-2xl mt-auto">
        <span className="flex items-center gap-2 text-zinc-400 font-semibold text-base">
          {userName || "User"}
        </span>
        <button
          className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-zinc-300 hover:text-red-400 hover:bg-zinc-800/60 rounded-xl transition"
          onClick={() => window.close()}
        >
          <IconLogout size={15} /> Log out
        </button>
      </div>
    </div>
  );
}

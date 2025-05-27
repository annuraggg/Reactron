import {
  IconWindow,
  IconX,
  IconArrowBarUp,
  IconArrowBarDown,
} from "@tabler/icons-react";
import useWindowStore from "../../store/windowStore";

export default function TaskManager() {
  const {
    windows,
    focusWindow,
    minimizeWindow,
    closeWindow,
    bringToFront,
    sendToBack,
  } = useWindowStore();

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900 text-zinc-100">
      <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-4">
        <IconWindow size={20} className="text-blue-400 mr-2" />
        <span className="font-semibold text-lg tracking-wide">
          Task Manager
        </span>
        <span className="ml-auto text-xs text-zinc-400">
          {windows.length} running task(s)
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300">
              <th className="py-2 px-3 text-left font-normal">App</th>
              <th className="py-2 px-3 text-left font-normal">Title</th>
              <th className="py-2 px-3 text-left font-normal">Status</th>
              <th className="py-2 px-3 text-left font-normal">Z-Index</th>
              <th className="py-2 px-3 text-left font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {windows.map((win) => (
              <tr
                key={win.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/40"
              >
                <td className="py-2 px-3 flex items-center gap-2">
                  {win.icon && typeof win.icon === "object" ? (
                    win.icon
                  ) : (
                    <IconWindow size={17} />
                  )}
                  <span className="font-semibold">{win.appType || "App"}</span>
                </td>
                <td className="py-2 px-3 max-w-[200px] truncate">
                  {win.title}
                </td>
                <td className="py-2 px-3">
                  {win.isMinimized ? (
                    <span className="text-yellow-400">Minimized</span>
                  ) : win.isFocused ? (
                    <span className="text-green-400">Focused</span>
                  ) : (
                    <span className="text-zinc-400">Open</span>
                  )}
                </td>
                <td className="py-2 px-3">{win.zIndex}</td>
                <td className="py-2 px-3 flex items-center gap-2">
                  <button
                    className="hover:text-green-400"
                    title="Focus"
                    onClick={() => focusWindow(win.id)}
                  >
                    <IconWindow size={16} />
                  </button>
                  <button
                    className="hover:text-yellow-400"
                    title={win.isMinimized ? "Restore" : "Minimize"}
                    onClick={() => minimizeWindow(win.id)}
                  >
                    {win.isMinimized ? (
                      <IconArrowBarUp size={16} />
                    ) : (
                      <IconArrowBarDown size={16} />
                    )}
                  </button>
                  <button
                    className="hover:text-blue-400"
                    title="Bring to Front"
                    onClick={() => bringToFront(win.id)}
                  >
                    <span className="font-semibold">↑</span>
                  </button>
                  <button
                    className="hover:text-blue-400"
                    title="Send to Back"
                    onClick={() => sendToBack(win.id)}
                  >
                    <span className="font-semibold">↓</span>
                  </button>
                  <button
                    className="hover:text-red-400"
                    title="Close"
                    onClick={() => closeWindow(win.id)}
                  >
                    <IconX size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {windows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No tasks running.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

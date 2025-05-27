import { extensionToApp } from "./extensionAppMap";
import Notepad from "../apps/Notepad/Notepad";
import { IconClipboardTextFilled } from "@tabler/icons-react";

export function launchAppForFile(node: any, addWindow: (win: any) => void) {
  if (node.type !== "file") return;

  const ext = node.name.split(".").pop()?.toLowerCase() || "";
  const appKey = extensionToApp[ext];

  if (appKey === "notepad") {
    addWindow({
      id: `notepad-${Date.now()}`,
      title: node.name + " - Notepad",
      content: (
        <Notepad
          initialContent={node.content || ""}
          initialFileName={node.name}
        />
      ),
      icon: <IconClipboardTextFilled className="w-4 h-4" color="#5ac1df" />,
      width: 900,
      height: 500,
      x: 120 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      isFocused: true,
      isMaximized: false,
      isMinimized: false,
      zIndex: 10,
      resizable: true,
    });
    return;
  }

  alert("No app registered for this file type.");
}

import { extensionToApp } from "./extensionAppMap";
import Notepad from "../apps/Notepad/Notepad";
import {
  IconClipboardTextFilled,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import ImageViewer from "../apps/ImageViewer/ImageViewer";
import VideoPlayer from "../apps/VideoPlayer/VideoPlayer";
import VsCode from "../apps/VSCode/VSCode";
import VsCodeIcon from "../apps/VSCode/VSCodeIcon";

export function launchAppForFile(
  node: any,
  addWindow: (win: any) => void,
  onClose?: () => void
) {
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

  if (appKey === "imageviewer") {
    const windowId = `imageviewer-${Date.now()}`;
    addWindow({
      id: windowId,
      title: node.name + " - Image Viewer",
      icon: <IconPhoto className="w-4 h-4" color="#a3e635" />,
      width: 820,
      height: 650,
      x: 120 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      isFocused: true,
      isMaximized: false,
      isMinimized: false,
      zIndex: 14,
      resizable: true,
      content: (
        <ImageViewer
          src={node.url || node.content || ""}
          alt={node.name}
          onClose={onClose}
        />
      ),
    });
    return;
  }

  if (appKey === "videoplayer") {
    const windowId = `videoplayer-${Date.now()}`;
    addWindow({
      id: windowId,
      title: node.name + " - Video Player",
      icon: <IconVideo className="w-4 h-4" color="#38bdf8" />,
      width: 900,
      height: 600,
      x: 140 + Math.random() * 180,
      y: 130 + Math.random() * 120,
      isFocused: true,
      isMaximized: false,
      isMinimized: false,
      zIndex: 14,
      resizable: true,
      content: (
        <VideoPlayer
          src={node.url || node.content || ""}
          alt={node.name}
          onClose={onClose}
        />
      ),
    });
    return;
  }

  if (appKey === "vscode") {
    addWindow({
      id: `vscode-${Date.now()}`,
      title: node.name + " - VSCode",
      content: (
        <VsCode
          fileName={node.name}
          initialValue={node.content || ""}
        />
      ),
      icon: <VsCodeIcon />,
      width: 900,
      height: 600,
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

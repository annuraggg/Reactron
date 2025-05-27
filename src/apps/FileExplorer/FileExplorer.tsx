import React, { useState, useEffect } from "react";
import { useFileSystemStore, type FileNode } from "../../store/filesystemStore";
import {
  IconFolderFilled,
  IconFile,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconRefresh,
  IconGridDots,
  IconPlus,
} from "@tabler/icons-react";
import { launchAppForFile } from "../../utils/launchAppForFile";
import useWindowStore from "../../store/windowStore";

function getPathCrumbs(currentPath: string[]) {
  const pathCrumbs: { name: string; path: string[] }[] = [
    { name: "This PC", path: [] },
  ];
  let acc: string[] = [];
  for (const segment of currentPath) {
    acc = [...acc, segment];
    pathCrumbs.push({ name: segment, path: [...acc] });
  }
  return pathCrumbs;
}

type HistoryStack = {
  stack: string[][];
  pointer: number;
};

export default function FileExplorer() {
  const {
    root,
    currentPath,
    setCurrentPath,
    getNodeByPath,
    createFile,
    createFolder,
    renameNode,
    deleteNode,
  } = useFileSystemStore();
  const addWindow = useWindowStore((s) => s.addWindow);

  const [history, setHistory] = useState<HistoryStack>({
    stack: [currentPath],
    pointer: 0,
  });

  useEffect(() => {
    setHistory((hist) => {
      if (
        hist.stack[hist.pointer] &&
        JSON.stringify(hist.stack[hist.pointer]) === JSON.stringify(currentPath)
      )
        return hist;
      const newStack = hist.stack.slice(0, hist.pointer + 1);
      newStack.push([...currentPath]);
      return { stack: newStack, pointer: newStack.length - 1 };
    });
  }, [currentPath]);

  const sidebarFolders = [
    { label: "Home", icon: <IconHome size={17} />, path: [] },
    {
      label: "Documents",
      icon: <IconFolderFilled size={17} />,
      path: ["Documents"],
    },
    ...((root.children || [])
      .filter((n) => n.type === "folder" && n.name !== "Documents")
      .map((folder) => ({
        label: folder.name,
        icon: <IconFolderFilled size={17} />,
        path: [folder.name],
      })) || []),
  ];

  const currentNode = getNodeByPath(currentPath) || root;
  const pathCrumbs = getPathCrumbs(currentPath);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: FileNode | null;
    path: string[] | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
    path: null,
  });

  useEffect(() => {
    const handler = () => setContextMenu((c) => ({ ...c, visible: false }));
    window.addEventListener("click", handler);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handler();
    });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler as any);
    };
  }, []);

  function handleRefresh() {
    setCurrentPath([...currentPath]);
  }

  function handleNodeOpen(node: FileNode, path: string[]) {
    if (node.type === "folder") setCurrentPath(path);
    else launchAppForFile(node, addWindow);
  }

  return (
    <div
      id="file-explorer-root"
      className="flex flex-col w-full h-full min-w-[340px] min-h-[300px] max-h-full bg-gradient-to-tr from-[#20232a] via-[#1b1e23] to-[#171821] text-zinc-100 shadow-[0_4px_32px_0_rgba(0,0,40,0.25)] border border-zinc-800 overflow-hidden select-none"
      tabIndex={0}
      style={{
        borderRadius: 0,
        boxSizing: "border-box",
        boxShadow: "0 2px 32px 0 #0006, 0 1.5px 0px 0 #3339 inset",
        backdropFilter: "blur(8px)",
        border: "1px solid #23272f",
      }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-[#23272f] to-[#191b21] border-b border-zinc-800 shadow">
        <button
          className={`hover:bg-blue-700/40 p-1 rounded transition ${
            history.pointer <= 0 ? "opacity-40 pointer-events-none" : ""
          }`}
          onClick={() => {
            if (history.pointer > 0) {
              setCurrentPath(history.stack[history.pointer - 1]);
              setHistory((h) => ({ ...h, pointer: h.pointer - 1 }));
            }
          }}
          tabIndex={-1}
          aria-label="Back"
        >
          <IconChevronLeft size={18} />
        </button>
        <button
          className={`hover:bg-blue-700/40 p-1 rounded transition ${
            history.pointer >= history.stack.length - 1
              ? "opacity-40 pointer-events-none"
              : ""
          }`}
          onClick={() => {
            if (history.pointer < history.stack.length - 1) {
              setCurrentPath(history.stack[history.pointer + 1]);
              setHistory((h) => ({ ...h, pointer: h.pointer + 1 }));
            }
          }}
          tabIndex={-1}
          aria-label="Forward"
        >
          <IconChevronRight size={18} />
        </button>
        <button
          className="hover:bg-blue-700/40 p-1 rounded transition"
          onClick={() => setCurrentPath([])}
          tabIndex={-1}
          aria-label="Home"
        >
          <IconHome size={18} />
        </button>
        <button
          className="hover:bg-blue-700/40 p-1 rounded ml-1 transition"
          onClick={handleRefresh}
          tabIndex={-1}
          aria-label="Refresh"
        >
          <IconRefresh size={18} />
        </button>
        {/* Address Bar */}
        <div className="flex-1 mx-2">
          <div className="flex items-center bg-[#212327] border border-zinc-800 px-2 py-[5px] rounded gap-1 text-xs overflow-x-auto shadow-inner">
            {pathCrumbs.map((crumb, idx) => (
              <span key={crumb.name + idx} className="flex items-center gap-1">
                {idx > 0 && (
                  <IconChevronRight size={13} className="opacity-60" />
                )}
                <button
                  className="px-1 rounded hover:bg-blue-800/30 transition"
                  onClick={() => setCurrentPath(crumb.path)}
                  tabIndex={-1}
                  style={{
                    fontWeight: idx === pathCrumbs.length - 1 ? 700 : 400,
                    color: idx === pathCrumbs.length - 1 ? "#fff" : "#60a5fa",
                  }}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
        </div>
        <button
          className="hover:bg-blue-700/40 p-1 rounded transition"
          onClick={() => {
            const name = prompt("Folder name?");
            if (name) createFolder(currentPath, name);
          }}
          tabIndex={-1}
        >
          <IconPlus size={15} />
        </button>
        <button
          className="hover:bg-blue-700/40 p-1 rounded transition"
          onClick={() => {
            const name = prompt("File name?");
            if (name) createFile(currentPath, name, "");
          }}
          tabIndex={-1}
        >
          <IconGridDots size={15} />
        </button>
      </div>

      {/* Main content: sidebar and file view */}
      <div className="flex flex-1 min-h-0 h-0">
        {/* Sidebar */}
        <div className="w-40 min-w-[90px] bg-gradient-to-b from-[#1a1d22] to-[#18191d] border-r border-zinc-800 py-2 flex flex-col gap-1 shadow-xl">
          {sidebarFolders.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[15px] font-semibold text-zinc-200 hover:bg-blue-800/25 transition
              ${
                JSON.stringify(currentPath) === JSON.stringify(item.path)
                  ? "bg-blue-700/40 text-blue-100 shadow"
                  : ""
              }
              `}
              onClick={() => setCurrentPath(item.path)}
              tabIndex={-1}
              style={{ minHeight: 32, maxHeight: 32 }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        {/* File/folder list (FLEX, not grid!) */}
        <div className="flex-1 bg-gradient-to-br from-[#1b1d22] to-[#171821] p-3 overflow-auto relative">
          {currentNode.type === "folder" &&
            currentNode.children &&
            currentNode.children.length === 0 && (
              <div className="text-zinc-500 text-center mt-16 text-base">
                This folder is empty.
              </div>
            )}
          <div className="flex flex-wrap gap-2">
            {currentNode.type === "folder" &&
              currentNode.children?.map((node) => (
                <Win11SquareNode
                  key={node.id}
                  node={node}
                  onOpen={() =>
                    handleNodeOpen(node, [...currentPath, node.name])
                  }
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      node,
                      path: [...currentPath, node.name],
                    });
                  }}
                />
              ))}
          </div>
          {/* Context Menu */}
          {contextMenu.visible && contextMenu.node && contextMenu.path && (
            <div
              className="fixed z-50 bg-[#23242a] border border-zinc-700 rounded shadow-lg py-1 min-w-[120px] animate-fade-in"
              style={{
                top: contextMenu.y + 2,
                left: contextMenu.x + 2,
                minWidth: 120,
              }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                className="block w-full px-4 py-2 text-left hover:bg-blue-700/25 text-sm text-zinc-200"
                onClick={() => {
                  setContextMenu((c) => ({ ...c, visible: false }));
                  const newName = prompt("Rename to?", contextMenu.node!.name);
                  if (newName && newName !== contextMenu.node!.name)
                    renameNode(contextMenu.path!, newName);
                }}
              >
                Rename
              </button>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-red-700/40 text-sm text-zinc-200"
                onClick={() => {
                  setContextMenu((c) => ({ ...c, visible: false }));
                  if (window.confirm(`Delete "${contextMenu.node!.name}"?`))
                    deleteNode(contextMenu.path!);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Win11SquareNode({
  node,
  onOpen,
  onContextMenu,
}: {
  node: FileNode;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 p-1 rounded hover:bg-blue-900/40 cursor-pointer group relative w-16 h-16 shadow transition-all duration-100 select-none"
      tabIndex={0}
      style={{
        userSelect: "none",
        aspectRatio: "1 / 1",
        borderRadius: 0,
        border: "1px solid transparent",
        background:
          "linear-gradient(145deg,rgba(80,90,120,0.05) 0%,rgba(0,0,0,0.1) 100%)",
      }}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        {node.type === "folder" ? (
          <IconFolderFilled size={27} className="text-yellow-400 drop-shadow" />
        ) : (
          <IconFile size={23} className="text-blue-400 drop-shadow" />
        )}
      </div>
      <span className="text-[11px] text-zinc-100 font-medium truncate w-14 text-center">
        {node.name}
      </span>
    </div>
  );
}

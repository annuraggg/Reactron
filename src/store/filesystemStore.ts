import { create } from "zustand";
import { v4 as uuid } from "uuid";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  createdAt: string;
  updatedAt: string;
};

type FileSystemStore = {
  root: FileNode;
  currentPath: string[];
  setCurrentPath: (path: string[]) => void;
  getNodeByPath: (path: string[]) => FileNode | null;
  createFile: (path: string[], name: string, content?: string) => void;
  createFolder: (path: string[], name: string) => void;
  renameNode: (path: string[], newName: string) => void;
  deleteNode: (path: string[]) => void;
};

function findNode(root: FileNode, path: string[]): FileNode | null {
  let current = root;
  for (const segment of path) {
    if (current.type !== "folder" || !current.children) return null;
    const next = current.children.find((c) => c.name === segment);
    if (!next) return null;
    current = next;
  }
  return current;
}

function findParent(root: FileNode, path: string[]): [FileNode, string] | null {
  if (path.length === 0) return null;
  const parentPath = path.slice(0, -1);
  const name = path[path.length - 1];
  const parent = findNode(root, parentPath);
  if (!parent || parent.type !== "folder" || !parent.children) return null;
  return [parent, name];
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  root: {
    id: "root",
    name: "/",
    type: "folder",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: uuid(),
        name: "Documents",
        type: "folder",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: uuid(),
            name: "welcome.txt",
            type: "file",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content: "Welcome to your WebOS!",
          },
        ],
      },
      {
        id: uuid(),
        name: "Readme.md",
        type: "file",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: "# Hello WebOS",
      },
    ],
  },
  currentPath: [],
  setCurrentPath: (path) => set({ currentPath: path }),

  getNodeByPath: (path) => findNode(get().root, path),

  createFile: (path, name, content = "") => {
    set((state) => {
      const parent = findNode(state.root, path);
      if (!parent || parent.type !== "folder") return {};
      if (parent.children?.some((c) => c.name === name)) return {};
      const now = new Date().toISOString();
      const newFile: FileNode = {
        id: uuid(),
        name,
        type: "file",
        content,
        createdAt: now,
        updatedAt: now,
      };
      parent.children = [...(parent.children || []), newFile];
      return { root: { ...state.root } };
    });
  },

  createFolder: (path, name) => {
    set((state) => {
      const parent = findNode(state.root, path);
      if (!parent || parent.type !== "folder") return {};
      if (parent.children?.some((c) => c.name === name)) return {};
      const now = new Date().toISOString();
      const newFolder: FileNode = {
        id: uuid(),
        name,
        type: "folder",
        createdAt: now,
        updatedAt: now,
        children: [],
      };
      parent.children = [...(parent.children || []), newFolder];
      return { root: { ...state.root } };
    });
  },

  renameNode: (path, newName) => {
    set((state) => {
      const node = findNode(state.root, path);
      if (node) node.name = newName;
      return { root: { ...state.root } };
    });
  },

  deleteNode: (path) => {
    set((state) => {
      const parentInfo = findParent(state.root, path);
      if (!parentInfo) return {};
      const [parent, name] = parentInfo;
      parent.children = parent.children?.filter((c) => c.name !== name) || [];
      return { root: { ...state.root } };
    });
  },
}));

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IconDeviceFloppy,
  IconFile,
  IconCopy,
  IconCut,
  IconClipboard,
  IconSearch,
  IconZoomIn,
  IconZoomOut,
  IconClipboardTextFilled,
} from "@tabler/icons-react";

interface NotepadProps {
  onSave?: (content: string, fileName: string) => void;
  onFileNameChange?: (fileName: string) => void;
  initialContent?: string;
  initialFileName?: string;
}

const Notepad: React.FC<NotepadProps> = ({
  onSave,
  onFileNameChange,
  initialContent = "",
  initialFileName = "Untitled.txt",
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState(initialFileName);
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [findText, setFindText] = useState("");
  const [showFind, setShowFind] = useState(false);
  const [_scrollTop, setScrollTop] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const findInputRef = useRef<HTMLInputElement>(null);

  const lines = content.split("\n");
  const totalLines = Math.max(lines.length, 20);
  const lineHeight = fontSize * 1.4;

  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, start);
    const lineArray = textBeforeCursor.split("\n");
    const line = lineArray.length;
    const column = lineArray[lineArray.length - 1].length + 1;

    setCursorPosition({ line, column });
  }, [content]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  }, []);

  useEffect(() => {
    updateCursorPosition();
  }, [content, updateCursorPosition]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsModified(true);
    updateCursorPosition();
  };

  const handleSave = useCallback(() => {
    onSave?.(content, fileName);
    setIsModified(false);

    console.log("File saved:", fileName, "- Content length:", content.length);
  }, [content, fileName, onSave]);

  const handleNew = useCallback(() => {
    if (isModified) {
      const shouldDiscard = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      );
      if (!shouldDiscard) return;
    }
    setContent("");
    setFileName("Untitled.txt");
    setIsModified(false);
    onFileNameChange?.("Untitled.txt");
  }, [isModified, onFileNameChange]);

  const handleCopy = useCallback(() => {
    if (textareaRef.current) {
      const selectedText = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );

      console.log("Copied to clipboard:", selectedText || content);
    }
  }, [content]);

  const handleCut = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);

      if (selectedText) {
        console.log("Cut to clipboard:", selectedText);
        const newContent = content.substring(0, start) + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    }
  }, [content]);

  const handlePaste = useCallback(() => {
    const clipboardText = "Pasted content from clipboard";
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent =
        content.substring(0, start) + clipboardText + content.substring(end);
      setContent(newContent);
      setIsModified(true);
    }
  }, [content]);

  const handleFind = useCallback(() => {
    setShowFind(!showFind);
    if (!showFind && findInputRef.current) {
      setTimeout(() => findInputRef.current?.focus(), 100);
    }
  }, [showFind]);

  const handleZoomIn = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  }, []);

  const handleZoomOut = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 10));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case "s":
          e.preventDefault();
          handleSave();
          break;
        case "n":
          e.preventDefault();
          handleNew();
          break;
        case "c":
          e.preventDefault();
          handleCopy();
          break;
        case "x":
          e.preventDefault();
          handleCut();
          break;
        case "v":
          e.preventDefault();
          handlePaste();
          break;
        case "f":
          e.preventDefault();
          handleFind();
          break;
        case "=":
        case "+":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100 relative font-sans">
      {/* Elegant Menu Bar */}
      <div className="flex bg-gradient-to-r from-zinc-800 to-zinc-800/90 border-b border-zinc-700/50 px-4 py-2.5 shadow-lg backdrop-blur-sm">
        <div className="flex gap-8 text-sm font-medium">
          <MenuDropdown title="File">
            <MenuItem
              onClick={handleNew}
              icon={<IconFile size={16} />}
              shortcut="Ctrl+N"
            >
              New
            </MenuItem>
            <MenuItem
              onClick={handleSave}
              icon={<IconDeviceFloppy size={16} />}
              shortcut="Ctrl+S"
            >
              Save
            </MenuItem>
          </MenuDropdown>

          <MenuDropdown title="Edit">
            <MenuItem
              onClick={handleCopy}
              icon={<IconCopy size={16} />}
              shortcut="Ctrl+C"
            >
              Copy
            </MenuItem>
            <MenuItem
              onClick={handleCut}
              icon={<IconCut size={16} />}
              shortcut="Ctrl+X"
            >
              Cut
            </MenuItem>
            <MenuItem
              onClick={handlePaste}
              icon={<IconClipboard size={16} />}
              shortcut="Ctrl+V"
            >
              Paste
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={handleFind}
              icon={<IconSearch size={16} />}
              shortcut="Ctrl+F"
            >
              Find
            </MenuItem>
          </MenuDropdown>

          <MenuDropdown title="View">
            <MenuItem
              onClick={handleZoomIn}
              icon={<IconZoomIn size={16} />}
              shortcut="Ctrl++"
            >
              Zoom In
            </MenuItem>
            <MenuItem
              onClick={handleZoomOut}
              icon={<IconZoomOut size={16} />}
              shortcut="Ctrl+-"
            >
              Zoom Out
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => setLineNumbers(!lineNumbers)}>
              <span className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-sm ${
                    lineNumbers ? "bg-blue-500" : "border border-zinc-500"
                  }`}
                />
                Line Numbers
              </span>
            </MenuItem>
            <MenuItem onClick={() => setWordWrap(!wordWrap)}>
              <span className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-sm ${
                    wordWrap ? "bg-blue-500" : "border border-zinc-500"
                  }`}
                />
                Word Wrap
              </span>
            </MenuItem>
          </MenuDropdown>
        </div>
      </div>

      {/* Enhanced Find Bar */}
      {showFind && (
        <div className="flex items-center gap-4 bg-zinc-800/80 backdrop-blur border-b border-zinc-700/50 px-6 py-3">
          <div className="flex items-center gap-3 flex-1">
            <IconSearch size={18} className="text-zinc-400" />
            <input
              ref={findInputRef}
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find in document..."
              className="bg-zinc-700/70 border border-zinc-600/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 flex-1 max-w-md transition-all"
            />
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors">
                Next
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowFind(false)}
            className="text-zinc-400 hover:text-zinc-200 p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor Area with Better Layout */}
      <div className="flex flex-1 min-h-0 bg-zinc-900">
        {/* Line Numbers with Fixed Sync */}
        {lineNumbers && (
          <div
            ref={lineNumbersRef}
            className="bg-zinc-850 border-r border-zinc-700/50 px-4 py-4 text-zinc-500 text-right select-none font-mono overflow-hidden w-16 flex-shrink-0"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              height: "100%",
            }}
          >
            <div style={{ paddingBottom: "50vh" }}>
              {Array.from({ length: totalLines }, (_, i) => (
                <div
                  key={i + 1}
                  style={{
                    height: `${lineHeight}px`,
                    lineHeight: `${lineHeight}px`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Text Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onScroll={handleScroll}
            className="w-full h-full bg-transparent text-zinc-100 p-4 border-none outline-none resize-none font-mono"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              whiteSpace: wordWrap ? "pre-wrap" : "pre",
              overflowWrap: wordWrap ? "break-word" : "normal",
              tabSize: 4,
            }}
            placeholder="Start typing your document..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-800/90 border-t border-zinc-700/50 px-6 py-2.5 text-xs text-zinc-400 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {fileName}
            {isModified ? " •" : ""}
          </span>
          <span>{content.length} chars</span>
          <span>{lines.length} lines</span>
          <span>
            {content.split(/\s+/).filter((w) => w.length > 0).length} words
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span>
            Line {cursorPosition.line}, Column {cursorPosition.column}
          </span>
          <span>{fontSize}px</span>
          <span>UTF-8</span>
          <span className="text-green-400">Ready</span>
        </div>
      </div>
    </div>
  );
};

const MenuDropdown = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="px-4 py-2 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 text-zinc-200 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {title}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-zinc-800/95 backdrop-blur-xl border border-zinc-600/50 shadow-2xl rounded-lg mt-1 min-w-56 z-50 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({
  children,
  onClick,
  icon,
  shortcut,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 hover:bg-zinc-700/70 flex items-center gap-3 text-sm transition-all text-zinc-200 hover:text-white first:rounded-t-lg last:rounded-b-lg"
  >
    <span className="flex items-center gap-3 flex-1">
      {icon && <span className="text-zinc-400 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
    {shortcut && (
      <span className="text-zinc-500 text-xs font-mono">{shortcut}</span>
    )}
  </button>
);

const MenuDivider = () => (
  <div className="border-t border-zinc-600/50 my-1 mx-2" />
);

export const createNotepadWindow = () => {
  const notepadId = `notepad-${Date.now()}`;
  return {
    id: notepadId,
    title: "Untitled.txt - Notepad",
    content: <Notepad />,
    icon: <IconClipboardTextFilled className="w-4 h-4" color="#5ac1df" />,
    width: 900,
    height: 500,
    x: 0,
    y: 0,
    isFocused: true,
    isMaximized: false,
    isMinimized: false,
    zIndex: 1,
    resizable: true,
  };
};

export default Notepad;

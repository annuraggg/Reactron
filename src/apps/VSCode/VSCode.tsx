import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const LANG_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  md: "markdown",
  html: "html",
  css: "css",
  scss: "scss",
  py: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "cpp",
  cs: "csharp",
  go: "go",
  sh: "shell",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  php: "php",
  rs: "rust",
  swift: "swift",
  // Add more as needed
};

export default function VsCode({
  fileName = "untitled.txt",
  initialValue = "",
  onSave,
}: {
  fileName?: string;
  initialValue?: string;
  onSave?: (value: string) => void;
}) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const language = LANG_MAP[ext] || "plaintext";
  const [value, setValue] = useState(initialValue);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [fontSize, setFontSize] = useState(15);
  const editorRef = useRef<any>(null);

  // Ctrl+S to save
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (onSave) onSave(value);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [value, onSave]);

  function handleSave() {
    if (onSave) onSave(value);
  }

  function handleThemeToggle() {
    setTheme((t) => (t === "vs-dark" ? "light" : "vs-dark"));
  }

  function handleEditorMount(editor: any) {
    editorRef.current = editor;
  }

  return (
    <div
      className="w-full h-full flex flex-col bg-[#181c20] border border-zinc-800"
      style={{ borderRadius: 0 }}
    >
      <div
        className="flex items-center px-3 py-2 bg-[#23272f] border-b border-zinc-800 text-zinc-200 font-mono text-sm"
        style={{ borderRadius: 0 }}
      >
        <span
          style={{
            color: "#3ea6ff",
            fontSize: 21,
            fontWeight: 700,
            marginRight: 8,
          }}
        >
          ⌨️
        </span>
        <span style={{ fontWeight: 500 }}>{fileName}</span>
        <span className="ml-2 px-2 py-0.5 rounded bg-zinc-700 text-blue-300 text-xs uppercase tracking-widest">
          {language}
        </span>
        <button
          onClick={handleSave}
          className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow transition"
          title="Save (Ctrl+S)"
        >
          Save
        </button>
        <button
          onClick={handleThemeToggle}
          className="ml-2 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs"
          title="Toggle theme"
        >
          {theme === "vs-dark" ? "🌙" : "🌞"}
        </button>
        <div className="ml-2 flex items-center gap-1">
          <button
            onClick={() => setFontSize((f) => Math.max(9, f - 1))}
            className="w-7 h-7 flex items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600 text-white"
            title="Decrease font size"
          >
            –
          </button>
          <span className="text-xs font-semibold text-zinc-300">
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize((f) => Math.min(32, f + 1))}
            className="w-7 h-7 flex items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600 text-white"
            title="Increase font size"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 min-w-0" style={{ borderRadius: 0 }}>
        <Editor
          height="100%"
          theme={theme}
          language={language}
          value={value}
          onMount={handleEditorMount}
          onChange={(v) => setValue(v || "")}
          options={{
            fontFamily: "Menlo, Monaco, 'Fira Mono', monospace",
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            smoothScrolling: true,
            lineNumbers: "on",
            roundedSelection: false,
            renderLineHighlight: "all",
            cursorSmoothCaretAnimation: "on",
            mouseWheelZoom: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

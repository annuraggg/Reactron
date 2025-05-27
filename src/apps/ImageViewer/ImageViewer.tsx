import React, { useState } from "react";

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;

export default function ImageViewer({
  src,
  alt,
  initialZoom = 1,
}: {
  src: string;
  alt?: string;
  onClose?: () => void;
  initialZoom?: number;
}) {
  const [zoom, setZoom] = useState(initialZoom);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    let nextZoom = zoom - (e.deltaY > 0 ? ZOOM_STEP : -ZOOM_STEP);
    nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    setZoom(nextZoom);
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setStartPos({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging || !startPos) return;
    setDrag({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  }

  function handleMouseUp() {
    setDragging(false);
    setStartPos(null);
  }

  function handleDoubleClick() {
    setZoom(1);
    setDrag({ x: 0, y: 0 });
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    link.click();
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1b1d22] to-[#171821] relative rounded-xl overflow-hidden"
      style={{
        minHeight: 360,
        minWidth: 340,
        userSelect: dragging ? "none" : "auto",
        boxShadow: "0 6px 42px #000a, 0 1.5px 0px 0 #3339 inset",
      }}
      tabIndex={-1}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        <button
          onClick={handleDownload}
          className="bg-zinc-800/80 rounded-full p-2 hover:bg-blue-700/80 text-white shadow transition"
          title="Download"
        >
          <svg width={19} height={19} fill="none" viewBox="0 0 20 20">
            <path
              d="M5 14.5v1a1.5 1.5 0 001.5 1.5h7A1.5 1.5 0 0015 15.5v-1M10 3v10m0 0l-4-4m4 4l4-4"
              stroke="white"
              strokeWidth={1.45}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div
        className="flex-1 flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: "100%" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        tabIndex={0}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="rounded-xl shadow-2xl border border-zinc-800 transition-all bg-zinc-900/60"
          style={{
            maxWidth: "95vw",
            maxHeight: "70vh",
            transform: `translate(${drag.x}px, ${drag.y}px) scale(${zoom})`,
            transition: dragging
              ? "none"
              : "transform 0.15s cubic-bezier(.7,.4,.2,1)",
            cursor: dragging ? "grabbing" : "grab",
            boxShadow: "0 8px 44px #000b",
            background: "#181d29",
          }}
        />
      </div>
      <div className="flex items-center justify-center gap-6 mt-2 mb-1 px-6 py-1 rounded-xl bg-zinc-900/80 text-zinc-300 text-xs font-medium shadow z-10">
        <span>{alt || src}</span>
        <span className="opacity-80">|</span>
        <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
        <button
          className="ml-4 px-2 py-1 bg-zinc-800/70 hover:bg-blue-700/60 rounded text-xs text-blue-200 font-semibold transition shadow"
          onClick={() => setZoom(1)}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
}

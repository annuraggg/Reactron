import { useRef, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconRefresh,
  IconWorldWww,
  IconBookmark,
  IconBookmarkFilled,
  IconStar,
} from "@tabler/icons-react";

const DEFAULT_BOOKMARKS: { name: string; url: string }[] = [
  { name: "Wikipedia", url: "https://www.wikipedia.org/" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
  { name: "Example.com", url: "https://example.com/" },
  { name: "anuragsawant.in", url: "https://www.anuragsawant.in/" },
];

const DEFAULT_HOMEPAGE = "https://www.ecosia.org/";

function canBookmark(url: string) {
  return /^https:\/\/[^/]+/i.test(url);
}

export default function Browser() {
  const [url, setUrl] = useState(DEFAULT_HOMEPAGE);
  const [input, setInput] = useState(url);
  const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleBookmark = () => {
    if (!bookmarks.some((b) => b.url === url) && canBookmark(url)) {
      setBookmarks((prev) => [...prev, { name: url, url }]);
    }
  };

  const handleBookmarkClick = (bmUrl: string) => {
    setInput(bmUrl);
    setUrl(bmUrl);
    setLoadError(false);
  };

  const handleGo = () => {
    let val = input.trim();
    if (!val) return;
    if (!/^https?:\/\//.test(val)) {
      val = "https://www.ecosia.org/search?q=" + encodeURIComponent(val);
    }
    setUrl(val);
    setLoadError(false);
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
  };

  const handleRefresh = () => {
    setLoadError(false);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleIframeLoad = () => {
    setTimeout(() => {
      try {
        if (
          iframeRef.current &&
          iframeRef.current.contentDocument &&
          iframeRef.current.contentDocument.body.childElementCount === 0
        ) {
          setLoadError(true);
        } else {
          setLoadError(false);
        }
      } catch (e) {
        setLoadError(false);
      }
    }, 700);
  };

  const isBookmarked = bookmarks.some((b) => b.url === url);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900">
      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 border-b border-zinc-700 overflow-x-auto">
        <IconStar size={16} className="mr-1 text-yellow-300" />
        {bookmarks.map((bm) => (
          <button
            key={bm.url}
            className="flex items-center px-2 py-1 mx-1 rounded hover:bg-zinc-700 text-xs text-zinc-100 transition whitespace-nowrap"
            onClick={() => handleBookmarkClick(bm.url)}
            title={bm.url}
            type="button"
          >
            <IconBookmark size={13} className="mr-1" />
            {bm.name.length > 25 ? bm.name.slice(0, 23) + "…" : bm.name}
          </button>
        ))}
        {/* Add bookmark button for current site */}
        {!isBookmarked && canBookmark(url) && (
          <button
            className="ml-2 px-2 py-1 rounded hover:bg-blue-700 bg-blue-600 text-xs text-white flex items-center"
            onClick={handleBookmark}
          >
            <IconBookmarkFilled size={13} className="mr-1" /> Bookmark This
          </button>
        )}
      </div>
      {/* Browser controls */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700">
        <button
          disabled
          className="p-1 rounded hover:bg-zinc-700 text-zinc-500"
        >
          <IconArrowLeft size={18} />
        </button>
        <button
          disabled
          className="p-1 rounded hover:bg-zinc-700 text-zinc-500"
        >
          <IconArrowRight size={18} />
        </button>
        <button
          className="p-1 rounded hover:bg-zinc-700"
          onClick={handleRefresh}
        >
          <IconRefresh size={18} />
        </button>
        <div className="flex-1 mx-2">
          <div className="flex items-center bg-zinc-700 rounded px-2 py-1">
            <IconWorldWww size={16} className="mr-2 text-zinc-400" />
            <input
              className="flex-1 bg-transparent outline-none text-sm text-zinc-100"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKey}
              onBlur={() => setInput(url)}
              spellCheck={false}
            />
          </div>
        </div>
        <button
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold"
          onClick={handleGo}
        >
          Go
        </button>
      </div>
      {/* Iframe or error */}
      <div className="flex-1 bg-black relative">
        {!loadError ? (
          <iframe
            ref={iframeRef}
            src={url}
            title="Browser"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleIframeLoad}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-10">
            <IconWorldWww size={36} className="text-yellow-400 mb-2" />
            <div className="text-zinc-200 font-semibold text-lg mb-1">
              This site can't be displayed
            </div>
            <div className="text-zinc-400 text-sm max-w-sm text-center">
              The site you tried to open does not allow being viewed in a
              browser app like this.
              <br />
              Try a different website (e.g. Wikipedia, MDN, Ecosia,
              anuragsawant.in, or other static content).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

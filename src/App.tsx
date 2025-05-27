import { useEffect, useState } from "react";
import Desktop from "./components/Desktop/Desktop";
import WindowManager from "./components/WindowManager/WindowManager";
import useWindowStore from "./store/windowStore";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_MIN_DURATION = 7000;

const BootScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8 } }}
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111827]"
    style={{
      background:
        "radial-gradient(ellipse at 50% 45%, #0d1b2a 0%, #111827 60%, #090a0f 100%)",
    }}
  >
    <motion.img
      src="/logo.png"
      alt="Reactron Logo"
      width={96}
      height={96}
      className="mb-7 rounded-2xl shadow-xl"
      initial={{ opacity: 0, scale: 0.82, rotate: -10, y: 60 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 18,
          delay: 0.15,
        },
      }}
      exit={{ opacity: 0, scale: 1.1, y: -40, transition: { duration: 0.5 } }}
      draggable={false}
    />

    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.6, duration: 0.65 },
      }}
      exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
      className="text-2xl font-semibold text-white/90 tracking-wide select-none"
      style={{ textShadow: "0 2px 24px #000b" }}
    >
      Starting ReactronOS
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 1.25, duration: 0.5 },
      }}
      exit={{ opacity: 0 }}
      className="flex gap-1 mt-12"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-white/70"
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [0, -7, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.2,
            delay: i * 0.18,
          }}
        />
      ))}
    </motion.div>
  </motion.div>
);

const App = () => {
  const [booting, setBooting] = useState(true);
  const [bootStartTime] = useState(Date.now());
  const windows = useWindowStore((state) => state.windows);
  const {
    addWindow,
    focusWindow,
    maximizeWindow,
    minimizeWindow,
    closeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const waitForAllAssets = () =>
    new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => {
          setTimeout(() => resolve(), 300);
        });
      }
    });

  useEffect(() => {
    const doBoot = async () => {
      const minBootTime = new Promise((r) =>
        setTimeout(r, BOOT_MIN_DURATION - (Date.now() - bootStartTime))
      );
      const assetLoad = waitForAllAssets();

      await Promise.all([minBootTime, assetLoad]);

      addWindow({
        id: "welcome",
        title: "Welcome",
        content: (
          <div style={{ padding: 32, fontSize: 22 }}>Welcome to Reactron!</div>
        ),
        icon: null,
        x: 200,
        y: 140,
      });

      setBooting(false);
    };

    doBoot();
  }, [addWindow, bootStartTime]);

  return (
    <div>
      <AnimatePresence>{booting && <BootScreen key="boot" />}</AnimatePresence>
      {!booting && (
        <>
          <Desktop />
          {windows.map((window) => (
            <WindowManager
              key={window.id}
              title={window.title}
              icon={window.icon}
              isFocused={window.isFocused || false}
              isMaximized={window.isMaximized || false}
              isMinimized={window.isMinimized || false}
              zIndex={window.zIndex || 1}
              position={{ x: window.x || 100, y: window.y || 100 }}
              size={{
                width: window.width || 500,
                height: window.height || 400,
              }}
              onFocus={() => focusWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onClose={() => closeWindow(window.id)}
              onPositionChange={(position) =>
                updateWindowPosition(window.id, position)
              }
              onSizeChange={(size) => updateWindowSize(window.id, size)}
            >
              {window.content}
            </WindowManager>
          ))}
        </>
      )}
    </div>
  );
};

export default App;

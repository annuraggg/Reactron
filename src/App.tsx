import Desktop from "./components/Desktop/Desktop";
import WindowManager from "./components/WindowManager/WindowManager";
import useWindowStore from "./store/windowStore";

const App = () => {
  const windows = useWindowStore((state) => state.windows);
  const {
    focusWindow,
    maximizeWindow,
    minimizeWindow,
    closeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  console.log("App render - windows:", windows.length);

  return (
    <div>
      <Desktop />
      {windows.map((window) => {
        console.log("Rendering window:", window.id, {
          isFocused: window.isFocused,
          isMaximized: window.isMaximized,
          isMinimized: window.isMinimized,
        });

        return (
          <WindowManager
            key={window.id}
            title={window.title}
            icon={window.icon}
            isFocused={window.isFocused || false}
            isMaximized={window.isMaximized || false}
            isMinimized={window.isMinimized || false}
            zIndex={window.zIndex || 1}
            position={{ x: window.x || 100, y: window.y || 100 }}
            size={{ width: window.width || 500, height: window.height || 400 }}
            onFocus={() => {
              console.log("onFocus callback called for:", window.id);
              focusWindow(window.id);
            }}
            onMaximize={() => {
              console.log("onMaximize callback called for:", window.id);
              maximizeWindow(window.id);
            }}
            onMinimize={() => {
              console.log("onMinimize callback called for:", window.id);
              minimizeWindow(window.id);
            }}
            onClose={() => {
              console.log("onClose callback called for:", window.id);
              closeWindow(window.id);
            }}
            onPositionChange={(position) => {
              console.log(
                "onPositionChange callback called for:",
                window.id,
                position
              );
              updateWindowPosition(window.id, position);
            }}
            onSizeChange={(size) => {
              console.log("onSizeChange callback called for:", window.id, size);
              updateWindowSize(window.id, size);
            }}
          >
            {window.content}
          </WindowManager>
        );
      })}
    </div>
  );
};

export default App;

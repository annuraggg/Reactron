import Dock from "./Dock";

const style = {
  backgroundImage: "url(/wallpapers/default.jpg)",
  backgroundSize: "cover",
  height: "calc(100vh - 55px)",
  zIndex: -20,
};

const Desktop = () => {
  return (
    <div className="flex flex-col">
      <div style={style}></div>
      <Dock />
    </div>
  );
};

export default Desktop;

import "./App.css";
import {BsBarChartLine ,BsFullscreen, BsFullscreenExit} from "react-icons/bs";
import {useState, useRef, useEffect} from "react";
import type {Layout} from "./types/layout.ts";
import {DataContext} from "./Context/DataContext.tsx";
import {MetaDataContext} from "./Context/MetaDataContext.tsx"
import type {TimeData} from "./types/TimeData.ts";
import type {MetaData} from "./types/MetaData.ts";


function App() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [timeData, setTimeData] = useState<TimeData | undefined>(undefined);
  const [metaData, setMetaData] = useState<MetaData | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const fetchLayout = async function () {
      try {
        const res = await fetch('http://localhost:3000/layoutJson');
        if (!res.ok) {
          console.error('Layout konnte nicht erreicht werden!');
        }
        const layout: Layout = await res.json();
        setLayout(layout);

        const resData: Response = await fetch('http://localhost:3000/timeData');
        if (!resData.ok) {
          console.error('Zeitreihendaten konnten nicht erreicht werden!');
        }
        const parsedTimeData: TimeData = await resData.json();
        setTimeData(parsedTimeData);

        const metaDataResponse: Response = await fetch('http://localhost:3000/metadata');
        if (!metaDataResponse.ok) {
          console.error('Metadaten konnten nicht erreicht werden!');
        }
        const parsedMetaData: MetaData = await metaDataResponse.json();
        setMetaData(parsedMetaData);
      } catch (error) {
        console.error(`Unerwarteter Fehler aufgetreten! \n${error}`)
      }
    }
    fetchLayout();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="fullscreen">
      <DataContext.Provider value={timeData}>
        <MetaDataContext.Provider value={metaData}>
          <div style={{color: "#6b6375", textAlign: "left"}}>{layout?.explorerpath}</div>
          <hr/>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <div style={{display: "flex", alignItems: "center", gap: 8}}>
              <BsBarChartLine size={16} color="#aa3bff" />
              <span style={{fontWeight: 600, color: "#08060d"}}>{layout?.name}</span>
            </div>

            <button
              onClick={toggleFullscreen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b6375",
                marginTop: 2,
              }}>
              {isFullscreen ? (
                <BsFullscreenExit size={16}/>
              ) : (
                <BsFullscreen size={16}/>
              )}
            </button>
          </div>
        </MetaDataContext.Provider>
      </DataContext.Provider>
    </div>
  );
}

export default App;
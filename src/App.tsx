import "./App.css";
import {useState, useRef, useEffect} from "react";
import type {Layout} from "./types/layout.ts";
import type {TimeData} from "./types/TimeData.ts";
import type {MetaData} from "./types/MetaData.ts";
import {Dashboard} from "./components/Dashboard.tsx";
import {DataContext} from "./Context/DataContext.tsx";
import {MetaDataContext} from "./Context/MetaDataContext.tsx";


function App() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [timeData, setTimeData] = useState<TimeData | undefined>(undefined);
  const [metaData, setMetaData] = useState<MetaData | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    async function fetchLayout() {
      try {
        const res = await fetch('http://localhost:3000/layoutJson');
        if (!res.ok) {
          console.error('Layout konnte nicht erreicht werden!');
        }
        const fetchedLayout: Layout = await res.json();
        setLayout(fetchedLayout);

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

        if (!intervalId && fetchedLayout.refreshInterval) {
          intervalId = setInterval(fetchLayout, fetchedLayout.refreshInterval * 1000);
        }
      } catch (error) {
        console.error(`Unerwarteter Fehler aufgetreten! \n${error}`)
      }
    }

    fetchLayout();

    return () => clearInterval(intervalId);
  }, []);

  if (!layout) return <div></div>
  return (
    <div ref={containerRef} className="fullscreen">
      <DataContext.Provider value={timeData}>
        <MetaDataContext.Provider value={metaData}>
          <Dashboard layout={layout}></Dashboard>
        </MetaDataContext.Provider>
      </DataContext.Provider>
    </div>
  );
}

export default App;

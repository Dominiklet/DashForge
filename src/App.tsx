import "./App.css";
import { BsBarChartLine, BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import titleData from "./templates/dashboard_template.json";
import { useState, useRef, useEffect } from "react";

// import strompreisData from "./mock data/strompreis.json";
// import strompreisMeta from "./mock data/strompreis_metadata.json";
// import { KpiWidget } from "./components/KpiWidget";
// import markdownData from "./mock data/markdown.json"; // nach mock data zusammenführung muss import angepasst werden
// import { TextWidget } from "./components/TextWidget";
// import { PlotWidget } from "./components/PlotWidget";
import {LineChartWidget} from "./components/LineChart";
 interface Titles {
  name: string;
  explorerPath: string;
}
import type {
    DataSourceOutput,
    PlotConfiguration,
} from "./components/types";

function useDashboardMeta(): Titles {
  const entry = titleData;

  return {
    name: entry.name,
    explorerPath: entry.nodeInformation.explorerPath,
  };
}
const lineChartConfiguration: PlotConfiguration[] = [
    {
        id: "b17f0721-4167-427b-b8e8-53c415b8a073",

        axisConfig: {
            useUnitOnAxis: true,
            useDefaultAxis: false,
        },

        lineConfig: {
            gap: -1,
            color: "#3366cc",
            lineSize: 1,
            lineType: "solid",
            linePointType: "none",
            lineInterpolation: "linear",
        },

        legendConfig: {
            show: true,
            position: "TOP",
            showUnit: true,
            adjustment: "CENTER",
        },

        commentsConfig: {
            isCommentsEnabled: false,
        },
    },

    {
        id: "68efb8fd-fa23-4978-998c-3c1cc7b4c60c",

        axisConfig: {
            useUnitOnAxis: true,
            useDefaultAxis: false,
        },

        lineConfig: {
            gap: -1,
            color: "#ff9901",
            lineSize: 1,
            lineType: "solid",
            linePointType: "none",
            lineInterpolation: "linear",
        },

        legendConfig: {
            show: true,
            position: "TOP",
            showUnit: true,
            adjustment: "CENTER",
        },

        commentsConfig: {
            isCommentsEnabled: false,
        },
    },
];

const lineChartDataSourceOutputs: Record<string, DataSourceOutput> = {
    "b17f0721-4167-427b-b8e8-53c415b8a073": {
        outputId: "b17f0721-4167-427b-b8e8-53c415b8a073",
        referenceId: "5617b568-1624-400b-85fc-0a3e5d157ecb",
        outputType: "TIMESERIES",
        nodeType: "SIGNAL",
        isReadable: true,
    },

    "68efb8fd-fa23-4978-998c-3c1cc7b4c60c": {
        outputId: "68efb8fd-fa23-4978-998c-3c1cc7b4c60c",
        referenceId: "86616ea1-5eb4-4bc0-a7a0-60da43478f0c",
        outputType: "TIMESERIES",
        nodeType: "SIGNAL",
        isReadable: true,
    },
};

function App() {
  const { name, explorerPath } = useDashboardMeta();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
 // const markdown = "**Dashboard Windkraftwerk 1**\n\nEin technisches Überwachungs-Dashboard zur Analyse von Windgeschwindigkeit, Netzspannung und aktuellen Strompreisen für erneuerbare Energien.";



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
      <div style={{ color: "#6b6375", textAlign: "left" }}>{explorerPath}</div>

      <hr />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BsBarChartLine size={16} color="#aa3bff" />
          <span style={{ fontWeight: 600, color: "#08060d" }}>{name}</span>
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
            <BsFullscreenExit size={16} />
          ) : (
            <BsFullscreen size={16} />
          )}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          padding: 16,
          display: "grid",
          gap: 12,
        }}>
          <div
              style={{
                  width: "100%",
                  height: 450,
              }}
          >
              <LineChartWidget
                  title="Momentane Windgeschwindigkeit"
                  panelStyle={{
                      backgroundColor: "#f8f8f8",
                      backgroundOpacity: 100,
                  }}
                  showPanelBar={true}
                  panelConfiguration={lineChartConfiguration}
                  dataSourceOutputs={lineChartDataSourceOutputs}
                  layoutPos={{
                      w: 7,
                      h: 8,
                      x: 0,
                      y: 0,
                  }}
              />
          </div>
      </div>
    </div>
  );
}

export default App;

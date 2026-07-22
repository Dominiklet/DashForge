import "../App.css";
import { BsBarChartLine, BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import type {Layout, Panel} from "../types/layout.ts";
import { KpiWidget } from "./KpiWidget";
import { TextWidget } from "./TextWidget";
import type {
  KpiPanelConfiguration,
  TextPanelConfiguration,
} from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

export interface DashboardInterface {
  layout:Layout;
}

function renderPanel(panel: Panel) {
  switch (panel.panelType) {
    case "KPI":
      return (
        <KpiWidget
          panel={panel}
          panelConfiguration={panel.panelConfiguration as KpiPanelConfiguration}
        />
      );
    case "TEXT":
      return (
        <TextWidget
          panel={panel}
          panelConfiguration={panel.panelConfiguration as TextPanelConfiguration}
        />
      );
    default:
      // TODO: PlotWidget umsetzen
      return null;
  }
}

export function Dashboard(dashboardInterface: DashboardInterface) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const layout = dashboardInterface.layout;
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if(!layout) return <div></div>

  return (
    <div ref={containerRef} className="fullscreen">
      <div style={{ color: "#6b6375", textAlign: "left" }}>{layout.explorerpath}</div>
      <hr />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BsBarChartLine size={16} color="#aa3bff" />
          <span style={{ fontWeight: 600, color: "#08060d" }}>{layout.name}</span>
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
          gridTemplateColumns: "repeat(24, 1fr)",
          gridAutoRows: "40px",
          gap: 12,
        }}>
        {layout.panels.map((panel, index) => (
          <div
            key={index}
            style={{
              gridColumn: `${panel.layoutPos.x + 1} / span ${panel.layoutPos.w}`,
              gridRow: `${panel.layoutPos.y + 1} / span ${panel.layoutPos.h}`,
            }}>
            {renderPanel(panel)}
          </div>
        ))}
      </div>
    </div>
  );
}

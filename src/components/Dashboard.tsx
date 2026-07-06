import "../App.css";
import { BsBarChartLine, BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { KpiWidget } from "./KpiWidget";
import { TextWidget } from "./TextWidget";

interface DashboardProps {
  name: string;
  explorerPath: string;
  markdownTitle: string;
  markdownDataSourceId: string;
  kpiTitle: string;
  kpiDataSourceId: string;
  kpiFractionDigits?: number;
}

export function Dashboard({
  name,
  explorerPath,
  markdownTitle,
  markdownDataSourceId,
  kpiTitle,
  kpiDataSourceId,
  kpiFractionDigits = 4,
}: DashboardProps) {
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
        <TextWidget
          title={markdownTitle}
          panelStyle={{ backgroundColor: "#f8f8f8" }}
          showPanelBar={true}
          dataSourceId={markdownDataSourceId}
        />

        <KpiWidget
          title={kpiTitle}
          panelStyle={{ backgroundColor: "#f8f8f8" }}
          showPanelBar={true}
          dataSourceId={kpiDataSourceId}
          fractionDigits={kpiFractionDigits}
        />
      </div>
    </div>
  );
}

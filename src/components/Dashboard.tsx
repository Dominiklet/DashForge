import "../App.css";
import {BsBarChartLine, BsFullscreen, BsFullscreenExit} from "react-icons/bs";
import {useEffect, useState} from "react";
import type {Layout, Panel} from "../types/layout.ts";

import {ReactGridLayout, useContainerWidth} from "react-grid-layout";
import {WidgetBase} from "./WidgetBase.tsx";

export interface DashboardInterface {
  layout: Layout;
}

export function Dashboard(dashboardInterface: DashboardInterface) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const layout = dashboardInterface.layout;
  const panels = layout.panels;
  const {width, containerRef} = useContainerWidth();
  const col = 24;

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


  if (!layout) return <div></div>

  const getGrid = function (panel: Panel) {
    return {x: panel.layoutPos.x, y: panel.layoutPos.y, w: panel.layoutPos.w, h: panel.layoutPos.h, i: panel.id}
  }

  return <div ref={containerRef} className="fullscreen">
    <div style={{color: "#6b6375", textAlign: "left"}}>{layout.explorerpath}</div>
    <hr/>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <div style={{display: "flex", alignItems: "center", gap: 8}}>
        <BsBarChartLine size={16} color="#aa3bff"/>
        <span style={{fontWeight: 600, color: "#08060d"}}>{layout.name}</span>
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

    <ReactGridLayout
      width={width}
      gridConfig={{cols: col, rowHeight: width / col / 2}}>
      {panels.map(panel =>
          <div
              key={panel.id}
              data-grid={getGrid(panel)}
              style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  overflow: "hidden",
              }}
          >
              <WidgetBase panel={panel} />
          </div>
      )}
    </ReactGridLayout>
  </div>
}

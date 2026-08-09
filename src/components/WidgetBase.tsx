import "./WidgetBase.css";
import type {Panel} from "../types/layout.ts";
import {TextWidget} from "./TextWidget/TextWidget.tsx";
import {KpiWidget} from "./KpiWidget/KpiWidget.tsx";
import { LineChartWidget } from "./LineChart/LineChart.tsx";

interface WidgetBaseProps {
  panel: Panel;
}

export function WidgetBase(widgetBaseProps: WidgetBaseProps) {
  const panel = widgetBaseProps.panel;
  const title = panel.title;
  const panelStyle = panel.panelStyle;
  const showPanelBar  = panel.showPanelBar;

  const margin =
    !panelStyle.selfManagedMargins
      ? {
          marginTop: panelStyle.marginTop ?? undefined,
          marginRight: panelStyle.marginRight ?? undefined,
          marginBottom: panelStyle.marginBottom ?? undefined,
          marginLeft: panelStyle.marginLeft ?? undefined,
        }
      : {};

  const renderPanel = function () {
    switch (panel.panelType) {
      case 'KPI' :
        return  <KpiWidget panel={panel}></KpiWidget>
      case 'PLOT' :
        return <LineChartWidget panel={panel}></LineChartWidget>
      case 'TEXT' :
        return <TextWidget panel={panel}></TextWidget>
      case 'IMAGE' :
        return <div></div>
      default :
        return <div></div>
    }
  }

  return (
    <div
      className="widget-base"
      style={{
        backgroundColor: panelStyle.backgroundColor != null ? panelStyle.backgroundColor : "#F8F8F8",
        color: panelStyle.textColor ?? undefined,
        ...margin,
      }}
    >
      {showPanelBar && (
        <div className="widget-header">
          <span className="widget-title">{title}</span>
        </div>
      )}
      <div>
        {renderPanel()}
      </div>
    </div>
  );
}

import { BsExclamationCircle } from "react-icons/bs";
import "./WidgetBase.css";
import type {Panel} from "../types/layout.ts";
import type { ReactNode } from "react";

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function WidgetNoData() {
  return (
    <div className="widget-no-data">
      <BsExclamationCircle size={24} />
      <span>Keine Daten verfügbar</span>
    </div>
  );
}

interface WidgetBaseProps {
  panel: Panel;
  hasData: boolean;
  children: ReactNode;
}

export function WidgetBase(widgetBaseProps: WidgetBaseProps) {
  const title = widgetBaseProps.panel.title;
  const panelStyle = widgetBaseProps.panel.panelStyle;
  const showPanelBar  = widgetBaseProps.panel.showPanelBar;

  const background = hexToRgba(panelStyle.backgroundColor,1);

  const margin =
    !panelStyle.selfManagedMargins
      ? {
          marginTop: panelStyle.marginTop ?? undefined,
          marginRight: panelStyle.marginRight ?? undefined,
          marginBottom: panelStyle.marginBottom ?? undefined,
          marginLeft: panelStyle.marginLeft ?? undefined,
        }
      : {};

  return (
    <div
      className="widget-base"
      style={{
        backgroundColor: background,
        color: panelStyle.textColor,
        ...margin,
      }}
    >
      {showPanelBar && (
        <div className="widget-header">
          <span className="widget-title">{title}</span>
        </div>
      )}
      <div className="widget-content">
        {widgetBaseProps.hasData ? widgetBaseProps.children : <WidgetNoData />}
      </div>
    </div>
  );
}

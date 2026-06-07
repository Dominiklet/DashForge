import { BsExclamationCircle } from "react-icons/bs";
import type { WidgetBaseProps } from "../types/panel";
import "./WidgetBase.css";

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

export function WidgetBase({
  title,
  panelStyle,
  showPanelBar,
  hasData,
  children,
}: WidgetBaseProps) {
  const {
    backgroundColor,
    backgroundOpacity,
    textColor,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    selfManagedMargins,
  } = panelStyle;

  const background =
    backgroundColor && backgroundOpacity !== null
      ? hexToRgba(backgroundColor, backgroundOpacity)
      : backgroundColor ?? undefined;

  const margin =
    selfManagedMargins !== true
      ? {
          marginTop: marginTop ?? undefined,
          marginRight: marginRight ?? undefined,
          marginBottom: marginBottom ?? undefined,
          marginLeft: marginLeft ?? undefined,
        }
      : {};

  return (
    <div
      className="widget-base"
      style={{
        backgroundColor: background,
        color: textColor ?? undefined,
        ...margin,
      }}
    >
      {showPanelBar && (
        <div className="widget-header">
          <span className="widget-title">{title}</span>
        </div>
      )}
      <div className="widget-content">
        {hasData ? children : <WidgetNoData />}
      </div>
    </div>
  );
}

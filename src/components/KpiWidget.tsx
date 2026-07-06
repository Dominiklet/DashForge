import type { DataPoint, PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";
import { useDataSource } from "../context/useDataSource";

interface KpiWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  dataSourceId: string;
  defaultText?: string;
  fontSizeText?: number;
  fontSizeValue?: number;
  fractionDigits?: number;
  defaultTextPosition?: "top" | "bottom";
}

function getLatestValue(data: DataPoint[]): number | null {
  if (!data || data.length === 0) return null;
  return data.reduce((latest, point) =>
    point.timestamp > latest.timestamp ? point : latest,
  ).value;
}

export function KpiWidget({
  title,
  panelStyle,
  showPanelBar,
  dataSourceId,
  defaultText = "Letzter Preis",
  fractionDigits = 2,
  defaultTextPosition = "top",
}: KpiWidgetProps) {
  const source = useDataSource(dataSourceId);
  const data = source?.type === "timeseries" ? source.data : [];
  const unit = source?.type === "timeseries" ? source.metadata.unit : null;
  const latestValue = getLatestValue(data);

  return (
    <WidgetBase
      title={title}
      panelStyle={panelStyle}
      showPanelBar={showPanelBar}
      hasData={latestValue !== null}>
      <div className="widget-kpi">
        {defaultTextPosition === "top" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
        <span className="kpi-value">
          {latestValue?.toLocaleString("de-DE", {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
          })}
          {unit && <span className="kpi-unit">{unit}</span>}
        </span>
        {defaultTextPosition === "bottom" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
      </div>
    </WidgetBase>
  );
}

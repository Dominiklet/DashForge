import {WidgetBase} from "./WidgetBase";
import type {Panel} from "../types/layout.ts";
import {useContext} from "react";
import {DataContext} from "../Context/DataContext.tsx";
import type {TimeData} from "../types/TimeData.ts";
import type {KpiData} from "../types/DataTypes/KpiData.ts";
import type {KpiPanelConfiguration} from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface KpiWidgetProps {
  panel: Panel
  panelConfiguration: KpiPanelConfiguration;
}


export function KpiWidget( {panel, panelConfiguration}: KpiWidgetProps) {

  const dataContext: TimeData | undefined = useContext(DataContext);
  const outputId = Object.values(panel.dataSourceOutputs)[0]?.outputId;
  const kpiData = outputId ? (dataContext?.[outputId] as KpiData | undefined) : undefined;

  const {defaultText, defaultTextPosition, fractionDigits} = panelConfiguration;


  return (
    <WidgetBase
      panel={panel}
      hasData={!!kpiData}>
      <div className="widget-kpi">
        {defaultTextPosition === "top" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
        <span className="kpi-value">
          {kpiData?.value?.toLocaleString("de-DE", {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
          })}
          {kpiData?.unit && <span className="kpi-unit">{kpiData.unit}</span>}
        </span>
        {defaultTextPosition === "bottom" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
      </div>
    </WidgetBase>
  );
}

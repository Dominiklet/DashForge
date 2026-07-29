import {WidgetBase} from "./WidgetBase";
import type {Panel} from "../types/layout.ts";
import {useContext} from "react";
import {DataContext} from "../Context/DataContext.tsx";
import type {TimeData} from "../types/TimeData.ts";
import type {KpiData} from "../types/DataTypes/KpiData.ts";
import type {KpiPanelConfiguration} from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface KpiWidgetProps {
  panel: Panel
}


export function KpiWidget( {panel}: KpiWidgetProps) {

  const dataContext: TimeData | undefined = useContext(DataContext);
  const outputId = Object.values(panel.dataSourceOutputs)[0]?.outputId;
  const kpiData = outputId ? (dataContext?.[outputId] as KpiData | undefined) : undefined;
  const kpiPanelConfiguration = panel.panelConfiguration as KpiPanelConfiguration


  return (
    <WidgetBase
      panel={panel}
      hasData={!!kpiData}>
      <div className="widget-kpi">
        {kpiPanelConfiguration.defaultTextPosition === "top" && kpiPanelConfiguration.defaultText && (
          <span className="kpi-label">{kpiPanelConfiguration.defaultText}</span>
        )}
        <span className="kpi-value">
          {kpiData?.value?.toLocaleString("de-DE", {
            minimumFractionDigits: kpiPanelConfiguration.fractionDigits,
            maximumFractionDigits: kpiPanelConfiguration.fractionDigits,
          })}
          {kpiData?.unit && <span className="kpi-unit">{kpiData.unit}</span>}
        </span>
        {kpiPanelConfiguration.defaultTextPosition === "bottom" && kpiPanelConfiguration.defaultText && (
          <span className="kpi-label">{kpiPanelConfiguration.defaultText}</span>
        )}
      </div>
    </WidgetBase>
  );
}

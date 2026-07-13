import {WidgetBase} from "./WidgetBase";
import type {Panel} from "../types/layout.ts";
import {useContext, useState} from "react";
import {DataContext} from "../Context/DataContext.tsx";
import type {TimeData} from "../types/TimeData.ts";
import type {KpiData} from "../types/DataTypes/KpiData.ts";
import type {PanelData} from "../types/DataTypes/PanelData.ts";

interface KpiWidgetProps {
  panel: Panel
}


export function KpiWidget(kpiWindgetProp: KpiWidgetProps) {
  const [kpiData, setKpiData] = useState<KpiData>({id: "", unit: " ", value: 0})
  const panel: Panel = kpiWindgetProp.panel;
  const dataContext: TimeData | undefined = useContext(DataContext);

  if (dataContext) {
    const fetchedData: PanelData = dataContext[panel.dataSourceOutputs[0].outputId]
    if (fetchedData) {
      setKpiData(fetchedData as KpiData);
    }
  }


  return (
    <WidgetBase
      panel={panel}
      hasData={!!kpiData}>
      <div className="widget-kpi">
        {defaultTextPosition === "top" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
        <span className="kpi-value">
          {kpiData.value?.toLocaleString("de-DE", {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
          })}
          {kpiData.unit && <span className="kpi-unit">{kpiData.unit}</span>}
        </span>
        {defaultTextPosition === "bottom" && defaultText && (
          <span className="kpi-label">{defaultText}</span>
        )}
      </div>
    </WidgetBase>
  );
}

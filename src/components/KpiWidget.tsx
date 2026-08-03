import {WidgetBase} from "./WidgetBase";
import type {Panel} from "../types/layout.ts";
import {useContext} from "react";
import {DataContext} from "../Context/DataContext.tsx";
import type {TimeData} from "../types/TimeData.ts";
import type {KpiData} from "../types/DataTypes/KpiData.ts";
import type {KpiLimitConfiguration, KpiPanelConfiguration} from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface KpiWidgetProps {
  panel: Panel
}

function getBreachedLimit(
  value: number | undefined,
  lowerLimit: KpiLimitConfiguration,
  upperLimit: KpiLimitConfiguration
): KpiLimitConfiguration | undefined {
  if (value === undefined) return undefined;

  const lowerBreached = lowerLimit.strict ? value < lowerLimit.value : value <= lowerLimit.value;
  if (lowerBreached) return lowerLimit;

  const upperBreached = upperLimit.strict ? value > upperLimit.value : value >= upperLimit.value;
  if (upperBreached) return upperLimit;

  return undefined;
}

export function KpiWidget( {panel}: KpiWidgetProps) {

  const dataContext: TimeData | undefined = useContext(DataContext);
  const outputId = Object.values(panel.dataSourceOutputs)[0]?.outputId;
  const kpiData = outputId ? (dataContext?.[outputId] as KpiData | undefined) : undefined;
  const kpiPanelConfiguration = panel.panelConfiguration as KpiPanelConfiguration

  const breachedLimit = getBreachedLimit(kpiData?.value, kpiPanelConfiguration.lowerLimit, kpiPanelConfiguration.upperLimit);
  const label = breachedLimit?.limitBreakText || kpiPanelConfiguration.defaultText;
  const hideValue = breachedLimit?.hideSensorValue ?? false;
  const textColor = breachedLimit?.limitTextColor;

  return (
    <WidgetBase
      panel={panel}
      hasData={!!kpiData}>
      <div className="widget-kpi" style={{backgroundColor: breachedLimit?.limitBackgroundColor}}>
        {kpiPanelConfiguration.defaultTextPosition === "top" && label && (
          <span className="kpi-label" style={{color: textColor}}>{label}</span>
        )}
        {!hideValue && (
          <span className="kpi-value" style={{color: textColor}}>
            {kpiData?.value?.toLocaleString("de-DE", {
              minimumFractionDigits: kpiPanelConfiguration.fractionDigits,
              maximumFractionDigits: kpiPanelConfiguration.fractionDigits,
            })}
            {kpiData?.unit && <span className="kpi-unit">{kpiData.unit}</span>}
          </span>
        )}
        {kpiPanelConfiguration.defaultTextPosition === "bottom" && label && (
          <span className="kpi-label" style={{color: textColor}}>{label}</span>
        )}
      </div>
    </WidgetBase>
  );
}

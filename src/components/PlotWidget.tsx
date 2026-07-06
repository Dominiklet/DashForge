import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";
import { useDataSource } from "../context/useDataSource";

interface PlotWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  dataSourceId: string;
}

export function PlotWidget({ title, panelStyle, showPanelBar, dataSourceId }: PlotWidgetProps) {
  const source = useDataSource(dataSourceId);
  const data = source?.type === "timeseries" ? source.data : [];

  return (
    <WidgetBase title={title} panelStyle={panelStyle} showPanelBar={showPanelBar} hasData={data.length > 0}>
      <></>
    </WidgetBase>
  );
}

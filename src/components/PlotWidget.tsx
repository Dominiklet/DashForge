import type { ReactNode } from "react";
import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";

interface PlotWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  hasData: boolean;
  children: ReactNode;
}

export function PlotWidget({ title, panelStyle, showPanelBar, hasData, children }: PlotWidgetProps) {
  return (
    <WidgetBase title={title} panelStyle={panelStyle} showPanelBar={showPanelBar} hasData={hasData}>
      {children}
    </WidgetBase>
  );
}

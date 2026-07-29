import type { ReactNode } from "react";
import { WidgetBase } from "./WidgetBase";
import type { Panel } from "../types/layout.ts";

interface PlotWidgetProps {
  panel: Panel;
  hasData: boolean;
  children: ReactNode;
}

export function PlotWidget({ panel, hasData, children }: PlotWidgetProps) {
  return (
    <WidgetBase panel={panel} hasData={hasData}>
      {children}
    </WidgetBase>
  );
}

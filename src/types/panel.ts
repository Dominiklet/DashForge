import type { ReactNode } from "react";

export interface PanelStyle {
  backgroundColor: string | null;
  backgroundOpacity: number | null;
  textColor: string | null;
  marginTop: number | null;
  marginRight: number | null;
  marginBottom: number | null;
  marginLeft: number | null;
  selfManagedMargins: boolean | null;
}

export interface WidgetBaseProps {
  title: string;
  panelStyle: PanelStyle;
  showPanelBar: boolean;
  hasData: boolean;
  children: ReactNode;
}

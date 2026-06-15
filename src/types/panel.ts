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

export const defaultPanelStyle: PanelStyle = {
  backgroundColor: null,
  backgroundOpacity: null,
  textColor: null,
  marginTop: null,
  marginRight: null,
  marginBottom: null,
  marginLeft: null,
  selfManagedMargins: null,
};

export interface WidgetBaseProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  hasData: boolean;
  children: ReactNode;
}

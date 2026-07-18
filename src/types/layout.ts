import type {PanelConfiguration} from "./PanelConfigurationTypes/PanelConfiguration.ts";

export interface Layout {
  name: string,
  backgroundColor: string,
  refreshInterval: number,
  panels: Panel[],
  explorerpath: string,
  layout?: Layout | null
}

export interface Panel {
  panelType: string;
  panelStyle: PanelStyle;
  panelConfiguration: PanelConfiguration | PanelConfiguration[];
  timeRange: string;
  title: string;
  showPanelBar: boolean;
  layoutPos: LayoutPos;
  dataSourceOutputs: { [outputId: string]: DataSourceOutput };
}

export interface PanelStyle {
  marginRight: string;
  marginLeft: string;
  marginBottom: string;
  marginTop: string;
  backgroundColor: string;
  textColor: string;
  selfManagedMargins: string;
}



export interface LayoutPos {
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface DataSourceOutput {
  outputId: string;
  referenceId: string;
  outputType: string;
  nodeType: string;
  isReadable: boolean;
}
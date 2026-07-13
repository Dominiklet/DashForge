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
  panelConfiguration: PanelConfiguration[];
  timeRange: string;
  title: string;
  showPanelBar: boolean;
  layoutPos: LayoutPos;
  dataSourceOutputs: DataSourceOutput[];
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

export interface PanelConfiguration {
  alignment: string;
  originalImageName: string;
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
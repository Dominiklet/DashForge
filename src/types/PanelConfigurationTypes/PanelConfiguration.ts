export type PanelConfiguration = object;

export interface KpiPanelConfiguration extends PanelConfiguration {
  lowerLimit: KpiLimitConfiguration;
  upperLimit: KpiLimitConfiguration;
  defaultText: string;
  kpiCalcType: string;
  fontSizeText: number;
  fontSizeValue: number;
  fractionDigits: number;
  useLatestValue: boolean;
  hideSensorValue: boolean;
  isManualFormatting: boolean;
  defaultTextPosition: "top" | "bottom";
}

export interface KpiLimitConfiguration {
  value: number;
  strict: boolean;
  limitBreakText: string;
  limitTextColor: string;
  hideSensorValue: boolean;
  limitBackgroundColor: string;
}

export interface TextPanelConfiguration extends PanelConfiguration {
  code: string;
}

export interface AxisConfig {
  useUnitOnAxis: boolean;
  useDefaultAxis: boolean;
}

export interface LineConfig {
  gap: number;
  color: string;
  lineSize: number;
  lineType: string;
  linePointType: string;
  lineInterpolation: string;
}

export interface LegendConfig {
  show: boolean;
  position: string;
  showUnit: boolean;
  adjustment: string;
}

export interface CommentsConfig {
  isCommentsEnabled: boolean;
}

export interface PlotPanelConfiguration extends PanelConfiguration {
  id: string;
  axisConfig: AxisConfig;
  lineConfig: LineConfig;
  legendConfig: LegendConfig;
  commentsConfig: CommentsConfig;
}

export interface ImagePanelConfiguration extends PanelConfiguration {
  alignment: "SCALED_TO_PANEL_SIZE" | "ORIGINAL_SIZE" | "CENTERED";
  originalImageName: string;
}
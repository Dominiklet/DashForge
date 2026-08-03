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

export type LineType =
    | "solid"
    | "dashed"
    | "dotted";

export type LinePointType =
    | "none"
    | "point";

export type LineInterpolation =
    | "linear"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";

export type LegendPosition =
    | "TOP"
    | "BOTTOM"
    | "LEFT"
    | "RIGHT";

export type LegendAdjustment =
    | "START"
    | "CENTER"
    | "END";

export interface AxisConfig {
  useUnitOnAxis: boolean;
  useDefaultAxis: boolean;
}

export interface LineConfig {
  gap: number;
  color: string;
  lineSize: number;
  lineType: LineType;
  linePointType: LinePointType;
  lineInterpolation: LineInterpolation;
}

export interface LegendConfig {
  show: boolean;
  position: LegendPosition;
  showUnit: boolean;
  adjustment: LegendAdjustment;
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
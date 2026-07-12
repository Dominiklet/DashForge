import type { WidgetBaseProps } from "../types/panel.ts";

import type { CSSProperties } from "react";


export interface TimeSeriesPoint {
    timestamp: number;
    value: number;
}

export interface TimeSeries {
    id: string;
    data: TimeSeriesPoint[];
}

/**
 * Key = outputId
 * Value = zugehörige Zeitreihe
 */
export type TimeSeriesMap = Record<string, TimeSeries>;

export interface AxisConfig {
    useUnitOnAxis: boolean;
    useDefaultAxis: boolean;
}

export type LineType = "solid" | "dashed" | "dotted";

export type LinePointType = "none" | "circle";

export type LineInterpolation =
    | "linear"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";

export interface LineConfig {
    gap: number;
    color: string;
    lineSize: number;
    lineType: LineType;
    linePointType: LinePointType;
    lineInterpolation: LineInterpolation;
}

export type LegendPosition = "TOP" | "BOTTOM" | "LEFT" | "RIGHT";

export type LegendAdjustment = "START" | "CENTER" | "END";

export interface LegendConfig {
    show: boolean;
    position: LegendPosition;
    showUnit: boolean;
    adjustment: LegendAdjustment;
}

export interface CommentsConfig {
    isCommentsEnabled: boolean;
}

export interface PlotConfiguration {
    id: string;
    axisConfig: AxisConfig;
    lineConfig: LineConfig;
    legendConfig: LegendConfig;
    commentsConfig?: CommentsConfig;
}

export interface DataSourceOutput {
    outputId: string;
    referenceId: string;
    outputType: "TIMESERIES";
    nodeType: string;
    isReadable: boolean;
}

export interface LayoutPosition {
    w: number;
    h: number;
    x: number;
    y: number;
}

/**
 * Die WidgetBase erhält title, panelStyle und showPanelBar.
 *
 * hasData und children legt die LineChartWidget selbst fest.
 */
export interface LineChartWidgetProps
    extends Omit<WidgetBaseProps, "hasData" | "children"> {
    panelConfiguration: PlotConfiguration[];
    dataSourceOutputs: Record<string, DataSourceOutput>;
    layoutPos: LayoutPosition;
}

/**
 * Optional, falls du das Widget testweise ohne Grid darstellen möchtest.
 */
export interface LineChartContainerStyle {
    style?: CSSProperties;
}
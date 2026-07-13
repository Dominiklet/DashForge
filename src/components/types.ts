import type { WidgetBaseProps } from "../types/panel";

export interface TimeSeriesPoint {
    timestamp: number;
    value: number;
}

export interface TimeSeries {
    data: TimeSeriesPoint[];
}

/**
 * Key = outputId
 */
export type TimeSeriesMap = Record<string, TimeSeries>;

export interface SignalMetadata {
    name: string;
    unit: string | null;
    startDate: string;
    endDate: string;
    timeZone: string;
    annotations: unknown[];
}

/**
 * Key = outputId
 */
export type MetadataMap = Record<string, SignalMetadata>;

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

export type LegendPosition =
    | "TOP"
    | "BOTTOM"
    | "LEFT"
    | "RIGHT";

export type LegendAdjustment =
    | "START"
    | "CENTER"
    | "END";

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
    /**
     * ID der einzelnen Linienkonfiguration.
     * Mit dieser ID wird der DataSourceOutput gefunden.
     */
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

export interface LineChartWidgetProps
    extends Omit<WidgetBaseProps, "children" | "hasData"> {
    panelConfiguration: PlotConfiguration[];

    dataSourceOutputs: Record<string, DataSourceOutput>;

    /**
     * Die Metadaten werden von außen übergeben.
     * Key = outputId
     */
    metadata: MetadataMap;

    layoutPos: LayoutPosition;
}
import { useContext } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { WidgetBase } from "./WidgetBase";
import { DataContext } from "../Context/DataContext";
import { MetaDataContext } from "../Context/MetaDataContext";
import type {Panel} from "../types/layout.ts";
import type { Meta } from "../types/MetaData";
import type { TimeSeries } from "../types/DataTypes/TimeSeries";
import type {
    LegendAdjustment,
    LegendPosition,
    LineType,
    PlotPanelConfiguration,
} from "../types/PanelConfigurationTypes/PanelConfiguration";



interface LineChartWidgetProps {
    panel: Panel;
}

interface ResolvedLine {
    config: PlotPanelConfiguration;
    outputId: string;
    series: TimeSeries;
    metadata: Meta;
    yAxisId: string;
}

interface ChartRow {
    timestamp: number;
    [key: string]: number;
}

interface ResolvedAxis {
    id: string;
    unit: string;
    orientation: "left" | "right";
    useUnitOnAxis: boolean;
    useDefaultAxis: boolean;
    color: string;
}


function isTimeSeries(value: unknown): value is TimeSeries {
    if (
        typeof value !== "object" ||
        value === null ||
        !("id" in value) ||
        !("data" in value)
    ) {
        return false;
    }

    const candidate = value as TimeSeries;

    if (
        typeof candidate.id !== "string" ||
        !Array.isArray(candidate.data)
    ) {
        return false;
    }

    return candidate.data.every(
        (point) =>
            typeof point === "object" &&
            point !== null &&
            typeof point.timestamp === "number" &&
            typeof point.value === "number"
    );
}

function getStrokeDasharray(
    lineType: LineType
): string | undefined {
    switch (lineType) {
        case "dashed":
            return "6 4";

        case "dotted":
            return "2 4";

        case "solid":
        default:
            return undefined;
    }
}

function formatTimestamp(
    timestamp: number,
    timeZone?: string
): string {
    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
    }).format(new Date(timestamp));
}

function getLegendLayout(
    position: LegendPosition
): "horizontal" | "vertical" {
    return position === "LEFT" || position === "RIGHT"
        ? "vertical"
        : "horizontal";
}

function getLegendVerticalAlign(
    position: LegendPosition
): "top" | "middle" | "bottom" {
    switch (position) {
        case "BOTTOM":
            return "bottom";

        case "LEFT":
        case "RIGHT":
            return "middle";

        case "TOP":
        default:
            return "top";
    }
}

function getLegendAlign(
    position: LegendPosition,
    adjustment: LegendAdjustment
): "left" | "center" | "right" {
    if (position === "LEFT") {
        return "left";
    }

    if (position === "RIGHT") {
        return "right";
    }

    switch (adjustment) {
        case "START":
            return "left";

        case "END":
            return "right";

        case "CENTER":
        default:
            return "center";
    }
}
function buildChartData(
    resolvedLines: ResolvedLine[]
): ChartRow[] {
    const chartDataMap = new Map<number, ChartRow>();

    resolvedLines.forEach(({ outputId, series }) => {
        series.data.forEach((point) => {
            const row = chartDataMap.get(point.timestamp) ?? {
                timestamp: point.timestamp,
            };

            row[outputId] = point.value;

            chartDataMap.set(point.timestamp, row);
        });
    });

    return Array.from(chartDataMap.values()).sort(
        (firstPoint, secondPoint) =>
            firstPoint.timestamp - secondPoint.timestamp
    );
}

function buildAxes(
    resolvedLines: ResolvedLine[]
): ResolvedAxis[] {
    const axes = new Map<string, ResolvedAxis>();

    resolvedLines.forEach(
        ({ config, metadata, yAxisId }) => {
            if (axes.has(yAxisId)) {
                return;
            }

            axes.set(yAxisId, {
                id: yAxisId,
                unit: metadata.unit,
                orientation: "left",
                useUnitOnAxis:
                config.axisConfig.useUnitOnAxis,
                useDefaultAxis:
                config.axisConfig.useDefaultAxis,
                color: config.lineConfig.color,
            });
        }
    );

    return Array.from(axes.values());
}

export function LineChartWidget({
                                    panel,
                                }: LineChartWidgetProps) {
    const timeData = useContext(DataContext);
    const metadata = useContext(MetaDataContext);

    const panelConfiguration =
        panel.panelConfiguration as PlotPanelConfiguration[];

    const dataSourceOutputs = panel.dataSourceOutputs;

    if (!timeData) {
        throw new Error(
            "LineChartWidget muss innerhalb eines DataContext.Provider verwendet werden."
        );
    }

    if (!metadata) {
        throw new Error(
            "LineChartWidget muss innerhalb eines MetaDataContext.Provider verwendet werden."
        );
    }

    const resolvedLines: ResolvedLine[] =
        panelConfiguration.flatMap((config) => {

            const output = dataSourceOutputs[config.id];

            if (!output) {
                console.warn(
                    `Kein DataSourceOutput für Konfiguration ${config.id} gefunden.`
                );

                return [];
            }

            if (!output.isReadable) {
                console.warn(
                    `Der Output ${output.outputId} ist nicht lesbar.`
                );

                return [];
            }

            if (output.outputType !== "TIMESERIES") {
                console.warn(
                    `Der Output ${output.outputId} besitzt nicht den Typ TIMESERIES.`
                );

                return [];
            }

            const panelData = timeData[output.outputId];
            const signalMeta = metadata[output.outputId];

            if (!panelData || !isTimeSeries(panelData)) {
                console.warn(
                    `Keine gültige TimeSeries für outputId ${output.outputId} gefunden.`
                );

                return [];
            }

            if (panelData.data.length === 0) {
                console.warn(
                    `Die TimeSeries für outputId ${output.outputId} enthält keine Daten.`
                );

                return [];
            }

            if (!signalMeta) {
                console.warn(
                    `Keine Metadaten für outputId ${output.outputId} gefunden.`
                );

                return [];
            }


            const yAxisId =
                signalMeta.unit || output.outputId;

            return [
                {
                    config,
                    outputId: output.outputId,
                    series: panelData,
                    metadata: signalMeta,
                    yAxisId,
                },
            ];
        });

    const chartData = buildChartData(resolvedLines);
    const axes = buildAxes(resolvedLines);

    const hasData = chartData.length > 0;


    const visibleLegendConfig = resolvedLines.find(
        ({ config }) => config.legendConfig.show
    )?.config.legendConfig;


    const chartTimeZone =
        resolvedLines[0]?.metadata.timeZone;

    return (
        <div
            data-grid-width={panel.layoutPos.w}
            data-grid-height={panel.layoutPos.h}
            data-grid-x={panel.layoutPos.x}
            data-grid-y={panel.layoutPos.y}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <WidgetBase
                panel={panel}
                hasData={hasData}
            >
                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            scale="time"
                            minTickGap={40}
                            domain={["dataMin", "dataMax"]}
                            tickFormatter={(value, index) => {
                                const timestamp = Number(value);

                                if (index === 0) {
                                    return new Intl.DateTimeFormat("de-DE", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: chartTimeZone,
                                    }).format(new Date(timestamp));
                                }

                                return new Intl.DateTimeFormat("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: chartTimeZone,
                                }).format(new Date(timestamp));
                            }}
                        />

                        {axes.map((axis) => (
                            <YAxis
                                key={axis.id}
                                yAxisId={axis.id}
                                orientation={axis.orientation}
                                domain={
                                    axis.useDefaultAxis
                                        ? [0, "auto"]
                                        : ["auto", "auto"]
                                }
                                stroke={axis.color}
                                tickFormatter={(value) => {
                                    if (!axis.useUnitOnAxis) {
                                        return String(value);
                                    }

                                    return `${value} ${axis.unit}`;
                                }}
                            />
                        ))}

                        <Tooltip
                            labelFormatter={(value) =>
                                formatTimestamp(
                                    Number(value),
                                    chartTimeZone
                                )
                            }
                            formatter={(value, _name, item) => {
                                const line = resolvedLines.find(
                                    ({ outputId }) =>
                                        outputId === item.dataKey
                                );

                                if (!line) {
                                    return [
                                        value,
                                        String(item.dataKey),
                                    ];
                                }

                                return [
                                    `${value} ${line.metadata.unit}`,
                                    line.metadata.name,
                                ];
                            }}
                        />

                        {visibleLegendConfig && (
                            <Legend
                                layout={getLegendLayout(
                                    visibleLegendConfig.position
                                )}
                                verticalAlign={getLegendVerticalAlign(
                                    visibleLegendConfig.position
                                )}
                                align={getLegendAlign(
                                    visibleLegendConfig.position,
                                    visibleLegendConfig.adjustment
                                )}
                            />
                        )}

                        {resolvedLines.map(
                            ({
                                 config,
                                 outputId,
                                 metadata: lineMetadata,
                                 yAxisId,
                             }) => {
                                const legendName =
                                    config.legendConfig.showUnit
                                        ? `${lineMetadata.name} ${lineMetadata.unit}`
                                        : lineMetadata.name;

                                return (
                                    <Line
                                        key={outputId}
                                        dataKey={outputId}
                                        yAxisId={yAxisId}
                                        name={legendName}
                                        type={
                                            config.lineConfig
                                                .lineInterpolation
                                        }
                                        stroke={
                                            config.lineConfig.color
                                        }
                                        strokeWidth={
                                            config.lineConfig.lineSize
                                        }
                                        strokeDasharray={getStrokeDasharray(
                                            config.lineConfig.lineType
                                        )}
                                        dot={config.lineConfig.linePointType === "point"}
                                        connectNulls={
                                            config.lineConfig.gap === -1
                                        }
                                        legendType={
                                            config.legendConfig.show
                                                ? "line"
                                                : "none"
                                        }
                                        isAnimationActive={false}
                                    />
                                );
                            }
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </WidgetBase>
        </div>
    );
}
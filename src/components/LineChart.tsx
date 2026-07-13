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

import type {
    LegendAdjustment,
    LegendPosition,
    LineChartWidgetProps,
    LineType,
    PlotConfiguration,
    SignalMetadata,
    TimeSeries,
    TimeSeriesMap,
} from "./types";

interface ResolvedLine {
    config: PlotConfiguration;
    outputId: string;
    series: TimeSeries;
    metadata: SignalMetadata;
    yAxisId: string;
}

interface ChartRow {
    timestamp: number;
    [outputId: string]: number;
}

interface ResolvedAxis {
    id: string;
    unit: string | null;
    orientation: "left" | "right";
    useUnitOnAxis: boolean;
    useDefaultAxis: boolean;
    color: string;
}

function getMockTimeSeriesData(): TimeSeriesMap {
    return {
        "b17f0721-4167-427b-b8e8-53c415b8a073": {
            data: [
                {
                    timestamp: 1778054566000,
                    value: 230.63,
                },
                {
                    timestamp: 1778058155000,
                    value: 232.54,
                },
                {
                    timestamp: 1778061611000,
                    value: 234.11,
                },
                {
                    timestamp: 1778066010000,
                    value: 227.89,
                },
                {
                    timestamp: 1778069977000,
                    value: 231.1,
                },
                {
                    timestamp: 1778073914000,
                    value: 232.55,
                },
                {
                    timestamp: 1778078977000,
                    value: 229.85,
                },
                {
                    timestamp: 1778083206000,
                    value: 230.12,
                },
            ],
        },

        "68efb8fd-fa23-4978-998c-3c1cc7b4c60c": {
            data: [
                {
                    timestamp: 1778055098000,
                    value: 230.82,
                },
                {
                    timestamp: 1778058369000,
                    value: 231.29,
                },
                {
                    timestamp: 1778062397000,
                    value: 233.47,
                },
                {
                    timestamp: 1778067123000,
                    value: 233.04,
                },
                {
                    timestamp: 1778070315000,
                    value: 231.98,
                },
                {
                    timestamp: 1778074145000,
                    value: 233.36,
                },
                {
                    timestamp: 1778079230000,
                    value: 233.94,
                },
                {
                    timestamp: 1778083811000,
                    value: 235.3,
                },
            ],
        },
    };
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
    if (position === "LEFT" || position === "RIGHT") {
        return "vertical";
    }

    return "horizontal";
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

    resolvedLines.forEach(({ config, metadata, yAxisId }) => {
        if (axes.has(yAxisId)) {
            return;
        }

        axes.set(yAxisId, {
            id: yAxisId,
            unit: metadata.unit,

            orientation:  "left",

            useUnitOnAxis: config.axisConfig.useUnitOnAxis,
            useDefaultAxis: config.axisConfig.useDefaultAxis,
            color: config.lineConfig.color,
        });
    });

    return Array.from(axes.values());
}

export function LineChartWidget({
                                    title,
                                    panelStyle,
                                    showPanelBar,
                                    panelConfiguration,
                                    dataSourceOutputs,
                                    metadata,
                                    layoutPos,
                                }: LineChartWidgetProps) {
    //TODO
    /**
     * Aktuell kommen hier Mock-Daten.
     */
    const timeSeriesMap = getMockTimeSeriesData();

    /**
     * Später wird nur diese Zeile ersetzt, zum Beispiel:
     *
     * const timeSeriesMap = useTimeSeriesContext();
     */

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
                return [];
            }

            if (output.outputType !== "TIMESERIES") {
                return [];
            }
            const series = timeSeriesMap[output.outputId];
            const signalMetadata = metadata[output.outputId];

            if (!series || series.data.length === 0) {
                console.warn(
                    `Keine TimeSeries für outputId ${output.outputId} gefunden.`
                );

                return [];
            }

            if (!signalMetadata) {
                console.warn(
                    `Keine Metadaten für outputId ${output.outputId} gefunden.`
                );

                return [];
            }
            const yAxisId =
                signalMetadata.unit ?? output.outputId;

            return [
                {
                    config,
                    outputId: output.outputId,
                    series,
                    metadata: signalMetadata,
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
            data-grid-width={layoutPos.w}
            data-grid-height={layoutPos.h}
            data-grid-x={layoutPos.x}
            data-grid-y={layoutPos.y}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <WidgetBase
                title={title}
                panelStyle={panelStyle}
                showPanelBar={showPanelBar}
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
                            domain={["dataMin", "dataMax"]}
                            tickFormatter={(value) =>
                                formatTimestamp(
                                    Number(value),
                                    chartTimeZone
                                )
                            }
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
                                    if (
                                        !axis.useUnitOnAxis ||
                                        !axis.unit
                                    ) {
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
                                    return [value, String(item.dataKey)];
                                }

                                const formattedValue =
                                    line.metadata.unit
                                        ? `${value} ${line.metadata.unit}`
                                        : value;

                                return [
                                    formattedValue,
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
                                    config.legendConfig.showUnit &&
                                    lineMetadata.unit
                                        ? `${lineMetadata.name} ${lineMetadata.unit}`
                                        : lineMetadata.name;

                                return (
                                    <Line
                                        key={outputId}
                                        dataKey={outputId}
                                        yAxisId={yAxisId}
                                        name={legendName}
                                        type={
                                            config.lineConfig.lineInterpolation
                                        }
                                        stroke={config.lineConfig.color}
                                        strokeWidth={
                                            config.lineConfig.lineSize
                                        }
                                        strokeDasharray={getStrokeDasharray(
                                            config.lineConfig.lineType
                                        )}
                                        dot={
                                            config.lineConfig.linePointType ===
                                            "none"
                                                ? false
                                                : {
                                                    r: 3,
                                                }
                                        }
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
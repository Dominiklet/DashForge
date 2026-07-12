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
    TimeSeries,
    TimeSeriesMap,
} from "./types.ts";

interface ChartRow {
    timestamp: number;
    [lineId: string]: number;
}

interface ResolvedLine {
    config: PlotConfiguration;
    outputId: string;
    series: TimeSeries;
}

/**
 * Diese Funktion simuliert aktuell den späteren Context.
 *
 * Wichtig:
 * Die Keys des Objekts entsprechen den outputIds aus
 * dataSourceOutputs.
 *
 * Später wird diese Funktion nicht mehr benötigt und durch
 * beispielsweise useTimeSeriesContext() ersetzt.
 */
function getMockTimeSeriesData(): TimeSeriesMap {
    return {
        "b17f0721-4167-427b-b8e8-53c415b8a073": {
            id: "b17f0721-4167-427b-b8e8-53c415b8a073",
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
            id: "68efb8fd-fa23-4978-998c-3c1cc7b4c60c",
            data: [
                {
                    timestamp: 1778055098000,
                    value: 228.82,
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
                    value: 229.04,
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
                    value: 230.94,
                },
                {
                    timestamp: 1778083811000,
                    value: 235.3,
                },
            ],
        },
    };
}

function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
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

export function LineChartWidget({
                                    title,
                                    panelStyle,
                                    showPanelBar,
                                    panelConfiguration,
                                    dataSourceOutputs,
                                    layoutPos,
                                }: LineChartWidgetProps) {
    /**
     * Aktuell:
     */
    const timeSeriesMap = getMockTimeSeriesData();

    /**
     * Später wird nur diese Zeile ausgetauscht:
     *
     * const timeSeriesMap = useTimeSeriesContext();
     */

    const resolvedLines: ResolvedLine[] = panelConfiguration.flatMap(
        (config) => {
            /**
             * Schritt 1:
             * Über die ID der Linienkonfiguration wird der passende
             * DataSourceOutput gefunden.
             */
            const dataSourceOutput = dataSourceOutputs[config.id];

            if (!dataSourceOutput) {
                console.warn(
                    `Kein DataSourceOutput für Konfiguration ${config.id} gefunden.`
                );

                return [];
            }

            if (!dataSourceOutput.isReadable) {
                return [];
            }

            if (dataSourceOutput.outputType !== "TIMESERIES") {
                return [];
            }

            /**
             * Schritt 2:
             * Über outputId wird die richtige Zeitreihe aus dem
             * Mock-Datenspeicher beziehungsweise später aus dem Context
             * gelesen.
             */
            const series = timeSeriesMap[dataSourceOutput.outputId];

            if (!series || series.data.length === 0) {
                console.warn(
                    `Keine TimeSeries für outputId ${dataSourceOutput.outputId} gefunden.`
                );

                return [];
            }

            return [
                {
                    config,
                    outputId: dataSourceOutput.outputId,
                    series,
                },
            ];
        }
    );

    /**
     * Recharts benötigt ein gemeinsames Daten-Array für alle Linien.
     *
     * Das Ergebnis sieht beispielsweise so aus:
     *
     * {
     *   timestamp: 1778054566000,
     *   "b17f...": 230.63,
     *   "68ef...": 228.82
     * }
     */
    const chartDataMap = new Map<number, ChartRow>();

    resolvedLines.forEach(({ config, series }) => {
        series.data.forEach((point) => {
            const chartRow = chartDataMap.get(point.timestamp) ?? {
                timestamp: point.timestamp,
            };

            /**
             * Die config.id dient als dataKey der Linie.
             */
            chartRow[config.id] = point.value;

            chartDataMap.set(point.timestamp, chartRow);
        });
    });

    const chartData = Array.from(chartDataMap.values()).sort(
        (firstPoint, secondPoint) =>
            firstPoint.timestamp - secondPoint.timestamp
    );

    const hasData = chartData.length > 0;

    const legendConfig = resolvedLines.find(
        ({ config }) => config.legendConfig.show
    )?.config.legendConfig;

    return (
        <div
            /**
             * layoutPos wird hier zunächst als Information mitgeführt.
             *
             * Dein Dashboard-Grid sollte später w, h, x und y auswerten.
             */
            data-grid-width={layoutPos.w}
            data-grid-height={layoutPos.h}
            data-grid-x={layoutPos.x}
            data-grid-y={layoutPos.y}
            style={{
                width: "100%",
                height: "100%",
                minHeight: 300,
            }}
        >
            <WidgetBase
                title={title}
                panelStyle={panelStyle}
                showPanelBar={showPanelBar}
                hasData={hasData}
            >
                <div
                    style={{
                        flex: 1,
                        width: "100%",
                        minHeight: 300,
                    }}
                >
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 16,
                                right: 24,
                                bottom: 16,
                                left: 8,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                domain={["dataMin", "dataMax"]}
                                tickFormatter={(value) =>
                                    formatTimestamp(Number(value))
                                }
                            />

                            <YAxis />

                            <Tooltip
                                labelFormatter={(value) =>
                                    formatTimestamp(Number(value))
                                }
                            />

                            {legendConfig && (
                                <Legend
                                    layout={getLegendLayout(
                                        legendConfig.position
                                    )}
                                    verticalAlign={getLegendVerticalAlign(
                                        legendConfig.position
                                    )}
                                    align={getLegendAlign(
                                        legendConfig.position,
                                        legendConfig.adjustment
                                    )}
                                />
                            )}

                            {resolvedLines.map(({ config, outputId }) => (
                                <Line
                                    key={outputId}
                                    dataKey={config.id}
                                    name={outputId}
                                    type={config.lineConfig.lineInterpolation}
                                    stroke={config.lineConfig.color}
                                    strokeWidth={config.lineConfig.lineSize}
                                    strokeDasharray={getStrokeDasharray(
                                        config.lineConfig.lineType
                                    )}
                                    dot={
                                        config.lineConfig.linePointType === "none"
                                            ? false
                                            : {
                                                r: 3,
                                            }
                                    }
                                    connectNulls={config.lineConfig.gap === -1}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </WidgetBase>
        </div>
    );
}
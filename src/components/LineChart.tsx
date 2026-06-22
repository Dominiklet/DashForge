import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { WidgetBase } from "./WidgetBase";

type TimeSeriesPoint = {
    timestamp: number;
    value: number;
};

type LineConfig = {
    lineSize: number;
    lineInterpolation: "linear" | "monotone" | "step";
    lineType: "solid" | "dashed" | "dotted";
    color: string;
    gap: number;
    linePointType: "point" | "none";
};

type AxisConfig = {
    useDefaultAxis: boolean;
    useUnitOnAxis: boolean;
};

export type LegendConfig = {
    position: "RIGHT" | "LEFT" | "TOP" | "BOTTOM";
    adjustment: "START" | "CENTER" | "END";
    show: boolean;
    showUnit: boolean;
};

type PanelConfiguration = {
    id: string;
    lineConfig: LineConfig;
    axisConfig: AxisConfig;
    legendConfig: LegendConfig;
};

export type  PlotPanel = {
    title: string;
    showPanelBar: boolean;
    panelStyle?: any;
    panelConfiguration: PanelConfiguration[];
};

type LineChartWidgetProps = {
    panel: PlotPanel;
    data: TimeSeriesPoint[];
    unit?: string;
};

function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getRechartsLineType(type: LineConfig["lineInterpolation"]) {
    switch (type) {
        case "monotone":
            return "monotone";
        case "step":
            return "step";
        case "linear":
        default:
            return "linear";
    }
}

function getStrokeDasharray(type: LineConfig["lineType"]) {
    switch (type) {
        case "dashed":
            return "6 4";
        case "dotted":
            return "2 4";
        case "solid":
        default:
            return undefined;
    }
}

export function LineChartWidget({ panel, data, unit }: LineChartWidgetProps) {
    const config = panel.panelConfiguration[0];

    const chartData = data
        .map((item) => ({
            timestamp: item.timestamp,
            value: item.value,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    const hasData = chartData.length > 0;

    return (
        <WidgetBase
            title={panel.title}
            panelStyle={panel.panelStyle}
            showPanelBar={panel.showPanelBar}
            hasData={hasData}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={formatTime}
                    />

                    <YAxis
                        tickFormatter={(value) =>
                            config.axisConfig.useUnitOnAxis && unit
                                ? `${value} ${unit}`
                                : `${value}`
                        }
                    />

                    <Tooltip
                        labelFormatter={(label) =>
                            new Date(Number(label)).toLocaleString("de-DE")
                        }
                        formatter={(value) =>
                            unit ? [`${value} ${unit}`, panel.title] : [value, panel.title]
                        }
                    />

                    {config.legendConfig.show && (
                        <Legend
                            verticalAlign={
                                config.legendConfig.position === "TOP" ? "top" : "bottom"
                            }
                            align={
                                config.legendConfig.position === "RIGHT"
                                    ? "right"
                                    : config.legendConfig.position === "LEFT"
                                        ? "left"
                                        : "center"
                            }
                        />
                    )}

                    <Line
                        type={getRechartsLineType(config.lineConfig.lineInterpolation)}
                        dataKey="value"
                        name={
                            config.legendConfig.showUnit && unit
                                ? `${panel.title} (${unit})`
                                : panel.title
                        }
                        stroke={config.lineConfig.color}
                        strokeWidth={config.lineConfig.lineSize}
                        strokeDasharray={getStrokeDasharray(config.lineConfig.lineType)}
                        dot={config.lineConfig.linePointType === "point"}
                        connectNulls={config.lineConfig.gap === -1}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </WidgetBase>
    );
}
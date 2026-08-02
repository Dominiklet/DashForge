package de.dashforge.simulator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;

public class TimeDataSimulator {

    private static final String TIME_DATA_URL =
            "http://localhost:3000/timeData";

    private final HttpService httpService;

    public TimeDataSimulator(HttpService httpService) {
        this.httpService = httpService;
    }

    public void appendDataPoints(
            long timestamp,
            Map<String, Double> valuesByOutputId
    ) throws Exception {

        JsonNode timeData = httpService.get(TIME_DATA_URL);

        for (Map.Entry<String, Double> entry
                : valuesByOutputId.entrySet()) {

            String outputId = entry.getKey();
            double value = entry.getValue();

            JsonNode timeSeries = timeData.get(outputId);

            if (timeSeries == null) {
                System.err.println(
                        "Keine TimeSeries gefunden für ID: "
                                + outputId
                );
                continue;
            }

            JsonNode dataNode = timeSeries.get("data");

            if (!(dataNode instanceof ArrayNode dataArray)) {
                System.err.println(
                        "Kein gültiges data-Array für ID: "
                                + outputId
                );
                continue;
            }

            ObjectNode newDataPoint = dataArray.addObject();

            newDataPoint.put("timestamp", timestamp);
            newDataPoint.put("value", value);

            System.out.println(
                    "Datenpunkt hinzugefügt: "
                            + outputId
                            + " = "
                            + value
            );
        }

        httpService.put(TIME_DATA_URL, timeData);
    }
}
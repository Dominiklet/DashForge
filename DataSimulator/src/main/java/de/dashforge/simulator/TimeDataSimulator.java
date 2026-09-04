package de.dashforge.simulator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TimeDataSimulator {

    private static final String TIME_DATA_URL =
            "http://localhost:3000/timeData";

    private static final long UPDATE_INTERVAL_SECONDS =
            5 ;
    private static final String STROMPREIS_TIME_SERIES_ID =
            "8d40325d-41ff-4806-8bdc-deecbef9d523";
    private static final String STROMPREIS_KPI_ID =
            "593a9943-2484-4b62-bde2-05c9ced253bb";
//TODO
//    private static final long UPDATE_INTERVAL_SECONDS =
//            5 * 60;

    private final HttpService httpService;
    private final ValueProvider valueProvider;

    private final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();

    public TimeDataSimulator(
            HttpService httpService,
            ValueProvider valueProvider
    ) {
        this.httpService = httpService;
        this.valueProvider = valueProvider;
    }

    public void start() {
        scheduler.scheduleAtFixedRate(
                this::updateAllTimeSeriesSafely,
                0,
                UPDATE_INTERVAL_SECONDS,
                TimeUnit.SECONDS
        );

        System.out.println(
                "Simulator started. updating all "
                        + UPDATE_INTERVAL_SECONDS
                        + " seconds."
        );
    }

    private void updateAllTimeSeriesSafely() {
        try {
            updateAllTimeSeries();
        } catch (Exception exception) {
            System.err.println(
                    "Error while updating the timedate:"
            );

            exception.printStackTrace();
        }
    }

    public void updateAllTimeSeries() {
        Double latestElectricityPrice = null;
        for (String outputId
                : valueProvider.getOutputIds()) {

            try {
                double nextValue =
                        valueProvider.getNextValue(
                                outputId
                        );

                rotateSingleTimeSeries(
                        outputId,
                        nextValue
                );
                if (outputId.equals(STROMPREIS_TIME_SERIES_ID)) {
                    latestElectricityPrice = nextValue;
                }

            } catch (Exception exception) {
                System.err.println(
                        "Error with Output-ID "
                                + outputId
                                + ": "
                                + exception.getMessage()
                );
            }
        }
        if (latestElectricityPrice != null) {
            try {
                updateElectricityPriceKpi(
                        latestElectricityPrice
                );
            } catch (Exception exception) {
                System.err.println(
                        "Strompreis-KPI could not be updated: "
                                + exception.getMessage()
                );
            }
        }
    }
    private void updateElectricityPriceKpi(
            double latestPrice
    ) throws Exception {

        String kpiUrl = TIME_DATA_URL + "/" + STROMPREIS_KPI_ID;

        JsonNode kpiNode = httpService.get(kpiUrl);

        if (!(kpiNode instanceof ObjectNode kpiObject)) {
            throw new IllegalStateException(
                    "KPI-Datensatz is not valid."
            );
        }

        kpiObject.put("value", latestPrice);

        httpService.put(kpiUrl, kpiObject);
    }

    private void rotateSingleTimeSeries(
            String outputId,
            double newValue
    ) throws Exception {

        String seriesUrl =
                TIME_DATA_URL + "/" + outputId;

        JsonNode timeSeries =
                httpService.get(seriesUrl);

        JsonNode dataNode =
                timeSeries.get("data");

        if (!(dataNode instanceof ArrayNode dataArray)) {
            throw new IllegalStateException(
                    "no valid data-Array for ID: "
                            + outputId
            );
        }

        if (dataArray.isEmpty()) {
            throw new IllegalStateException(
                    "data-Array is empty for ID: "
                            + outputId
            );
        }

        dataArray.remove(0);

        if (dataArray.isEmpty()) {
            throw new IllegalStateException(
                    "theres no datapoint left: " + outputId
            );
        }

        JsonNode lastPoint =
                dataArray.get(dataArray.size() - 1);

        long lastTimestamp =
                lastPoint.get("timestamp").asLong();

        long nextTimestamp =
                lastTimestamp + 10 * 60 * 1000L;

        ObjectNode newPoint =
                dataArray.addObject();

        newPoint.put(
                "timestamp",
                nextTimestamp
        );

        newPoint.put(
                "value",
                newValue
        );

        httpService.put(
                seriesUrl,
                timeSeries
        );

    }

    public void stop() {
        scheduler.shutdown();

        System.out.println(
                "Simulator stopped."
        );
    }
}
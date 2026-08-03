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
                "Simulator gestartet. Aktualisierung alle "
                        + UPDATE_INTERVAL_SECONDS
                        + " Sekunden."
        );
    }

    private void updateAllTimeSeriesSafely() {
        try {
            updateAllTimeSeries();
        } catch (Exception exception) {
            System.err.println(
                    "Fehler beim Aktualisieren der Zeitreihen:"
            );

            exception.printStackTrace();
        }
    }

    public void updateAllTimeSeries() {
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

            } catch (Exception exception) {
                System.err.println(
                        "Fehler bei Output-ID "
                                + outputId
                                + ": "
                                + exception.getMessage()
                );
            }
        }
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
                    "Kein gültiges data-Array für ID: "
                            + outputId
            );
        }

        if (dataArray.isEmpty()) {
            throw new IllegalStateException(
                    "Das data-Array ist leer für ID: "
                            + outputId
            );
        }

        /*
         * Ältesten Punkt entfernen.
         */
        dataArray.remove(0);

        if (dataArray.isEmpty()) {
            throw new IllegalStateException(
                    "Nach dem Entfernen ist kein letzter "
                            + "Datenpunkt mehr vorhanden: "
                            + outputId
            );
        }

        /*
         * Timestamp des jetzt letzten Punktes lesen.
         */
        JsonNode lastPoint =
                dataArray.get(dataArray.size() - 1);

        long lastTimestamp =
                lastPoint.get("timestamp").asLong();

        /*
         * Neuer Punkt liegt fünf Minuten später.
         */
        long nextTimestamp =
                lastTimestamp + 5 * 60 * 1000L;

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

        /*
         * Nur die konkrete Zeitreihe zurückschreiben.
         */
        httpService.put(
                seriesUrl,
                timeSeries
        );

        System.out.println(
                "Aktualisiert: "
                        + outputId
                        + " | "
                        + nextTimestamp
                        + " | "
                        + newValue
        );
    }

    public void stop() {
        scheduler.shutdown();

        System.out.println(
                "Simulator wurde beendet."
        );
    }
}
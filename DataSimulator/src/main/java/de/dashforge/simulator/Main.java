package de.dashforge.simulator;

import java.util.Map;

public class Main {

    public static void main(String[] args) {

        HttpService httpService = new HttpService();

        TimeDataSimulator simulator =
                new TimeDataSimulator(httpService);

        Map<String, Double> newValues = Map.of(
                "012ac6e2-ab85-4c5f-8a84-b17e9cf3ef12",
                20.22

//                "HIER-DIE-ZWEITE-ID-EINTRAGEN",
//                84.4
        );

        try {
            simulator.appendDataPoints(
                    System.currentTimeMillis(),
                    newValues
            );

            System.out.println(
                    "Alle Datenpunkte wurden verarbeitet."
            );

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
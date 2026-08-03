package de.dashforge.simulator;

import java.util.List;
import java.util.Map;

public class Main {

    public static void main(String[] args) {

        Map<String, List<Double>> valuesByOutputId =
                Map.of(
                        "b17f0721-4167-427b-b8e8-53c415b8a073",
                        List.of(
                                230.98,
                                231.25,
                                230.77,
                                231.69,
                                232.14
                        ),

                        "68efb8fd-fa23-4978-998c-3c1cc7b4c60c",
                        List.of(
                                15.2,
                                16.4,
                                14.9,
                                17.1,
                                16.8
                        ),
                        "ec088be1-e23a-4c70-b8c7-d9fe62359db0",
                        List.of(
                                15.2,
                                16.4,
                                14.9,
                                17.1,
                                16.8
                        ),
                        "8d40325d-41ff-4806-8bdc-deecbef9d523",
                        List.of(
                                15.2,
                                16.4,
                                14.9,
                                17.1,
                                16.8
                        ),
                        "012ac6e2-ab85-4c5f-8a84-b17e9cf3ef12",
                        List.of(
                                15.2,
                                16.4,
                                14.9,
                                17.1,
                                16.8
                        )
                        );

        HttpService httpService =
                new HttpService();

        ValueProvider valueProvider =
                new ValueProvider(
                        valuesByOutputId
                );

        TimeDataSimulator simulator =
                new TimeDataSimulator(
                        httpService,
                        valueProvider
                );

        simulator.start();
    }
}
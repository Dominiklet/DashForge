package de.dashforge.simulator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ValueProvider {

    private final Map<String, List<Double>> valuesByOutputId;
    private final Map<String, Integer> currentIndexByOutputId =
            new HashMap<>();

    public ValueProvider(
            Map<String, List<Double>> valuesByOutputId
    ) {
        this.valuesByOutputId = valuesByOutputId;

        for (String outputId : valuesByOutputId.keySet()) {
            currentIndexByOutputId.put(outputId, 0);
        }
    }

    public double getNextValue(String outputId) {
        List<Double> values =
                valuesByOutputId.get(outputId);

        if (values == null || values.isEmpty()) {
            throw new IllegalArgumentException(
                    "Keine Werte für Output-ID vorhanden: "
                            + outputId
            );
        }

        int currentIndex =
                currentIndexByOutputId.getOrDefault(
                        outputId,
                        0
                );

        double nextValue =
                values.get(currentIndex);

        int nextIndex =
                (currentIndex + 1) % values.size();

        currentIndexByOutputId.put(
                outputId,
                nextIndex
        );

        return nextValue;
    }

    public Iterable<String> getOutputIds() {
        return valuesByOutputId.keySet();
    }
}
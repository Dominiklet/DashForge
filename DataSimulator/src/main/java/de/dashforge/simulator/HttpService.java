package de.dashforge.simulator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpService {

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public JsonNode get(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        String response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        ).body();

        return mapper.readTree(response);
    }

    public void put(String url, JsonNode json) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .PUT(
                        HttpRequest.BodyPublishers.ofString(
                                mapper.writeValueAsString(json)
                        )
                )
                .build();

        client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );
    }
}
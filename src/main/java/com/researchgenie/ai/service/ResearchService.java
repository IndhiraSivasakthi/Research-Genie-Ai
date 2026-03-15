package com.researchgenie.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchgenie.ai.dto.GeminiResponse;
import com.researchgenie.ai.dto.ResearchRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class ResearchService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public ResearchService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String processContent(ResearchRequest request) {

        String prompt = buildPrompt(request);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        try {

            // ⏳ Prevent hitting API rate limit
            try {
                Thread.sleep(5000); // wait 5 seconds before API call
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            String response = webClient.post()
                    .uri(geminiApiUrl + "?key=" + geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractTextFromResponse(response);

        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }

    private String extractTextFromResponse(String response) {

        try {

            GeminiResponse geminiResponse =
                    objectMapper.readValue(response, GeminiResponse.class);

            if (geminiResponse.getCandidates() != null &&
                    !geminiResponse.getCandidates().isEmpty()) {

                GeminiResponse.Candidate candidate =
                        geminiResponse.getCandidates().get(0);

                if (candidate.getContent() != null &&
                        candidate.getContent().getParts() != null &&
                        !candidate.getContent().getParts().isEmpty()) {

                    return candidate
                            .getContent()
                            .getParts()
                            .get(0)
                            .getText();
                }
            }

            return "No content returned by AI";

        } catch (Exception e) {
            return "Error parsing Gemini response: " + e.getMessage();
        }
    }

    private String buildPrompt(ResearchRequest request) {

        StringBuilder prompt = new StringBuilder();

        switch (request.getOperation()) {

            case "summarize":
                prompt.append("Provide a concise summary of the following text:\n\n");
                break;

            case "suggest":
                prompt.append("Suggest related topics and further reading for this content:\n\n");
                break;

            case "points":
                prompt.append("Convert the following content into clear bullet points:\n\n");
                break;

            default:
                throw new IllegalArgumentException("Invalid operation: " + request.getOperation());
        }

        prompt.append(request.getContent());

        return prompt.toString();
    }
}
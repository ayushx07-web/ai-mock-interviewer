package com.mockinterview.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public AiScoringResponse scoreAnswer(String question, String expectedScoringRubric, String candidatedAnswer) {
        String prompt = String.format("""
                You are a strict but fair technical interview evaluator.
                
                Question: %s
                
                Expected answer keywords and concepts: %s
                
                Candidate's answer: %s
                
                Evaluate the answer and respond ONLY with a valid JSON object in this exact format:
                {
                  "score": <integer between 0 and 100>,
                  "feedback": "<2-3 sentence specific feedback explaining what was good and what was missing>",
                  "keywords_covered": ["<keyword1>", "<keyword2>"],
                  "keywords_missed": ["<keyword3>"]
                }
                
                Scoring guide:
                - 85-100: Covered all key concepts clearly and accurately
                - 70-84: Covered most concepts, minor gaps
                - 50-69: Partial coverage, significant gaps
                - 30-49: Superficial answer, many gaps
                - 0-29: Off-topic or incorrect
                
                Do not include any text outside the JSON object.
                """, question, expectedScoringRubric, candidatedAnswer);

        for (int i = 0; i < 2; i++) {
            try {
                String reqBody = buildGeminiRequest(prompt);
                
                String responseBody = webClientBuilder.build()
                        .post()
                        .uri(apiUrl)
                        .header("x-goog-api-key", apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(reqBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(30))
                        .block();

                String extractedJson = extractTextFromResult(responseBody).trim();
                // Remove markdown code blocks if gemini returned it
                if (extractedJson.startsWith("```json")) {
                    extractedJson = extractedJson.substring(7).trim();
                } else if (extractedJson.startsWith("```")) {
                    extractedJson = extractedJson.substring(3).trim();
                }
                if (extractedJson.endsWith("```")) {
                    extractedJson = extractedJson.substring(0, extractedJson.length() - 3).trim();
                }
                
                return objectMapper.readValue(extractedJson, AiScoringResponse.class);
            } catch (org.springframework.web.reactive.function.client.WebClientResponseException ex) {
                log.error("Failed to call Gemini API, attempt: " + (i+1) + ". Status: " + ex.getStatusCode() + ". Body: " + ex.getResponseBodyAsString(), ex);
            } catch (Exception e) {
                log.error("Failed to parse Gemini response or call API, attempt: " + (i+1), e);
            }
        }

        // Default fallback if it fails twice
        return AiScoringResponse.builder()
                .score(50)
                .feedback("Scoring temporarily unavailable due to AI parsing issues.")
                .keywords_covered(Collections.emptyList())
                .keywords_missed(Collections.emptyList())
                .build();
    }
    
    public String generateSummary(String prompt) {
        try {
            String reqBody = buildGeminiRequest(prompt);
            
            String responseBody = webClientBuilder.build()
                    .post()
                    .uri(apiUrl)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(reqBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
                    
            return extractTextFromResult(responseBody);
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException ex) {
            log.error("Failed to call Gemini API for summary. Status: " + ex.getStatusCode() + ". Body: " + ex.getResponseBodyAsString(), ex);
            return "Summary generation temporarily unavailable.";
        } catch (Exception e) {
            log.error("Failed to generate summary via Gemini", e);
            return "Summary generation temporarily unavailable.";
        }
    }

    private String buildGeminiRequest(String text) {
        try {
            Map<String, Object> req = new HashMap<>();
            
            Map<String, Object> part = new HashMap<>();
            part.put("text", text);
            
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
            
            req.put("contents", List.of(content));
            
            // Force JSON output structure for scoring if needed, but the prompt should handle it.
            // Using system instructions or generation configs would be ideal for gemini-1.5, 
            // but relying on prompt text is usually enough.
            
            return objectMapper.writeValueAsString(req);
        } catch (Exception e) {
            throw new RuntimeException("Error building Gemini request", e);
        }
    }
    
    private String extractTextFromResult(String jsonResponse) {
        try {
            Map<String, Object> map = objectMapper.readValue(jsonResponse, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) map.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
            return "";
        } catch (Exception e) {
            throw new RuntimeException("Error extracting text from Gemini response", e);
        }
    }
}

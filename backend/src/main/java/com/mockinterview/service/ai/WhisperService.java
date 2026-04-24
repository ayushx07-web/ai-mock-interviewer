package com.mockinterview.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhisperService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.whisper.url}")
    private String apiUrl;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public String transcribeAudio(MultipartFile file) {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // OpenAI requires filename to determine the format, we fake it with .webm or .wav depending on input or just generic
            String filename = file.getOriginalFilename() != null && !file.getOriginalFilename().isEmpty() 
                    ? file.getOriginalFilename() : "audio.webm";

            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };

            body.add("file", fileAsResource);
            body.add("model", "whisper-1");
            body.add("language", "en");

            String response = webClientBuilder.build()
                    .post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(body))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            JsonNode rootNode = objectMapper.readTree(response);
            if (rootNode.has("text")) {
                return rootNode.get("text").asText();
            }
            return "";

        } catch (Exception e) {
            log.error("Failed to transcribe audio via Whisper API", e);
            throw new RuntimeException("Failed to transcribe audio", e);
        }
    }
}

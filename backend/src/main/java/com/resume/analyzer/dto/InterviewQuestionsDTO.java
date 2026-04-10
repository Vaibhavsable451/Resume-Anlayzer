package com.resume.analyzer.dto;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class InterviewQuestionsDTO {
    private List<QuestionItem> technicalQuestions;
    private List<QuestionItem> codingChallenges;
    private List<QuestionItem> behavioralQuestions;
    private List<String> systemDesignTopics;

    @JsonCreator
    public static InterviewQuestionsDTO fromJson(JsonNode node) {
        InterviewQuestionsDTO dto = new InterviewQuestionsDTO();

        if (node == null || node.isNull()) {
            return dto.withDefaults();
        }

        if (node.isArray()) {
            dto.setTechnicalQuestions(parseQuestionItems(node));
            return dto.withDefaults();
        }

        dto.setTechnicalQuestions(parseQuestionItems(node.get("technicalQuestions")));
        dto.setCodingChallenges(parseQuestionItems(node.get("codingChallenges")));
        dto.setBehavioralQuestions(parseQuestionItems(node.get("behavioralQuestions")));
        dto.setSystemDesignTopics(parseStringItems(node.get("systemDesignTopics")));
        return dto.withDefaults();
    }

    private InterviewQuestionsDTO withDefaults() {
        if (technicalQuestions == null) {
            technicalQuestions = new ArrayList<>();
        }
        if (codingChallenges == null) {
            codingChallenges = new ArrayList<>();
        }
        if (behavioralQuestions == null) {
            behavioralQuestions = new ArrayList<>();
        }
        if (systemDesignTopics == null) {
            systemDesignTopics = new ArrayList<>();
        }
        return this;
    }

    private static List<QuestionItem> parseQuestionItems(JsonNode node) {
        List<QuestionItem> items = new ArrayList<>();
        if (node == null || node.isNull()) {
            return items;
        }

        if (node.isObject()) {
            QuestionItem item = parseQuestionItem(node);
            if (item != null) {
                items.add(item);
            }
            return items;
        }

        if (!node.isArray()) {
            return items;
        }

        for (JsonNode child : node) {
            QuestionItem item = parseQuestionItem(child);
            if (item != null) {
                items.add(item);
            }
        }
        return items;
    }

    private static QuestionItem parseQuestionItem(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }

        QuestionItem item = new QuestionItem();
        item.setQuestion(asText(node, "question", node.isTextual() ? node.asText() : ""));
        item.setAnswerHint(asText(node, "answerHint", asText(node, "hint", "")));
        item.setDifficulty(asText(node, "difficulty", "Medium"));
        item.setCategory(asText(node, "category", "General"));
        return item;
    }

    private static List<String> parseStringItems(JsonNode node) {
        List<String> items = new ArrayList<>();
        if (node == null || node.isNull()) {
            return items;
        }

        if (node.isArray()) {
            for (JsonNode child : node) {
                items.add(child.asText());
            }
            return items;
        }

        items.add(node.asText());
        return items;
    }

    private static String asText(JsonNode node, String fieldName, String fallback) {
        if (node != null && node.has(fieldName) && !node.get(fieldName).isNull()) {
            return node.get(fieldName).asText();
        }
        return fallback;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuestionItem {
        private String question;
        private String answerHint;
        private String difficulty; // Easy, Medium, Advanced
        private String category;   // e.g. "Spring Boot", "Concurrency"
    }
}

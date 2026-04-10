package com.resume.analyzer.dto;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalysisResultDTO {
    private Object overallScore; // Safe from strings like "85%"
    private Object atsScore;
    private Map<String, Integer> scoreBreakdown; 
    private Object missingSkills;
    private Object resumeImprovements;
    private Object matchingStrengths;
    private Object aiExplanation;
}

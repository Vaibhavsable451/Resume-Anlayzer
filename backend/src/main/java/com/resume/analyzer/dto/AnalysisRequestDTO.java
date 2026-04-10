package com.resume.analyzer.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalysisRequestDTO {
    // Original text fields
    private Object resumeText;
    private Object jd;
    
    // Support for the "Completed" format the user is sending in Postman
    private Object resume;
    private Object analysis;
    private String coverLetter;
}

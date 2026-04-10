package com.resume.analyzer.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobDescriptionData {
    private String jobTitle;
    private String company;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private String experienceRequired;
    private String educationRequired;
    private List<String> keywords;
    private List<String> responsibilities;
}

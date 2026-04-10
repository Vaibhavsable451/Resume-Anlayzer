package com.resume.analyzer.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeData {
    private String candidateName;
    private String email;
    private String phone;
    private List<String> skills;
    private List<ExperienceDTO> experience;
    private List<ProjectDTO> projects;
    private List<Object> education; // Changed from String to Object
    private List<Object> certifications; // Changed from String to Object

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExperienceDTO {
        private String company;
        private String role;
        private String duration;
        private Object description; // Changed from String to Object to handle Arrays
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProjectDTO {
        private String title;
        private Object description; // Changed from String to Object to handle Arrays
        private Object technologies; // Changed from String to Object to handle Arrays
    }
}

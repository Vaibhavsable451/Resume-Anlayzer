package com.resume.analyzer.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CareerRoadmapDTO {
    private String title;
    private List<RoadmapWeek> weeks;
    private List<String> recommendedResources;
    private String finalProjectIdea;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RoadmapWeek {
        private String weekNumber;
        private String focusGoal;
        private List<String> topicsToMaster;
        private List<String> miniProject;
    }
}

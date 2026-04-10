package com.resume.analyzer.dto;

import lombok.Data;

@Data
public class FullAnalysisDTO {
    private ResumeData resume;
    private AnalysisResultDTO analysis;
    private String coverLetter;
    private InterviewQuestionsDTO interviewQuestions;
    private CareerRoadmapDTO roadmap;
}

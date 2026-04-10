package com.resume.analyzer.controller;

import com.resume.analyzer.dto.*;
import com.resume.analyzer.entity.AnalysisHistory;
import com.resume.analyzer.repository.AnalysisHistoryRepository;
import com.resume.analyzer.service.AIService;
import com.resume.analyzer.service.ExtractionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnalysisController {

    private final ExtractionService extractionService;
    private final AIService aiService;
    private final AnalysisHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/full", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumeAndJDMultipart(
            @RequestParam("resume") MultipartFile file,
            @RequestPart("jd") String jdText) {
        
        System.out.println("DEBUG: Incoming Full Analysis Request");
        System.out.println("DEBUG: Resume File Name: " + (file != null ? file.getOriginalFilename() : "NULL"));
        System.out.println("DEBUG: JD Text Length: " + (jdText != null ? jdText.length() : "NULL"));

        if (jdText == null || jdText.isBlank()) {
             return ResponseEntity.badRequest().body(Map.of("error", "Provide job description in field 'jd'."));
        }

        try {
            String resumeText = extractResumeText(file, null);
            String resolvedJd = resolveJobDescription(jdText, null);
            return analyze(resumeText, resolvedJd);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/resume-only", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumeOnly(
            @RequestParam("resume") MultipartFile file) {
        try {
            String resumeText = extractionService.extractText(file);
            ResumeData resumeData = aiService.parseResume(resumeText);
            AnalysisResultDTO results = aiService.predictGeneralAtsScore(resumeData);
            
            return ResponseEntity.ok(Map.of(
                "resume", resumeData,
                "analysis", results
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/full", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumeAndJDJson(
            @RequestBody AnalysisRequestDTO request) {
        try {
            // Check if this is a "Ready-Made" Result (Mock/Save mode)
            if (request.getAnalysis() != null) {
                return savePreComputedResult(request);
            }

            // Normal AI Analysis mode
            String resumeText = extractResumeText(null, request);
            String resolvedJd = resolveJobDescription(null, request);
            return analyze(resumeText, resolvedJd);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<Map<String, Object>> savePreComputedResult(AnalysisRequestDTO request) throws Exception {
        // Just save and echo for testing/saving existing results
        AnalysisHistory history = new AnalysisHistory();
        history.setCandidateName("Saved Result");
        history.setOverallScore(0); // Default for saves
        history.setAnalysisResultJson(objectMapper.writeValueAsString(request.getAnalysis()));
        historyRepository.save(history);

        return ResponseEntity.ok(Map.of(
            "resume", request.getResume() != null ? request.getResume() : "N/A",
            "jd", request.getJd() != null ? request.getJd() : "N/A",
            "analysis", request.getAnalysis(),
            "coverLetter", request.getCoverLetter() != null ? request.getCoverLetter() : ""
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisHistory>> getHistory() {
        return ResponseEntity.ok(historyRepository.findAllByOrderByIdDesc());
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        historyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({ MultipartException.class, MissingServletRequestParameterException.class })
    public ResponseEntity<Map<String, Object>> handleInvalidMultipartRequest(HttpServletRequest request, Exception exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Invalid request format. Use multipart/form-data with fields 'resume' and 'jd', or application/json with 'resumeText' and 'jd'.",
                "path", request.getRequestURI()
        ));
    }

    private ResponseEntity<Map<String, Object>> analyze(String resumeText, String jdText) throws Exception {
        if (resumeText == null || resumeText.isBlank()) {
            throw new IllegalArgumentException("resumeText is required");
        }

        if (jdText == null || jdText.isBlank()) {
            throw new IllegalArgumentException("jd is required");
        }

        try {
            FullAnalysisDTO fullResults = aiService.performFullAnalysis(resumeText, jdText);

            var resumeData = fullResults.getResume();
            var results = fullResults.getAnalysis();
            var coverLetter = fullResults.getCoverLetter();
            var interviewQuestions = fullResults.getInterviewQuestions();
            var roadmap = fullResults.getRoadmap();

            String candidateName = resumeData != null ? resumeData.getCandidateName() : "Unknown";
            String jobTitle = fullResults.getAnalysis() != null ? "Job Match" : "Professional Match";
            
            AnalysisHistory history = new AnalysisHistory();
            history.setCandidateName(candidateName);
            history.setJobTitle(jobTitle);
            history.setOverallScore(parseScore(results != null ? results.getOverallScore() : 0));
            history.setAnalysisResultJson(objectMapper.writeValueAsString(results));
            historyRepository.save(history);

            return ResponseEntity.ok(Map.of(
                "resume", resumeData != null ? resumeData : Map.of(),
                "analysis", results != null ? results : Map.of(),
                "coverLetter", coverLetter != null ? coverLetter : "Failed to generate cover letter.",
                "interviewQuestions", interviewQuestions != null ? interviewQuestions : Map.of(),
                "roadmap", roadmap != null ? roadmap : Map.of()
            ));
        } catch (Exception e) {
            throw e;
        }
    }

    private String extractResumeText(MultipartFile file, AnalysisRequestDTO request) {
        if (file != null && !file.isEmpty()) {
            return extractionService.extractText(file);
        }

        if (request != null && request.getResumeText() != null) {
            return request.getResumeText().toString();
        }

        if (request != null && request.getResume() != null) {
            return request.getResume().toString();
        }

        throw new IllegalArgumentException("Provide either multipart field 'resume' or JSON field 'resumeText'.");
    }

    private String resolveJobDescription(String jdText, AnalysisRequestDTO request) {
        if (StringUtils.hasText(jdText)) {
            return jdText;
        }

        if (request != null && request.getJd() != null) {
            return request.getJd().toString();
        }

        throw new IllegalArgumentException("Provide job description in field 'jd'.");
    }

    private int parseScore(Object score) {
        if (score == null) {
            return 0;
        }

        if (score instanceof Number number) {
            return number.intValue();
        }

        String raw = score.toString().replace("%", "").trim();
        if (!StringUtils.hasText(raw)) {
            return 0;
        }

        try {
            return Integer.parseInt(raw);
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }
}

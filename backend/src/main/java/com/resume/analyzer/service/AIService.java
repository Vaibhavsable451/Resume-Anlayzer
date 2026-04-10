package com.resume.analyzer.service;

import com.resume.analyzer.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    // We go back to simple injection since the app can start with it.
    // The properties in application.properties will be picked up automatically.

    public ResumeData parseResume(String rawText) {
        String prompt = """
            Extract the following information from the resume text and return EXCLUSIVELY as a JSON object.
            Fields: candidateName, email, phone, skills (list), experience (list of objects with company, role, duration, description), 
            projects (list of objects with title, description, technologies), education (list), certifications (list).
            
            Resume Text:
            %s
            """.formatted(rawText);

        String response = chatClient.prompt(prompt).call().content();
        try {
            String cleaned = cleanJsonResponse(response);
            System.out.println("--- DEBUG: CLEANED RESUME JSON ---");
            System.out.println(cleaned);
            System.out.println("----------------------------------");
            return objectMapper.readValue(cleaned, ResumeData.class);
        } catch (Exception e) {
            e.printStackTrace(); // Log full error in console for us to see!
            throw new RuntimeException("Failed to parse resume JSON. Check IntelliJ console for details.", e);
        }
    }

    public JobDescriptionData analyzeJD(String jdText) {
        String prompt = """
            Analyze the following Job Description and extract structured details. Return EXCLUSIVELY as a JSON object.
            Fields: jobTitle, company, requiredSkills (list), preferredSkills (list), experienceRequired (string), 
            educationRequired (string), keywords (list), responsibilities (list).
            
            JD Text:
            %s
            """.formatted(jdText);

        String response = chatClient.prompt(prompt).call().content();
        try {
            return objectMapper.readValue(cleanJsonResponse(response), JobDescriptionData.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JD JSON. Raw AI response: " + abbreviate(response), e);
        }
    }

    public AnalysisResultDTO generateMatchAnalysis(ResumeData resume, JobDescriptionData jd) {
        String prompt = """
            Compare the following Resume and Job Description.
            Return EXCLUSIVELY a JSON result following this schema:
            overallScore (0-100), atsScore (0-100), 
            scoreBreakdown (Map with keys: Skills, Experience, Education, Keywords - all 0-100), 
            missingSkills (list), resumeImprovements (list), matchingStrengths (list),
            aiExplanation (long string explaining why the score was given).
            
            Resume: %s
            Job Description: %s
            """.formatted(resume, jd);

        String response = chatClient.prompt(prompt).call().content();
        try {
            return objectMapper.readValue(cleanJsonResponse(response), AnalysisResultDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse analysis JSON. Raw AI response: " + abbreviate(response), e);
        }
    }

    public String generateCoverLetter(ResumeData resume, JobDescriptionData jd) {
        String prompt = """
            Generate a personalized, professional cover letter based on the candidate's resume and the job description.
            Highlight the candidate's matching skills (%s) and relevant experience.
            Address it to %s if company name is known.
            
            Resume: %s
            JD: %s
            """.formatted(resume.getSkills(), jd.getCompany(), resume, jd);

        return chatClient.prompt(prompt).call().content();
    }

    public AnalysisResultDTO predictGeneralAtsScore(ResumeData resume) {
        String prompt = """
                As an ATS (Applicant Tracking System) Expert, analyze this resume data provided as JSON.
                Return a matching analysis in JSON format focusing on general career readiness and ATS standards.
                
                Fields required:
                - overallScore (int, 0-100)
                - atsScore (int, 0-100)
                - scoreBreakdown (Map<String, Integer>: "Connectivity", "Formatting", "Content Density", "Quantification")
                - missingSkills (List of skills/sections that would improve typical ATS detection)
                - resumeImprovements (Specific advice on formatting or content)
                - matchingStrengths (What the resume does well according to standard recruiters)
                - aiExplanation (Short overall summary)
                
                Resume Data: """ + resume.toString();

        String response = chatClient.prompt(prompt).call().content();
        try {
            return objectMapper.readValue(cleanJsonResponse(response), AnalysisResultDTO.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse ATS scan JSON.", e);
        }
    }

    public InterviewQuestionsDTO generateInterviewQuestions(ResumeData resume, JobDescriptionData jd) {
        String prompt = """
                As a Senior Technical Interviewer from FAANG, generate a comprehensive interview prep guide.
                Return JSON format only.
                
                Input Resume: """ + resume.toString() + """
                Input Job Description: """ + jd.toString() + """
                
                Fields required:
                - technicalQuestions (List of Objects: {question, answerHint, difficulty: "Easy/Medium/Advanced", category})
                - codingChallenges (List of Objects: {question, answerHint, difficulty, category})
                - behavioralQuestions (List of Objects: {question, answerHint, difficulty, category})
                - systemDesignTopics (List of Strings)
                
                Generate a total of 15-20 varied questions. Focus on checking the gap between the candidate and the job.
                """;

        String response = chatClient.prompt(prompt).call().content();
        try {
            return objectMapper.readValue(cleanJsonResponse(response), InterviewQuestionsDTO.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse Interview Questions JSON.", e);
        }
    }

    public CareerRoadmapDTO generateCareerRoadmap(ResumeData resume, JobDescriptionData jd) {
        String prompt = """
                As a Professional Career Coach and Tech Lead, build a 30-day learning roadmap.
                Return JSON format only.
                
                Input Resume: """ + resume.toString() + """
                Input Job Description: """ + jd.toString() + """
                
                Identify the Top 3 skill gaps. Create a 4-week learning path.
                Fields required:
                - title (e.g. "Roadmap to become a Cloud-Native Java Developer")
                - weeks (List of 4 Objects: {weekNumber, focusGoal, topicsToMaster[], miniProject[]})
                - recommendedResources (List of Strings)
                - finalProjectIdea (A specific project to showcase these skills)
                """;

        String response = chatClient.prompt(prompt).call().content();
        try {
            return objectMapper.readValue(cleanJsonResponse(response), CareerRoadmapDTO.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse Career Roadmap JSON.", e);
        }
    }

    public FullAnalysisDTO performFullAnalysis(String resumeText, String jdText) {
        String prompt = """
                As a World-Class Career Architect and AI Talent Scout, perform a deep analysis.
                Return EXCLUSIVELY a single valid JSON object.
                CRITICAL: Use ONLY escaped newlines (\\n) for any multi-line text (like coverLetter). 
                NO REAL NEWLINES inside JSON string values.
                
                Input Resume: """ + abbreviate(resumeText) + """
                Input Job Description: """ + abbreviate(jdText) + """
                
                Return ONE BIG JSON object with THESE FIELDS:
                1. "resume" (Parsed candidates details)
                2. "analysis" (overallScore, missingSkills[], keywordMatch, reasoning, improvements[])
                3. "coverLetter" (A professional 3-4 paragraph letter. ESCAPE ALL NEWLINES.)
                4. "interviewQuestions" (A list of 15-20 varied questions with answerHints)
                5. "roadmap" (A 30-day title and 4 week-by-week goals)
                
                JSON Object:
                """;

        String response = chatClient.prompt(prompt).call().content();
        try {
            String sanitized = sanitizeJsonForParsing(cleanJsonResponse(response));
            return objectMapper.readValue(sanitized, FullAnalysisDTO.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("JSON Parsing Failed: " + e.getMessage(), e);
        }
    }

    private String cleanJsonResponse(String response) {
        if (response == null || response.isBlank()) {
            throw new RuntimeException("AI response was empty");
        }

        int firstBrace = response.indexOf('{');
        int lastBrace = response.lastIndexOf('}');

        if (firstBrace == -1 || lastBrace == -1) return response.trim();
        
        return response.substring(firstBrace, lastBrace + 1).trim();
    }

    private String sanitizeJsonForParsing(String json) {
        StringBuilder result = new StringBuilder(json.length());
        boolean inString = false;

        for (int i = 0; i < json.length(); i++) {
            char current = json.charAt(i);

            if (current == '"' && !isEscaped(json, i)) {
                inString = !inString;
                result.append(current);
                continue;
            }

            if (inString && current == '\\' && i + 1 < json.length()) {
                char next = json.charAt(i + 1);
                if (!isValidJsonEscape(next)) {
                    result.append('\\');
                }
            }

            result.append(current);
        }

        return result.toString();
    }

    private boolean isEscaped(String value, int index) {
        int slashCount = 0;
        for (int i = index - 1; i >= 0 && value.charAt(i) == '\\'; i--) {
            slashCount++;
        }
        return slashCount % 2 == 1;
    }

    private boolean isValidJsonEscape(char value) {
        return value == '"' || value == '\\' || value == '/' || value == 'b'
                || value == 'f' || value == 'n' || value == 'r'
                || value == 't' || value == 'u';
    }

    private String abbreviate(String text) {
        if (text == null) return "null";
        String singleLine = text.replaceAll("\\s+", " ").trim();
        return singleLine.length() <= 300 ? singleLine : singleLine.substring(0, 300) + "...";
    }
}

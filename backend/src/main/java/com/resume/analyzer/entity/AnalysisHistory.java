package com.resume.analyzer.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class AnalysisHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String candidateName;
    private String jobTitle;
    private int overallScore;
    
    @Column(columnDefinition = "LONGTEXT")
    private String analysisResultJson;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

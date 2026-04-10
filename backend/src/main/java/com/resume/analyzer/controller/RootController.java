package com.resume.analyzer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class RootController {
    
    @GetMapping("/")
    public Map<String, String> healthCheck() {
        return Map.of(
            "status", "UP",
            "message", "Resume Analyzer API is running successfully",
            "version", "1.0.0"
        );
    }
}

package com.resume.analyzer.dto;

import lombok.Data;

public class AuthDTO {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String email;
        private String fullName;
    }
}

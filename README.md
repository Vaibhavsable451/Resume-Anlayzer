# AI Resume Match & Job Recommender 🚀

A powerful, 2026-grade portfolio project that leverages **Spring AI (Groq Llama 3)** and **React** to bridge the gap between candidates and their dream jobs.

## ✨ Key Features
- **Smart Resume Parsing**: AI-powered extraction from PDF/DOC into structured JSON.
- **JD Analysis**: Instant breakdown of job requirements and keywords.
- **Match Scoring**: Rule-based + AI logic for Overall, ATS, and Category scores.
- **Skill Gap Finder**: Visualizes missing technical skills and education.
- **AI Recommendations**: Specific, actionable improvements for your resume.
- **Cover Letter Generator**: personalized, role-specific letters in seconds.
- **Premium UI**: Glassmorphism design with professional data visualizations.

## 🛠 Tech Stack
- **Backend**: Spring Boot 3.4+, Spring AI (OpenAI/Groq), Spring Security, JPA/Hibernate, Apache Tika.
- **Frontend**: React.js 18, TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Database**: MySQL.
- **AI Layer**: Groq Llama 3 (via Spring AI).

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+
- Node.js 18+
- MySQL
- Groq API Key

### 2. Backend Setup
```bash
cd backend
# Set your Groq API Key
export GROQ_API_KEY=your_actual_key
# Run the application
./mvnw spring-boot:run
```
*Note: Update `application.properties` with your MySQL credentials.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Accessible at: `http://localhost:5173`

## 📊 Project Structure
- `/backend`: Maven project containing the Spring Boot application logic.
- `/frontend`: Vite-based React project with the premium dashboard UI.

## 📝 Resume-Ready Description
> **AI Resume Match & Job Recommender**
> Built a full-stack AI platform using Spring Boot and React that analyzes resumes against JDs using LLMs. Implemented structured AI parsing, ATS scoring engine, and automated cover letter generation with a premium data visualization dashboard.

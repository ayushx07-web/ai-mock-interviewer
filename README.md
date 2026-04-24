# AI Mock Interviewer

A full-stack mock interview platform powered by AI. It generates contextual interview questions based on role/company, records candidate voice responses, automatically transcribes audio using OpenAI's Whisper API, and grades answers securely using Gemini 1.5 Flash.

## Features
- **Contextual Question Generation**: Custom questions based on desired role tag and company.
- **Audio Answers & Transcription**: Voice recording capabilities that transcribe user answers seamlessly.
- **AI Grading Interface**: Automated evaluations on the transcribed audio giving a 0-100 score format alongside highlighted missing/covered keywords.
- **Weekly Progress Tracking**: An automated Cron engine aggregating historical answers into weekly improvement metrics natively.

## Technology Stack
- **Backend**: Spring Boot 3.2.5 (Java 17)
- **Database**: MySQL 8 (Flyway for Migration)
- **Security**: Stateless JWT Authentication alongside Spring Security 6
- **External Integrations**:
  - Gemini 1.5 Flash (Grading logic)
  - OpenAI Whisper (Audio transcription)
  - Cloudinary (Audio blob storage)

## Setup
*(Instructions pending full frontend availability)*

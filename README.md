# OpenQuizzer

> Access our app here: http://143.198.43.88/
> Watch a video Demo here: https://youtu.be/gWMAToZywtI

## Team Members

- Hardik Narkhede - hardik.narkhede@mail.utoronto.ca
- Vraj Shah - vrajr.shah@mail.utoronto.ca
- Arhum Parvez - arhum.parvez@mail.utoronto.ca

---

## Project Overview

**Open Quizzer** is an online quizzing platform designed to go beyond traditional multiple-choice apps like Kahoot by using open-ended questions and real-time Large Language Model (LLM) summarization.

The goal is to make classroom interaction more meaningful, inclusive, and engaging by allowing students to submit free-text or code-based responses — which are then categorized and summarized live using AI.

---

## Features

- **Open-ended Response Collection**  
  Unlike Kahoot, Open Quizzer allows quiz respondents to submit short or long-form textual answers.

- **Real-time LLM Summarization**  
  An integrated LLM (like OpenAI GPT) will instantly summarize classroom responses into key topics or themes, similar to YouTube's comment summarization.

- **Interactive Coding Questions (Future thing, last sprint)**  
  Students can submit code snippets, which the LLM will analyze for correctness, common mistakes (e.g., missing semicolons, wrong order of operations), or according to instructor-defined rules.

- **Passive-to-Active Learning**  
  Encourages participation by requiring original answers, helping passive students become active contributors.

- **Instructor Dashboard**  
  Real-time dashboard for the Quiz Master to view themes and trends across student answers.

---

## Frontend Framework

- Our frontend framework of choice will be **AngularJS**

---

## Additional Requirement: Real-Time Implementation Details

A critical part of this project is real-time interactivity. The app will reflect user changes immediately without requiring manual refreshes using:

- WebSockets (e.g., Socket.io) for real-time communication
- LLM prompt processing and updating the frontend
- Live display of categorized answers as students submit them
- Quiz Master dashboard for analyzing trends/gaps

---

## Project Milestones

### Alpha Version

- Quiz Master can open a poll question
- Quiz Respondents can submit text-based answers
- LLM summarizes common topics/themes from responses

### Beta Version

- OAuth 2.0-based authentication
- Stripe integration
- Quiz Master dashboard with real-time visual summaries

### Final Version

- **Code snippet response type**  
  Students submit language-specific code responses, and the LLM:
  - Highlights common syntax/logic issues
  - Flags critical errors (e.g., missing `await`, incorrect variable casing)
  - Marks according to instructor-defined rule sets (e.g., camelCase enforcement)

- **Participation Tracking**  
  Logs all respondents per quiz for participation grading

- **QR Code Entry**  
  Join quizzes quickly by scanning a QR code instead of a unique code

---

**Full Tech Stack**: AngularJS, Express.js, PostgreSQL, Socket.io, OpenAI API, Stripe

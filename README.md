# Globio | A1 Exam Readiness Diagnostic

A responsive product prototype that helps German A1 learners understand their current strengths, spot knowledge gaps, and choose what to practise before booking a Goethe or ÖSD A1 examination.

## Product overview

This short diagnostic follows the journey **Assessment → Diagnosis → Action**. It contains 12 multiple-choice questions across vocabulary, grammar, and reading. It does not require login or collect personal information.

## Features

- Exact 12-question A1 diagnostic with persistent answers.
- Vocabulary, grammar, and reading sections with a shared reading passage.
- Question navigator, back/next controls, direct jump, and answer review.
- Submission confirmation and locked results after submission.
- Deterministic score calculation and three readiness bands.
- Skill breakdown with raw scores, percentages, and interpretations.
- Up to three recommendations generated from incorrect or unanswered topics.
- Full answer review with correct answers and explanations.
- Responsive desktop, tablet, and mobile layouts.

## Scoring methodology

Correct answers receive one point. Incorrect and unanswered questions receive zero points. Each skill has four questions and the overall score is calculated across all 12 questions with equal weighting.

- 10–12 correct: **Strong foundation**
- 7–9 correct: **Some gaps to address**
- 0–6 correct: **More practice recommended**

## Recommendation logic

Incorrect and unanswered questions are grouped by their tested topic, ranked by mistake count, and limited to the top three topics. Ties follow question order because the source question bank is used consistently.

## Technology stack

React, TypeScript, Vite, Tailwind CSS, and Lucide React. Assessment state is intentionally local to the browser for this prototype; there is no backend, authentication, or paid API.

## Local setup

Install dependencies with `npm install`, then use the project’s standard Vite development workflow. Create a production bundle with `npm run build`.

## Deployment

The project is a standard Vite single-page application and can be deployed to Vercel or another static hosting provider by using the build command `npm run build` and publishing the generated `dist` folder.

## Current limitations

This diagnostic covers selected vocabulary, grammar, and reading concepts only. It does not assess listening, speaking, or writing, and it is not an official Goethe or ÖSD exam or a guarantee of exam performance. A refresh resets the current attempt.

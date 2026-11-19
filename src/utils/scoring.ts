import { questions, type Question, type Skill } from '@/data/questions';

export type AnswerMap = Record<string, string>;
export type ReadinessBand = {
  label: 'Strong foundation' | 'Some gaps to address' | 'More practice recommended';
  tone: 'strong' | 'gaps' | 'practice';
  summary: string;
};
export type SkillScore = { skill: Skill; correct: number; total: number; percentage: number; interpretation: string };
export type DiagnosticResults = { correct: number; total: number; percentage: number; band: ReadinessBand; skillScores: SkillScore[] };

export function isCorrect(question: Question, answers: AnswerMap): boolean {
  return answers[question.id] === question.correctAnswer;
}

export function calculateSkillScores(answers: AnswerMap): SkillScore[] {
  const skills: Skill[] = ['Vocabulary', 'Grammar', 'Reading'];
  return skills.map((skill) => {
    const skillQuestions = questions.filter((question) => question.skill === skill);
    const correct = skillQuestions.filter((question) => isCorrect(question, answers)).length;
    const percentage = (correct / skillQuestions.length) * 100;
    const interpretation = correct === 4 ? 'Strong performance in this diagnostic.' : correct === 3 ? 'Mostly comfortable, with a possible gap.' : 'Needs focused practice.';
    return { skill, correct, total: skillQuestions.length, percentage, interpretation };
  });
}

export function getReadinessBand(correct: number): ReadinessBand {
  if (correct >= 10) return { label: 'Strong foundation', tone: 'strong', summary: 'You have a strong base across the topics covered here.' };
  if (correct >= 7) return { label: 'Some gaps to address', tone: 'gaps', summary: 'You have a good starting point, with a few topics worth revisiting.' };
  return { label: 'More practice recommended', tone: 'practice', summary: 'A little more focused practice will help build your confidence.' };
}

export function calculateOverallScore(answers: AnswerMap): DiagnosticResults {
  const correct = questions.filter((question) => isCorrect(question, answers)).length;
  return { correct, total: questions.length, percentage: (correct / questions.length) * 100, band: getReadinessBand(correct), skillScores: calculateSkillScores(answers) };
}

export function getIncorrectQuestions(answers: AnswerMap): Question[] {
  return questions.filter((question) => !isCorrect(question, answers));
}

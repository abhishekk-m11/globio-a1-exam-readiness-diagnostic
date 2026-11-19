import { type Skill } from '@/data/questions';
import { calculateSkillScores, getIncorrectQuestions, type AnswerMap } from '@/utils/scoring';

const descriptions: Record<string, string> = {
  'Household vocabulary': 'Revise common objects and their German names.',
  'Food and drink vocabulary': 'Practise common food and drink expressions.',
  'Daily routine vocabulary': 'Learn vocabulary related to everyday activities.',
  'Places and services': 'Revise common places in town and their purposes.',
  'Present-tense verb conjugation': 'Practise conjugating common A1 verbs.',
  'Indefinite articles': 'Review the use of ein and eine with common nouns.',
  'Main-clause word order': 'Practise placing the conjugated verb correctly in German main clauses.',
  'Negation with kein': 'Practise negating nouns using the correct form of kein.',
  'Identifying explicit information': 'Practise locating information directly stated in short texts.',
  'Locating specific details': 'Practise finding places, jobs and other specific details.',
  'Understanding actions and transport': 'Practise identifying activities and modes of transport.',
  'Time references and sequence': 'Practise understanding days, times and event order.',
};

export type Recommendation = { topic: string; skill: Skill; description: string; count: number };

type TopicMistake = Recommendation & { firstQuestionNumber: number };

const skillOrder: Skill[] = ['Vocabulary', 'Grammar', 'Reading'];

export function generateRecommendations(answers: AnswerMap): Recommendation[] {
  const topicMistakes = groupTopicMistakes(answers);
  const weakSkills = calculateSkillScores(answers)
    .filter((score) => score.correct <= 2)
    .map((score) => score.skill);
  const selectedTopics = new Set<string>();
  const recommendations: TopicMistake[] = [];

  weakSkills
    .sort((a, b) => skillOrder.indexOf(a) - skillOrder.indexOf(b))
    .forEach((skill) => {
      const weakestTopic = topicMistakes
        .filter((topic) => topic.skill === skill)
        .sort(compareTopics)[0];
      if (weakestTopic) {
        recommendations.push(weakestTopic);
        selectedTopics.add(weakestTopic.topic);
      }
    });

  topicMistakes
    .filter((topic) => !selectedTopics.has(topic.topic))
    .sort(compareTopics)
    .slice(0, Math.max(0, 3 - recommendations.length))
    .forEach((topic) => recommendations.push(topic));

  return recommendations;
}

function groupTopicMistakes(answers: AnswerMap): TopicMistake[] {
  const grouped = new Map<string, TopicMistake>();
  getIncorrectQuestions(answers).forEach((question) => {
    const current = grouped.get(question.topic);
    if (current) current.count += 1;
    else grouped.set(question.topic, {
      topic: question.topic,
      skill: question.skill,
      description: descriptions[question.topic],
      count: 1,
      firstQuestionNumber: question.number,
    });
  });
  return Array.from(grouped.values());
}

function compareTopics(a: TopicMistake, b: TopicMistake): number {
  return b.count - a.count || a.firstQuestionNumber - b.firstQuestionNumber;
}

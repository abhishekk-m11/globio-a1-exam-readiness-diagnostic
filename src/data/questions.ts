export type Skill = 'Vocabulary' | 'Grammar' | 'Reading';

export type Question = {
  id: string;
  number: number;
  skill: Skill;
  prompt: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  topic: string;
  explanation: string;
  passage?: { title: string; text: string };
};

const readingPassage = {
  title: 'Ein Tag mit Anna',
  text: 'Hallo! Ich heiße Anna und bin 24 Jahre alt. Ich komme aus Spanien, aber ich wohne jetzt in Berlin. Ich arbeite von Montag bis Freitag in einem Büro. Jeden Morgen fahre ich um 8 Uhr mit dem Bus zur Arbeit. In meiner Freizeit spiele ich gern Tennis und treffe meine Freunde. Am Samstag lerne ich Deutsch in einer Sprachschule. Am Sonntag besuche ich meine Familie.',
};

export const questions: Question[] = [
  {
    id: 'q1', number: 1, skill: 'Vocabulary', prompt: 'Was bedeutet „der Tisch“?',
    options: [{ label: 'A', text: 'Chair' }, { label: 'B', text: 'Table' }, { label: 'C', text: 'Window' }, { label: 'D', text: 'Door' }],
    correctAnswer: 'B', topic: 'Household vocabulary', explanation: '"Der Tisch" means "the table" in English.',
  },
  {
    id: 'q2', number: 2, skill: 'Vocabulary', prompt: 'Ich möchte einen Kaffee und ein ______ Wasser.',
    options: [{ label: 'A', text: 'Glas' }, { label: 'B', text: 'Buch' }, { label: 'C', text: 'Stuhl' }, { label: 'D', text: 'Auto' }],
    correctAnswer: 'A', topic: 'Food and drink vocabulary', explanation: 'The correct expression is "ein Glas Wasser", meaning "a glass of water".',
  },
  {
    id: 'q3', number: 3, skill: 'Vocabulary', prompt: 'Was bedeutet „Ich stehe um sieben Uhr auf“?',
    options: [{ label: 'A', text: 'I go to bed at seven.' }, { label: 'B', text: 'I get up at seven.' }, { label: 'C', text: 'I eat at seven.' }, { label: 'D', text: 'I work at seven.' }],
    correctAnswer: 'B', topic: 'Daily routine vocabulary', explanation: '"Aufstehen" means "to get up". The sentence means "I get up at seven o’clock."',
  },
  {
    id: 'q4', number: 4, skill: 'Vocabulary', prompt: 'Wo kann man Medikamente kaufen?',
    options: [{ label: 'A', text: 'In der Apotheke' }, { label: 'B', text: 'Im Kino' }, { label: 'C', text: 'Im Bahnhof' }, { label: 'D', text: 'Im Restaurant' }],
    correctAnswer: 'A', topic: 'Places and services', explanation: '"In der Apotheke" means "at the pharmacy". A pharmacy is where people buy medicines.',
  },
  {
    id: 'q5', number: 5, skill: 'Grammar', prompt: 'Ich ______ aus Indien.',
    options: [{ label: 'A', text: 'komme' }, { label: 'B', text: 'kommst' }, { label: 'C', text: 'kommt' }, { label: 'D', text: 'kommen' }],
    correctAnswer: 'A', topic: 'Present-tense verb conjugation', explanation: 'With "ich", the correct form of "kommen" is "komme".',
  },
  {
    id: 'q6', number: 6, skill: 'Grammar', prompt: 'Das ist ______ Buch.',
    options: [{ label: 'A', text: 'ein' }, { label: 'B', text: 'eine' }, { label: 'C', text: 'einen' }, { label: 'D', text: 'einem' }],
    correctAnswer: 'A', topic: 'Indefinite articles', explanation: '"Buch" is a neuter noun. The correct indefinite article in this sentence is "ein".',
  },
  {
    id: 'q7', number: 7, skill: 'Grammar', prompt: 'Choose the correct sentence.',
    options: [{ label: 'A', text: 'Ich heute Deutsch lerne.' }, { label: 'B', text: 'Heute ich lerne Deutsch.' }, { label: 'C', text: 'Heute lerne ich Deutsch.' }, { label: 'D', text: 'Lerne heute ich Deutsch.' }],
    correctAnswer: 'C', topic: 'Main-clause word order', explanation: 'In a German main clause, the conjugated verb normally occupies the second position. "Heute lerne ich Deutsch" follows this structure.',
  },
  {
    id: 'q8', number: 8, skill: 'Grammar', prompt: 'Ich habe ______ Auto.',
    options: [{ label: 'A', text: 'kein' }, { label: 'B', text: 'nicht' }, { label: 'C', text: 'keine' }, { label: 'D', text: 'keinen' }],
    correctAnswer: 'A', topic: 'Negation with kein', explanation: '"Auto" is a neuter noun. In this sentence, the correct negative article is "kein".',
  },
  {
    id: 'q9', number: 9, skill: 'Reading', prompt: 'Where is Anna from?',
    options: [{ label: 'A', text: 'Germany' }, { label: 'B', text: 'Spain' }, { label: 'C', text: 'France' }, { label: 'D', text: 'Italy' }],
    correctAnswer: 'B', topic: 'Identifying explicit information', explanation: 'The passage says "Ich komme aus Spanien", which means "I come from Spain".', passage: readingPassage,
  },
  {
    id: 'q10', number: 10, skill: 'Reading', prompt: 'Where does Anna work?',
    options: [{ label: 'A', text: 'In a school' }, { label: 'B', text: 'In a hospital' }, { label: 'C', text: 'In an office' }, { label: 'D', text: 'In a restaurant' }],
    correctAnswer: 'C', topic: 'Locating specific details', explanation: 'The passage says "Ich arbeite ... in einem Büro", meaning she works in an office.', passage: readingPassage,
  },
  {
    id: 'q11', number: 11, skill: 'Reading', prompt: 'How does Anna travel to work?',
    options: [{ label: 'A', text: 'By train' }, { label: 'B', text: 'By bus' }, { label: 'C', text: 'By bicycle' }, { label: 'D', text: 'On foot' }],
    correctAnswer: 'B', topic: 'Understanding actions and transport', explanation: 'The passage says "mit dem Bus", meaning by bus.', passage: readingPassage,
  },
  {
    id: 'q12', number: 12, skill: 'Reading', prompt: 'What does Anna do on Saturday?',
    options: [{ label: 'A', text: 'Visits her family' }, { label: 'B', text: 'Plays tennis' }, { label: 'C', text: 'Learns German' }, { label: 'D', text: 'Works in an office' }],
    correctAnswer: 'C', topic: 'Time references and sequence', explanation: 'The passage says "Am Samstag lerne ich Deutsch in einer Sprachschule", meaning she learns German at a language school on Saturday.', passage: readingPassage,
  },
];

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import { questions, type Question, type Skill } from '@/data/questions';
import { generateRecommendations, type Recommendation } from '@/utils/recommendations';
import { calculateOverallScore, isCorrect, type AnswerMap, type DiagnosticResults, type SkillScore } from '@/utils/scoring';

type Screen = 'welcome' | 'diagnostic' | 'review' | 'results' | 'answers';

const skillLabels: Record<Skill, string> = {
  Vocabulary: 'Words & phrases',
  Grammar: 'Sentence building',
  Reading: 'Understanding texts',
};

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const currentQuestion = questions[currentIndex];

  const startDiagnostic = () => {
    setScreen('diagnostic');
    setCurrentIndex(0);
  };

  const chooseAnswer = (questionId: string, answer: string) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setScreen('diagnostic');
  };

  const submitDiagnostic = () => {
    if (results) return;
    setResults(calculateOverallScore(answers));
    setShowSubmitDialog(false);
    setScreen('results');
  };

  const retakeDiagnostic = () => {
    setAnswers({});
    setResults(null);
    setCurrentIndex(0);
    setScreen('diagnostic');
  };

  return (
    <div className="app-shell">
      <Header screen={screen} onHome={() => setScreen(results ? 'results' : 'welcome')} />
      <main>
        {screen === 'welcome' && <WelcomeScreen onStart={startDiagnostic} />}
        {screen === 'diagnostic' && (
          <DiagnosticScreen
            currentIndex={currentIndex}
            question={currentQuestion}
            answers={answers}
            onChoose={chooseAnswer}
            onJump={goToQuestion}
            onPrevious={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
            onNext={() => currentIndex === questions.length - 1 ? setScreen('review') : setCurrentIndex((index) => index + 1)}
          />
        )}
        {screen === 'review' && (
          <ReviewScreen
            answers={answers}
            onJump={goToQuestion}
            onBack={() => setScreen('diagnostic')}
            onSubmit={() => setShowSubmitDialog(true)}
          />
        )}
        {screen === 'results' && results && (
          <ResultsScreen
            results={results}
            answers={answers}
            onReview={() => setScreen('answers')}
            onRetake={retakeDiagnostic}
          />
        )}
        {screen === 'answers' && results && (
          <AnswerReviewScreen answers={answers} onBack={() => setScreen('results')} />
        )}
      </main>
      {showSubmitDialog && <SubmitDialog onCancel={() => setShowSubmitDialog(false)} onSubmit={submitDiagnostic} />}
    </div>
  );
}

function Header({ screen, onHome }: { screen: Screen; onHome: () => void }) {
  const isWelcome = screen === 'welcome';
  return (
    <header className={`site-header ${isWelcome ? 'site-header--welcome' : ''}`}>
      <button className="brand" onClick={onHome} aria-label="Return to Globio home">
        <span>Globio</span>
      </button>
      <nav className="top-nav" aria-label="Primary navigation">
        <span>Learn German <ChevronRight size={14} /></span>
        <span>Programs <ChevronRight size={14} /></span>
        <span>Mock Tests <ChevronRight size={14} /></span>
      </nav>
      {!isWelcome && (
        <div className="header-context"><span className="status-dot" /> A1 readiness diagnostic</div>
      )}
      {isWelcome && <div className="header-context"><span className="status-dot" /> A1 readiness diagnostic</div>}
    </header>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="welcome-page">
      <div className="welcome-glow welcome-glow--one" />
      <div className="welcome-glow welcome-glow--two" />
      <div className="welcome-content page-container">
        <div className="welcome-copy">
          <div className="eyebrow eyebrow--light"><span className="eyebrow-dot" /> A clearer next step for your German journey</div>
          <h1>Am I ready for my <span>German A1 exam?</span></h1>
          <p className="hero-description">You've completed your A1 learning journey. Take a short diagnostic to understand your strengths, identify gaps and discover what to practise before booking your exam.</p>
          <div className="welcome-actions">
            <button className="button button--yellow button--large" onClick={onStart}>Start diagnostic <ArrowRight size={19} /></button>
            <span className="privacy-note"><ShieldCheck size={17} /> No sign-up. Your answers stay in this browser.</span>
          </div>
        </div>
        <div className="welcome-panel">
          <div className="panel-label">A1 · readiness check</div>
          <div className="panel-score-preview"><div className="preview-ring"><Target size={34} /></div><div><strong>Know where you stand.</strong><span>Then practise with purpose.</span></div></div>
          <div className="welcome-stat-grid">
            <InfoStat icon={<FileText size={19} />} value="12" label="questions" />
            <InfoStat icon={<Target size={19} />} value="3" label="skill areas" />
            <InfoStat icon={<Clock3 size={19} />} value="5–7 min" label="estimated time" />
            <InfoStat icon={<BookOpen size={19} />} value="A1" label="level" />
          </div>
          <div className="panel-skills"><span>Vocabulary</span><span>Grammar</span><span>Reading</span><span>Multiple choice</span></div>
          <p className="panel-disclaimer">A learning indicator — not an official Goethe or ÖSD examination.</p>
        </div>
      </div>
      <div className="welcome-footer page-container"><span>Designed to move you from uncertainty to action.</span><span className="footer-line" /><span>Globio Learning</span></div>
    </section>
  );
}

function InfoStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="info-stat"><span className="info-stat-icon">{icon}</span><strong>{value}</strong><span>{label}</span></div>;
}

function DiagnosticScreen({ currentIndex, question, answers, onChoose, onJump, onPrevious, onNext }: {
  currentIndex: number;
  question: Question;
  answers: AnswerMap;
  onChoose: (questionId: string, answer: string) => void;
  onJump: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  return (
    <section className="assessment-page page-container">
      <div className="assessment-topline"><div><span className="eyebrow">A1 readiness diagnostic</span><h1>Build your picture, one question at a time.</h1></div><div className="assessment-count"><strong>Question {currentIndex + 1}</strong><span>of {questions.length}</span></div></div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="assessment-layout">
        <div className="question-column">
          <div className="question-meta"><span className={`skill-pill skill-pill--${question.skill.toLowerCase()}`}>{question.skill}</span><span>{skillLabels[question.skill]}</span></div>
          {question.passage && <ReadingPassage passage={question.passage} />}
          <div className="question-card">
            <div className="question-number">0{question.number}</div>
            <div className="question-body"><p className="question-kicker">Question {question.number}</p><h2>{question.prompt}</h2><div className="answer-options" role="radiogroup" aria-label={`Answers for question ${question.number}`}>
              {question.options.map((option) => <AnswerOption key={option.label} option={option} selected={answers[question.id] === option.label} onClick={() => onChoose(question.id, option.label)} />)}
            </div></div>
          </div>
          <div className="question-navigation"><button className="button button--ghost" onClick={onPrevious} disabled={currentIndex === 0}><ArrowLeft size={17} /> Previous</button><span>{answeredCount} of {questions.length} answered</span><button className="button button--primary" onClick={onNext}>{currentIndex === questions.length - 1 ? 'Review answers' : 'Next question'} <ArrowRight size={17} /></button></div>
        </div>
        <QuestionNavigator currentIndex={currentIndex} answers={answers} onJump={onJump} />
      </div>
    </section>
  );
}

function ReadingPassage({ passage }: { passage: { title: string; text: string } }) {
  return <aside className="reading-passage"><div className="reading-heading"><BookOpen size={18} /><div><span>Reading passage</span><strong>{passage.title}</strong></div></div><p>“{passage.text}”</p></aside>;
}

function AnswerOption({ option, selected, onClick }: { option: { label: string; text: string }; selected: boolean; onClick: () => void }) {
  return <button className={`answer-option ${selected ? 'answer-option--selected' : ''}`} onClick={onClick} role="radio" aria-checked={selected}><span className="option-letter">{selected ? <Check size={16} /> : option.label}</span><span>{option.text}</span>{selected && <span className="selected-label">Selected</span>}</button>;
}

function QuestionNavigator({ currentIndex, answers, onJump }: { currentIndex: number; answers: AnswerMap; onJump: (index: number) => void }) {
  return <aside className="question-navigator"><div className="navigator-heading"><div><span className="eyebrow">Your progress</span><h2>Question map</h2></div><span>{Object.keys(answers).length}/12</span></div><div className="navigator-grid">{questions.map((question, index) => <button key={question.id} onClick={() => onJump(index)} className={`navigator-item ${currentIndex === index ? 'navigator-item--current' : ''} ${answers[question.id] ? 'navigator-item--answered' : ''}`} aria-label={`Go to question ${question.number}${answers[question.id] ? ', answered' : ', unanswered'}`}>{question.number}{answers[question.id] && <Check size={12} />}</button>)}</div><div className="navigator-legend"><span><i className="legend-dot legend-dot--current" />Current</span><span><i className="legend-dot legend-dot--answered" />Answered</span><span><i className="legend-dot" />Unanswered</span></div><div className="navigator-tip"><LockKeyhole size={16} /><span>Correct answers stay hidden until you submit.</span></div></aside>;
}

function ReviewScreen({ answers, onJump, onBack, onSubmit }: { answers: AnswerMap; onJump: (index: number) => void; onBack: () => void; onSubmit: () => void }) {
  const unanswered = questions.length - Object.keys(answers).length;
  return <section className="review-page page-container"><div className="section-heading"><span className="eyebrow">Almost there</span><h1>Review your answers</h1><p>Take a moment to review your responses before submitting your diagnostic.</p></div>{unanswered > 0 && <div className="warning-banner"><CircleAlert size={20} /><span>You have <strong>{unanswered} unanswered {unanswered === 1 ? 'question' : 'questions'}</strong>. These will count as incorrect when you submit.</span></div>}<div className="review-grid">{questions.map((question, index) => <button key={question.id} className="review-item" onClick={() => onJump(index)}><span className="review-item-number">{String(question.number).padStart(2, '0')}</span><span className="review-item-content"><span className="review-item-skill">{question.skill}</span><strong>{question.prompt}</strong><span className={answers[question.id] ? 'status status--answered' : 'status status--unanswered'}>{answers[question.id] ? <><Check size={14} /> Answered</> : <><CircleAlert size={14} /> Not answered</>}</span></span><ChevronRight size={18} /></button>)}</div><div className="review-footer"><button className="button button--ghost" onClick={onBack}><ArrowLeft size={17} /> Back to questions</button><button className="button button--primary button--large" onClick={onSubmit}>Submit diagnostic <ArrowRight size={18} /></button></div></section>;
}

function SubmitDialog({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  return <div className="modal-backdrop" role="presentation"><div className="submit-dialog" role="dialog" aria-modal="true" aria-labelledby="submit-title"><button className="dialog-close" onClick={onCancel} aria-label="Close dialog"><X size={19} /></button><div className="dialog-icon"><LockKeyhole size={23} /></div><span className="eyebrow">Final check</span><h2 id="submit-title">Submit your diagnostic?</h2><p>Once submitted, your answers cannot be changed. Your results and practice recommendations will be generated.</p><div className="dialog-actions"><button className="button button--ghost" onClick={onCancel}>Go back</button><button className="button button--primary" onClick={onSubmit}>Submit diagnostic</button></div></div></div>;
}

function ResultsScreen({ results, answers, onReview, onRetake }: { results: DiagnosticResults; answers: AnswerMap; onReview: () => void; onRetake: () => void }) {
  const recommendations = generateRecommendations(answers);
  return <section className="results-page page-container"><div className="results-intro"><div><span className="eyebrow">Your diagnostic results</span><h1>Now you know where to focus.</h1><p>{results.band.summary}</p></div><div className={`result-badge result-badge--${results.band.tone}`}><span>Readiness snapshot</span><strong>{results.band.label}</strong></div></div><div className={`overall-card overall-card--${results.band.tone}`}><div className="overall-score"><span>Overall result</span><strong>{results.correct} <small>out of {results.total}</small></strong><span className="overall-percent">{formatPercentage(results.percentage)}</span></div><div className="overall-divider" /><div className="overall-message"><div className="result-icon">{results.band.tone === 'strong' ? <CircleCheck size={26} /> : <Target size={26} />}</div><div><span>Result label</span><h2>{results.band.label}</h2><p>Based on your answers across vocabulary, grammar and reading.</p></div></div></div><section className="results-section"><div className="subsection-heading"><span className="eyebrow">01 · Understand your score</span><h2>Skill breakdown</h2><p>Every skill has four questions, so you can see exactly where your result comes from.</p></div><div className="skill-cards">{results.skillScores.map((score) => <SkillCard key={score.skill} score={score} />)}</div></section><section className="results-section recommendations-section"><div className="subsection-heading"><span className="eyebrow">02 · Make it actionable</span><h2>What to practise next</h2><p>These recommendations come directly from the questions you missed or left unanswered.</p></div>{recommendations.length > 0 ? <div className="recommendation-list">{recommendations.map((recommendation, index) => <RecommendationCard key={recommendation.topic} recommendation={recommendation} index={index} />)}</div> : <div className="all-clear"><CircleCheck size={23} /><div><strong>No specific practice gaps found.</strong><p>You answered every question correctly in this diagnostic.</p></div></div>}</section><section className="next-steps"><div><span className="eyebrow eyebrow--light">03 · Keep moving</span><h2>What should you do next?</h2><p>Use your results to focus your next practice session. Once you have worked on weaker topics, try another diagnostic or a full-format mock test.</p></div><div className="next-step-actions"><button className="button button--yellow" onClick={onReview}>Review my answers <ArrowRight size={17} /></button><button className="button button--outline-light" onClick={onRetake}><RotateCcw size={17} /> Retake diagnostic</button></div></section><div className="results-disclaimer"><ShieldCheck size={19} /><p>This diagnostic assesses selected A1 vocabulary, grammar and reading concepts only. It does not assess listening, speaking or writing, and it is not an official Goethe or ÖSD examination. Your result is a learning indicator, not a guarantee or prediction of exam performance.</p></div></section>;
}

function formatPercentage(percentage: number): string {
  return Number.isInteger(percentage) ? `${percentage}%` : `${percentage.toFixed(2)}%`;
}

function SkillCard({ score }: { score: SkillScore }) {
  return <article className="skill-card"><div className="skill-card-top"><div className={`skill-card-icon skill-card-icon--${score.skill.toLowerCase()}`}>{score.skill === 'Vocabulary' ? <BookOpen size={19} /> : score.skill === 'Grammar' ? <FileText size={19} /> : <Target size={19} />}</div><div><h3>{score.skill}</h3><span>{skillLabels[score.skill]}</span></div><strong>{formatPercentage(score.percentage)}</strong></div><div className="skill-progress"><span style={{ width: `${score.percentage}%` }} /></div><div className="skill-card-bottom"><b>{score.correct}/{score.total} correct</b><span>{score.interpretation}</span></div></article>;
}

function RecommendationCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  return <article className="recommendation-card"><span className="recommendation-number">0{index + 1}</span><div className="recommendation-content"><div className="recommendation-meta"><span>{recommendation.skill}</span>{recommendation.count > 1 && <span>{recommendation.count} questions</span>}</div><h3>{recommendation.topic}</h3><p>{recommendation.description}</p></div><ArrowRight size={18} /></article>;
}

function AnswerReviewScreen({ answers, onBack }: { answers: AnswerMap; onBack: () => void }) {
  return <section className="answers-page page-container"><div className="section-heading"><span className="eyebrow">Your completed diagnostic</span><h1>Review your answers</h1><p>See how each answer contributed to your result, with a short explanation to guide your practice.</p></div><div className="answer-review-list">{questions.map((question) => { const selected = answers[question.id]; const correct = isCorrect(question, answers); return <article key={question.id} className={`answer-review-card ${correct ? 'answer-review-card--correct' : 'answer-review-card--incorrect'}`}><div className="answer-review-top"><span className="answer-review-number">Question {question.number}</span><span className={`status ${correct ? 'status--answered' : 'status--incorrect'}`}>{correct ? <><CircleCheck size={15} /> Correct</> : selected ? <><CircleAlert size={15} /> Incorrect</> : <><CircleAlert size={15} /> Not answered</>}</span><span className="answer-review-skill">{question.skill}</span></div><h2>{question.prompt}</h2><div className="answer-review-answers"><div><span>Your answer</span><strong className={!selected ? 'muted-answer' : ''}>{selected ? getOptionText(question, selected) : 'Not answered'}</strong></div><div><span>Correct answer</span><strong>{getOptionText(question, question.correctAnswer)}</strong></div></div><div className="explanation"><BookOpen size={16} /><p>{question.explanation}</p></div></article>; })}</div><button className="button button--primary button--large answers-back" onClick={onBack}><ArrowLeft size={17} /> Back to results</button></section>;
}

function getOptionText(question: Question, label: string): string {
  const option = question.options.find((item) => item.label === label);
  return option ? `${label}. ${option.text}` : label;
}

export default App;

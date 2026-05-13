import React, { useState } from 'react';
import { Quiz } from '@/lib/academy-data';

interface QuizViewProps {
  quiz: Quiz;
  onBack: () => void;
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizView({ quiz, onBack, onComplete }: QuizViewProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === question.correctOptionIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const passScore = Math.ceil(quiz.questions.length * 0.7);
    const passed = score >= passScore;
    const pct = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto text-center py-24 animate-in zoom-in-95 duration-700 flex flex-col items-center gap-6">
        <span className={`material-symbols-outlined text-8xl \${passed ? 'text-hex-secondary' : 'text-hex-error'} drop-shadow-[0_0_20px_currentColor]`}>
          {passed ? 'verified' : 'report_off'}
        </span>
        
        <div>
          <h2 className="font-headline-lg text-4xl text-hex-primary uppercase tracking-[0.2em] mb-2">
            {passed ? 'Evaluation_Successful' : 'Evaluation_Failure'}
          </h2>
          <p className="text-hex-on-surface-variant font-monospace-data text-sm uppercase tracking-[0.3em]">
            COMPETENCY_MATCH: {pct}% ({score}/{quiz.questions.length})
          </p>
        </div>
        
        <div className="flex gap-6 mt-6">
          <button 
            onClick={onBack} 
            className="px-8 py-4 border border-hex-primary-fixed/20 text-hex-primary-fixed/60 font-label-caps text-xs uppercase tracking-widest hover:bg-hex-primary-fixed/5 transition-all"
          >
            RETURN_TO_BASE
          </button>
          <button 
            onClick={() => onComplete(pct, passed)} 
            className={`px-10 py-4 font-label-caps text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all \${passed ? 'bg-hex-secondary text-hex-on-secondary shadow-hex-secondary/20' : 'bg-hex-surface-container-high text-hex-primary shadow-hex-primary/10'}`}
          >
            {passed ? 'CLAIM_REWARD' : 'RETRY_LATER'}
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentQuestionIdx) / quiz.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-center border-b border-hex-primary-fixed/20 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/5 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-hex-primary-fixed">arrow_back</span>
          </button>
          <h1 className="font-headline-lg text-2xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.3)]">
            Competency_Verification
          </h1>
        </div>
        <div className="font-monospace-data text-[12px] text-hex-primary-fixed bg-hex-primary-fixed/5 border border-hex-primary-fixed/20 px-6 py-2 rounded shadow-[0_0_10px_rgba(0,251,251,0.1)]">
          QUESTION {currentQuestionIdx + 1} // {quiz.questions.length}
        </div>
      </header>

      <div className="h-1 bg-hex-surface-container-highest rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF] transition-all duration-500" style={{ width: `\${progress}%` }} />
      </div>

      <div className="bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/10 rounded-xl p-10 shadow-[0_10px_50px_rgba(0,0,0,0.4)]">
        <h2 className="font-headline-lg text-2xl text-hex-primary uppercase tracking-wide leading-relaxed mb-12 border-l-4 border-l-hex-primary-fixed pl-6">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctOptionIndex;
            let btnClass = "border-hex-primary-fixed/10 hover:border-hex-primary-fixed/40 text-hex-on-surface-variant/60 hover:bg-hex-primary-fixed/5";
            
            if (isAnswered) {
              if (isCorrect) btnClass = "border-hex-secondary bg-hex-secondary/10 text-hex-secondary font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]";
              else if (isSelected) btnClass = "border-hex-error bg-hex-error/10 text-hex-error";
              else btnClass = "border-hex-surface-container-highest opacity-30 grayscale";
            } else if (isSelected) {
              btnClass = "border-hex-primary-fixed bg-hex-primary-fixed/10 text-hex-primary-fixed font-bold shadow-[0_0_20px_rgba(0,251,251,0.1)]";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left px-6 py-5 rounded-lg border transition-all duration-300 font-monospace-data text-xs tracking-widest flex items-center gap-6 \${btnClass}`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-500 \${
                  isAnswered && isCorrect ? 'border-hex-secondary text-hex-secondary shadow-[0_0_10px_#10B981]' : 
                  isAnswered && isSelected && !isCorrect ? 'border-hex-error text-hex-error shadow-[0_0_10px_#FF4444]' : 
                  isSelected ? 'border-hex-primary-fixed text-hex-primary-fixed shadow-[0_0_10px_#00FFFF]' : 
                  'border-hex-primary-fixed/20 text-hex-primary-fixed/20'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {opt.toUpperCase()}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-12 pt-8 border-t border-hex-primary-fixed/10 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`flex items-start gap-4 p-6 rounded-lg backdrop-blur-sm \${selectedOption === question.correctOptionIndex ? 'bg-hex-secondary/5 border border-hex-secondary/20 text-hex-secondary' : 'bg-hex-error/5 border border-hex-error/20 text-hex-error'}`}>
              <span className="material-symbols-outlined text-2xl mt-0.5">info</span>
              <div>
                <div className="font-label-caps text-[10px] uppercase tracking-[0.4em] mb-2 font-bold opacity-60">Logic_Explanation</div>
                <p className="text-xs font-body-md text-hex-on-surface-variant leading-relaxed italic">// {question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-end">
          {!isAnswered ? (
            <button 
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className={`px-12 py-4 font-label-caps text-xs uppercase tracking-widest font-bold rounded transition-all \${selectedOption !== null ? 'bg-hex-primary-fixed text-hex-on-primary shadow-[0_0_20px_rgba(0,251,251,0.3)] hover:brightness-110 active:scale-95' : 'bg-hex-surface-container-high text-hex-on-surface-variant/20 cursor-not-allowed opacity-50'}`}
            >
              LOCK_INPUT_VECTOR
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-12 py-4 bg-hex-primary-fixed text-hex-on-primary font-label-caps text-xs uppercase tracking-widest font-bold rounded shadow-[0_0_20px_rgba(0,251,251,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
            >
              {currentQuestionIdx < quiz.questions.length - 1 ? 'NEXT_PHASE' : 'FINALIZE_VERIFICATION'}
              <span className="material-symbols-outlined text-lg">double_arrow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { FlashcardDeck as DeckData, Flashcard } from '@/lib/academy-data';
import { getDeckState, saveFlashcardState, FlashcardState } from '@/lib/academy-supabase';
import { useAuth } from '@/hooks/use-auth';

interface FlashcardDeckProps {
  deck: DeckData;
  onBack: () => void;
  onComplete: () => void;
}

export default function FlashcardDeck({ deck, onBack, onComplete }: FlashcardDeckProps) {
  const { user } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>(deck.cards);
  const [states, setStates] = useState<Map<string, FlashcardState>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (user) loadStates();
  }, [user, deck.id]);

  const loadStates = async () => {
    setLoading(true);
    const dbStates = await getDeckState(user!.id, deck.id);
    setStates(dbStates);
    
    const toReview = deck.cards.filter(c => {
      const state = dbStates.get(c.id);
      return !state || state.status !== 'mastered';
    });

    if (toReview.length === 0) {
      setFinished(true);
    } else {
      setCards(toReview);
      setCurrentIndex(0);
    }
    setLoading(false);
  };

  const handleMark = async (status: 'mastered' | 'review') => {
    const currentCard = cards[currentIndex];
    const newStates = new Map(states);
    newStates.set(currentCard.id, { card_id: currentCard.id, deck_id: deck.id, status, last_reviewed: new Date().toISOString() });
    setStates(newStates);

    saveFlashcardState(user!.id, currentCard.id, deck.id, status);

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setFinished(true);
      }
    }, 150);
  };

  if (loading) return <div className="text-center py-24 font-monospace-data text-hex-primary-fixed animate-pulse tracking-[0.4em] uppercase">ACCESSING_MEMORY_BLOCKS...</div>;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 animate-in zoom-in-95 duration-700 flex flex-col items-center">
        <span className="material-symbols-outlined text-8xl text-hex-primary-fixed mb-8 drop-shadow-[0_0_20px_rgba(0,251,251,0.5)]">psychology</span>
        <h2 className="font-headline-lg text-4xl text-hex-primary uppercase tracking-[0.2em] mb-4">Memory_Retention_Complete</h2>
        <p className="text-hex-on-surface-variant/60 font-body-md mb-12 italic">// Neural patterns stabilized. Objective completed.</p>
        <div className="flex gap-6">
          <button 
            onClick={onBack} 
            className="px-8 py-4 border border-hex-primary-fixed/20 text-hex-primary-fixed/60 font-label-caps text-xs uppercase tracking-widest hover:bg-hex-primary-fixed/5 transition-all"
          >
            RETURN_TO_BASE
          </button>
          <button 
            onClick={onComplete} 
            className="px-10 py-4 bg-hex-primary-fixed text-hex-on-primary font-label-caps text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(0,251,251,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            CLAIM_XP_SIGNAL
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = Math.round((currentIndex / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-hex-primary-fixed/20 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/5 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-hex-primary-fixed">arrow_back</span>
          </button>
          <h1 className="font-headline-lg text-2xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.3)]">
            {deck.title}
          </h1>
        </div>
        <div className="font-monospace-data text-[12px] text-hex-primary-fixed bg-hex-primary-fixed/5 border border-hex-primary-fixed/20 px-6 py-2 rounded shadow-[0_0_10px_rgba(0,251,251,0.1)]">
          NODE {currentIndex + 1} // {cards.length}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-hex-surface-container-highest rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF] transition-all duration-500" style={{ width: `\${progress}%` }} />
      </div>

      {/* 3D Flip Card */}
      <div className="relative h-[450px] w-full perspective-[2000px] cursor-crosshair group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`absolute inset-0 w-full h-full academy-card-flip transition-transform duration-700 preserve-3d \${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 w-full h-full academy-card-face backface-hidden bg-hex-surface/60 backdrop-blur-xl border border-hex-primary-fixed/20 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-[0_10px_50px_rgba(0,0,0,0.5)] group-hover:border-hex-primary-fixed/40 transition-all">
            <span className="material-symbols-outlined text-4xl text-hex-primary-fixed/30 absolute top-8 left-8">psychology</span>
            <div className="font-monospace-data text-[10px] text-hex-on-surface-variant/40 uppercase tracking-[0.4em] absolute top-10 right-10 italic">SIGNAL_INPUT</div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-hex-primary leading-tight uppercase tracking-tight">{currentCard.front}</h2>
            <div className="absolute bottom-10 flex items-center gap-3 text-hex-primary-fixed/40 font-monospace-data text-[10px] uppercase tracking-[0.3em] animate-pulse">
              <span className="material-symbols-outlined text-lg">touch_app</span>
              INVERT_CARD_TO_DECODE
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full academy-card-face backface-hidden academy-card-back bg-hex-surface-container-low/90 backdrop-blur-xl border border-hex-secondary/30 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="font-monospace-data text-[10px] text-hex-secondary/60 uppercase tracking-[0.4em] absolute top-10 right-10 italic">SIGNAL_DECODED</div>
            <p className="font-body-md text-xl md:text-2xl text-hex-primary leading-relaxed opacity-90">{currentCard.back}</p>
            <div className="absolute bottom-10 w-full px-12 h-[1px] bg-gradient-to-r from-transparent via-hex-secondary/20 to-transparent"></div>
          </div>

        </div>
      </div>

      {/* Actions HUD */}
      <div className={`flex justify-center gap-8 transition-all duration-500 \${isFlipped ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleMark('review'); }}
          className="group px-12 py-5 bg-hex-surface border border-hex-error/20 hover:border-hex-error/60 text-hex-error font-label-caps text-xs uppercase tracking-[0.2em] rounded-lg transition-all flex items-center gap-4 hover:bg-hex-error/5 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">sync_problem</span>
          NEEDS_STABILIZATION
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleMark('mastered'); }}
          className="group px-16 py-5 bg-hex-secondary text-hex-on-secondary font-label-caps text-xs uppercase tracking-[0.3em] rounded-lg font-bold shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all flex items-center gap-4 hover:brightness-110 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-125 transition-transform">verified</span>
          PATTERN_MATCHED
        </button>
      </div>
    </div>
  );
}

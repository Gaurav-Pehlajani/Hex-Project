import React, { useState, useEffect } from 'react';
import { Module } from '@/lib/academy-data';
import { ChevronLeft, BookOpen, Target, Brain, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { getModuleContentCache, saveModuleContentCache } from '@/lib/academy-supabase';
import { sendToDeepSeek } from '@/lib/deepseek-client';

interface ModuleViewProps {
  module: Module;
  isPremium: boolean;
  isCompleted: boolean;
  onBack: () => void;
  onMarkComplete: () => void;
  onStartLab?: () => void;
  onStartFlashcards?: () => void;
  onStartQuiz?: () => void;
}

export default function ModuleView({ module, isPremium, isCompleted, onBack, onMarkComplete, onStartLab, onStartFlashcards, onStartQuiz }: ModuleViewProps) {
  const [content, setContent] = useState<string>(module.content);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If premium, attempt to load rich AI content
    if (isPremium && module.id.includes('ai-') || module.id.includes('prompt-injection') || module.id.includes('jailbreak')) {
      loadDynamicContent();
    }
  }, [module.id, isPremium]);

  const loadDynamicContent = async () => {
    setIsGenerating(true);
    try {
      // 1. Check Cache
      const cached = await getModuleContentCache(module.id);
      if (cached) {
        setContent(cached);
        setIsGenerating(false);
        return;
      }

      // 2. Generate if not cached (using direct Groq call as agreed)
      const systemPrompt = `You are an elite cybersecurity instructor creating content for HEX Academy.
Write a comprehensive, highly technical, and engaging module on the topic: \${module.title}.
Format your response in Markdown. Include code snippets where relevant.
Structure:
1. Executive Summary
2. Technical Deep Dive (How it works under the hood)
3. Real-World Exploitation Examples
4. Defense & Mitigation Strategies
Keep the tone professional, hacker-oriented, and educational.`;

      let generated = '';
      await sendToDeepSeek(
        [{ role: 'user', content: `Generate the module content for: \${module.description}` }],
        systemPrompt,
        (chunk) => { generated += chunk; setContent(generated); },
        async () => {
          setIsGenerating(false);
          // Save to cache via Supabase (if RLS allows, or just skip caching if using client side for now.
          // Note: The migration didn't add a policy for authenticated users to insert, so this might fail unless updated.
          // We'll catch and ignore cache write failures.
        },
        (err) => {
          console.error('Generation failed:', err);
          setIsGenerating(false);
          setContent(module.content + '\n\n*(Failed to load extended AI content. Showing base content instead.)*');
        }
      );
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-32">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/10 text-gray-400">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-green-500" />
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{module.title}</h1>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 font-bold text-xs uppercase tracking-widest">
            <CheckCircle2 className="h-4 w-4" /> Completed
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            
            {isGenerating && (
              <div className="absolute top-4 right-4 flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-xs font-bold animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" /> Synthesizing AI Intel...
              </div>
            )}
            {!isGenerating && isPremium && content !== module.content && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] uppercase font-bold tracking-widest">
                <Sparkles className="h-3 w-3" /> AI Enhanced
              </div>
            )}

            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/5 rounded-2xl p-6 sticky top-6">
            <h3 className="font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Module Operations</h3>
            
            <div className="space-y-3">
              {module.labId && (
                <Button 
                  onClick={onStartLab}
                  className="w-full justify-start bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 h-12"
                >
                  <Target className="mr-3 h-5 w-5" /> Execute Lab Challenge
                </Button>
              )}
              
              <Button 
                onClick={onStartFlashcards}
                variant="outline"
                className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-cyan-400 h-12"
              >
                <Brain className="mr-3 h-5 w-5" /> Study Flashcards
              </Button>

              {module.quizId && (
                <Button 
                  onClick={onStartQuiz}
                  variant="outline"
                  className="w-full justify-start border-white/10 hover:bg-white/5 hover:text-purple-400 h-12"
                >
                  <BookOpen className="mr-3 h-5 w-5" /> Take Module Quiz
                </Button>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Button 
                onClick={onMarkComplete}
                disabled={isCompleted}
                className={`w-full h-12 font-bold uppercase tracking-widest \${
                  isCompleted 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
                    : 'bg-green-600 hover:bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                }`}
              >
                {isCompleted ? 'Module Completed' : 'Mark as Complete'}
              </Button>
              {!isCompleted && (
                <p className="text-center mt-2 text-[10px] text-gray-500 font-mono uppercase">+{module.xpReward} XP Reward</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

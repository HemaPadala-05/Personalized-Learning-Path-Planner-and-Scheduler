
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getModuleExplanation, 
  generateFlashcards, 
  generateQuiz,
  getDoubtSolverResponse
} from '../services/geminiService';
import { StudyModule, Flashcard, QuizQuestion, ChatMessage, Course, UserProfile } from '../types';
import { 
  ArrowLeft, BookOpen, Zap, CheckCircle2, Loader2, ChevronRight, RefreshCw, Trophy, MessageSquare, Youtube, Send, X, Sparkles, LayoutGrid, Play
} from 'lucide-react';

interface LearningExperienceProps {
  onUpdateUser: (user: UserProfile) => void;
}

const LearningExperience: React.FC<LearningExperienceProps> = ({ onUpdateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { module: StudyModule, subject: string } | null;

  const [currentModule, setCurrentModule] = useState<StudyModule | null>(state?.module || null);
  const [subjectName, setSubjectName] = useState<string>(state?.subject || "");

  const [step, setStep] = useState<'explanation' | 'flashcards' | 'quiz' | 'result'>('explanation');
  const [loading, setLoading] = useState(true);
  
  const [explanation, setExplanation] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (!currentModule || !subjectName) {
      navigate('/');
      return;
    }
    loadExplanation();
  }, [currentModule]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadExplanation = async () => {
    if (!currentModule) return;
    setLoading(true);
    setStep('explanation');
    try {
      const content = await getModuleExplanation(subjectName, currentModule.title);
      setExplanation(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput || chatLoading || !currentModule) return;
    const msg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const resp = await getDoubtSolverResponse(`${subjectName} > ${currentModule.title}`, chatInput);
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: resp }]);
    } catch (e) { console.error(e); } finally { setChatLoading(false); }
  };

  const startFlashcards = async () => {
    if (!currentModule) return;
    setLoading(true);
    setStep('flashcards');
    try {
      const cards = await generateFlashcards(subjectName, currentModule.title);
      setFlashcards(cards);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!currentModule) return;
    setLoading(true);
    setStep('quiz');
    try {
      const questions = await generateQuiz(subjectName, currentModule.title);
      setQuiz(questions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    if (idx === quiz[currentQuestion].correctAnswer) setScore(s => s + 1);
    
    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(q => q + 1);
        setSelectedOption(null);
      } else {
        setStep('result');
        updateProgress();
      }
    }, 800);
  };

  const updateProgress = () => {
    if (!currentModule) return;
    const savedUserStr = localStorage.getItem('smart_learn_user');
    if (savedUserStr) {
      const user: UserProfile = JSON.parse(savedUserStr);
      const course = user.enrolledCourses.find((c: Course) => c.name === subjectName);
      if (course) {
        const modIdx = course.roadmap.findIndex((m: StudyModule) => m.id === currentModule.id);
        if (modIdx !== -1) {
          course.roadmap[modIdx].status = 'completed';
          if (modIdx + 1 < course.roadmap.length) {
            course.roadmap[modIdx + 1].status = 'in-progress';
          }
        }
        const completed = course.roadmap.filter((m: StudyModule) => m.status === 'completed').length;
        course.progress = Math.round((completed / course.roadmap.length) * 100);
        
        if (course.progress === 100) {
          course.status = 'completed';
        }

        onUpdateUser(user);
      }
    }
  };

  const goToNextModule = () => {
    const savedUserStr = localStorage.getItem('smart_learn_user');
    if (savedUserStr) {
      const user: UserProfile = JSON.parse(savedUserStr);
      const course = user.enrolledCourses.find((c: Course) => c.name === subjectName);
      if (course) {
        const nextPending = course.roadmap.find((m: StudyModule) => m.status === 'in-progress' || m.status === 'pending');
        if (nextPending) {
          setCurrentModule(nextPending);
          setStep('explanation');
          setCurrentQuestion(0);
          setScore(0);
          setSelectedOption(null);
          setCurrentCard(0);
          setIsFlipped(false);
          setChatMessages([]);
          navigate('/study', { state: { module: nextPending, subject: subjectName }, replace: true });
        } else {
          navigate('/');
        }
      }
    }
  };

  // Helper function to view the curriculum graph for the current course
  const handleViewGraph = () => {
    const savedUserStr = localStorage.getItem('smart_learn_user');
    if (savedUserStr) {
      const user: UserProfile = JSON.parse(savedUserStr);
      const course = user.enrolledCourses.find((c: Course) => c.name === subjectName);
      if (course) {
        navigate('/roadmap', { state: { viewingCourse: course } });
        return;
      }
    }
    navigate('/roadmap');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-pulse">
      <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
        <Loader2 className="animate-spin" size={48} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">Solving Makespan...</h2>
        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">AI Agent is optimizing the next Knowledge Operation</p>
      </div>
    </div>
  );

  if (!currentModule) return null;

  return (
    <div className="max-w-6xl mx-auto flex gap-10 pb-20 relative animate-in fade-in duration-500">
      <div className="flex-1 max-w-4xl space-y-10">
        <header className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-slate-500 hover:text-white transition-all shadow-lg hover:border-indigo-500/30">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter">{currentModule.title}</h2>
            <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mt-1">{subjectName} | JSSP Operation</p>
          </div>
        </header>

        {step === 'explanation' && (
          <div className="space-y-10">
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl space-y-10 border-t-indigo-500/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-600"></div>
              <div className="prose prose-invert prose-xl max-w-none">
                {explanation.split('\n').map((l, i) => (
                  <p key={i} className="mb-6 leading-relaxed text-slate-300 text-lg font-medium">{l}</p>
                ))}
              </div>
              <button onClick={startFlashcards} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group">
                Proceed to Knowledge Recall <Zap size={24} className="group-hover:scale-125 transition-transform" />
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] space-y-8">
              <h3 className="text-xl font-black text-white flex items-center gap-4">
                <Youtube className="text-pink-500" size={28} /> Augmented Visual Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentModule.resources?.map((res, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res)}`} target="_blank" rel="noreferrer" className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] hover:border-indigo-500 transition-all flex items-center gap-5 group">
                    <div className="p-4 bg-pink-500/10 text-pink-500 rounded-2xl group-hover:bg-pink-500 group-hover:text-white transition-all"><Youtube size={22} /></div>
                    <span className="text-sm text-slate-400 font-bold group-hover:text-white transition-all">{res}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'flashcards' && (
          <div className="space-y-12 max-w-3xl mx-auto">
            <div className="perspective-1000 w-full h-[520px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-slate-800 rounded-[4.5rem] flex flex-col items-center justify-center p-16 text-center shadow-2xl">
                  <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 font-black mb-8 text-[10px] uppercase tracking-[0.4em] rounded-full border border-indigo-500/20">Query Node {currentCard + 1}</span>
                  <h4 className="text-4xl font-black text-white leading-tight">{flashcards[currentCard].question}</h4>
                  <p className="mt-16 text-slate-600 font-black text-[10px] uppercase tracking-widest animate-bounce">Click to flip state</p>
                </div>
                <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-[4.5rem] flex flex-col items-center justify-center p-16 text-center rotate-y-180 shadow-2xl">
                   <p className="text-white text-3xl leading-relaxed font-black">{flashcards[currentCard].answer}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-10">
              <button onClick={() => { setCurrentCard(c => c - 1); setIsFlipped(false); }} disabled={currentCard === 0} className="p-6 bg-slate-800 rounded-[2rem] text-white disabled:opacity-20 transition-all hover:bg-slate-700">
                <ArrowLeft size={32} />
              </button>
              <div className="flex gap-4">
                {flashcards.map((_, i) => <div key={i} className={`h-2.5 w-10 rounded-full transition-all duration-500 ${i === currentCard ? 'bg-indigo-500 shadow-[0_0_15px_#6366f1] w-16' : 'bg-slate-800'}`}></div>)}
              </div>
              {currentCard < flashcards.length - 1 ? (
                <button onClick={() => { setCurrentCard(c => c + 1); setIsFlipped(false); }} className="p-6 bg-slate-800 rounded-[2rem] text-white hover:bg-slate-700 transition-all">
                  <ChevronRight size={32} />
                </button>
              ) : (
                <button onClick={startQuiz} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                  Launch Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-8">
            <div className="bg-slate-900 border border-slate-800 p-16 rounded-[4rem] shadow-2xl space-y-14 border-b-indigo-500/20 relative">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-4xl font-black text-white leading-tight flex-1 pr-12">{quiz[currentQuestion].question}</h4>
                <div className="px-6 py-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
                  <span className="text-indigo-400 font-black font-mono text-lg">Q{currentQuestion + 1} <span className="text-slate-700 text-sm">/ 5</span></span>
                </div>
              </div>
              <div className="grid gap-5">
                {quiz[currentQuestion].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selectedOption !== null} className={`w-full p-8 text-left rounded-[2rem] border-2 transition-all text-xl font-bold flex justify-between items-center group ${
                    selectedOption === i ? (i === quiz[currentQuestion].correctAnswer ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-pink-500/10 border-pink-500 text-pink-400') : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-indigo-500 hover:text-white'
                  }`}>
                    <span className="flex-1">{opt}</span>
                    {selectedOption === i && (i === quiz[currentQuestion].correctAnswer ? <CheckCircle2 className="text-emerald-500" size={28} /> : <X className="text-pink-500" size={28} />)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="bg-slate-900 border border-slate-800 p-24 rounded-[5rem] text-center space-y-14 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#4f46e522_0%,transparent_70%)]"></div>
            <div className="w-40 h-40 bg-amber-500 rounded-[3.5rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-amber-500/30 relative z-10">
              <Trophy size={80} />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-6xl font-black text-white tracking-tighter">Knowledge Integrated</h3>
              <p className="text-slate-500 text-3xl font-bold">Accuracy: <span className="text-indigo-400 font-black">{(score/5)*100}%</span></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 justify-center relative z-10">
              <button 
                onClick={handleViewGraph} 
                className="px-14 py-7 bg-slate-800 hover:bg-slate-700 rounded-[2.5rem] text-white font-black text-xl transition-all flex items-center justify-center gap-4"
              >
                <LayoutGrid size={28} /> View Graph
              </button>
              <button 
                onClick={goToNextModule} 
                className="px-14 py-7 bg-indigo-600 hover:bg-indigo-500 rounded-[2.5rem] text-white font-black text-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-4 active:scale-95"
              >
                Next Operation <Play size={28} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>

      <button onClick={() => setShowChat(!showChat)} className={`fixed bottom-12 right-12 p-8 rounded-[2.5rem] shadow-2xl transition-all z-50 flex items-center gap-5 ${showChat ? 'bg-pink-600 rotate-90 shadow-pink-600/40' : 'bg-indigo-600 shadow-indigo-600/40'} hover:scale-110`}>
        {showChat ? <X size={36} /> : <MessageSquare size={36} />}
        {!showChat && <span className="font-black text-xl pr-4 uppercase tracking-tighter">Query Agent</span>}
      </button>

      {showChat && (
        <div className="w-[480px] h-[750px] fixed bottom-36 right-12 bg-slate-900 border border-slate-800 rounded-[4.5rem] shadow-3xl flex flex-col z-50 animate-in slide-in-from-right-10 zoom-in-95 overflow-hidden">
          <header className="p-12 border-b border-slate-800 flex items-center gap-6 bg-slate-900/80 backdrop-blur-md">
            <div className="p-5 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-600/30"><Sparkles size={28} /></div>
            <div>
              <h4 className="font-black text-white text-2xl tracking-tight">Academic Orchestrator</h4>
              <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">{subjectName} Focus</p>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
            {chatMessages.length === 0 && (
              <div className="mt-28 text-center space-y-6 opacity-40">
                <MessageSquare className="mx-auto text-slate-700" size={72} />
                <p className="text-slate-500 text-xl font-black italic tracking-tight">Awaiting student query input...</p>
              </div>
            )}
            {chatMessages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-7 rounded-[2.5rem] text-sm font-bold leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && <div className="flex justify-start"><div className="bg-slate-950 p-7 rounded-[2rem] border border-slate-800"><Loader2 size={24} className="animate-spin text-indigo-500" /></div></div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleDoubt} className="p-10 border-t border-slate-800 flex gap-5 bg-slate-950">
            <input 
              type="text" placeholder="Request concept expansion..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-[2rem] px-8 py-6 text-white font-bold text-sm outline-none focus:border-indigo-500 shadow-inner"
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            />
            <button className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-95"><Send size={24} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LearningExperience;

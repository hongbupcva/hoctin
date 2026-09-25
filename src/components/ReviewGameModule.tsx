import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel, ReviewGame, ReviewGameQuestion, ReviewMatchPair, Topic, Question } from '../types';
import { audioFX } from '../utils/audioFX';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  PlusCircle, 
  Sparkles, 
  Trophy, 
  Zap, 
  Timer, 
  Flame, 
  HelpCircle, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  Users2, 
  Percent, 
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  Crown
} from 'lucide-react';

interface ReviewGameModuleProps {
  games: ReviewGame[];
  topics: Topic[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  userRole: 'teacher' | 'student';
  onAddGame: (game: ReviewGame) => void;
}

export const ReviewGameModule: React.FC<ReviewGameModuleProps> = ({
  games,
  topics,
  selectedGrade,
  setSelectedGrade,
  userRole,
  onAddGame,
}) => {
  // Navigation inside Game Module
  const [viewState, setViewState] = useState<'lobby' | 'playing' | 'creator' | 'leaderboard'>('lobby');
  const [selectedGame, setSelectedGame] = useState<ReviewGame | null>(null);

  // Ensure students stay in lobby or playing, cannot enter creator mode
  useEffect(() => {
    if (userRole === 'student' && viewState === 'creator') {
      setViewState('lobby');
    }
  }, [userRole, viewState]);

  // Active Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerLeft, setTimerLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Lifelines state for Millionaire
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [usedLifelines, setUsedLifelines] = useState<{ fiftyFifty: boolean; aiHint: boolean; audience: boolean }>({
    fiftyFifty: false,
    aiHint: false,
    audience: false,
  });
  const [activeHintMessage, setActiveHintMessage] = useState<string | null>(null);
  const [audiencePoll, setAudiencePoll] = useState<{ A: number; B: number; C: number; D: number } | null>(null);

  // Match Pairs Game State
  const [shuffledCards, setShuffledCards] = useState<{ id: string; pairId: string; text: string; type: 'term' | 'def'; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);

  // Creator Form State
  const [creatorForm, setCreatorForm] = useState<{
    title: string;
    description: string;
    grade: GradeLevel;
    topicCode: string;
    mode: 'speed_quiz' | 'millionaire' | 'match_pairs';
    timeLimit: number;
    questions: ReviewGameQuestion[];
  }>({
    title: '',
    description: '',
    grade: selectedGrade,
    topicCode: 'Chủ đề F',
    mode: 'speed_quiz',
    timeLimit: 15,
    questions: [
      {
        id: 'cq-1',
        text: 'Phép thử Turing do ai đề xuất vào năm 1950?',
        options: [
          { id: 'A', text: 'Alan Turing' },
          { id: 'B', text: 'John McCarthy' },
          { id: 'C', text: 'Ada Lovelace' },
          { id: 'D', text: 'Claude Shannon' }
        ],
        correctOptionId: 'A',
        explanation: 'Alan Turing đề xuất phép thử trong bài báo Computing Machinery and Intelligence năm 1950.',
        hint: 'Trùng với họ của nhà toán học người Anh.',
        knowledgeTag: 'Phép thử Turing'
      }
    ]
  });

  // Filter games by grade
  const gradeGames = games.filter(g => g.grade === selectedGrade || g.topicCode === 'Tổng hợp');

  // Timer loop for Speed Quiz
  useEffect(() => {
    let interval: any;
    if (viewState === 'playing' && selectedGame && !isAnswerRevealed && !gameFinished && selectedGame.mode !== 'match_pairs') {
      interval = setInterval(() => {
        setTimerLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, selectedGame, currentQuestionIndex, isAnswerRevealed, gameFinished]);

  // Handle timeout on a question
  const handleTimeOut = () => {
    audioFX.playWrong();
    setSelectedAnswer('TIMEOUT');
    setIsAnswerRevealed(true);
    setStreak(0);
  };

  // Start a Game
  const handleStartGame = (game: ReviewGame) => {
    setSelectedGame(game);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setGameFinished(false);
    setEliminatedOptions([]);
    setActiveHintMessage(null);
    setAudiencePoll(null);
    setUsedLifelines({ fiftyFifty: false, aiHint: false, audience: false });
    setTimerLeft(game.timePerQuestionSeconds || 15);

    if (game.mode === 'match_pairs' && game.matchPairs) {
      // Setup Match Pairs Cards
      const cards: { id: string; pairId: string; text: string; type: 'term' | 'def'; isFlipped: boolean; isMatched: boolean }[] = [];
      game.matchPairs.forEach((p, idx) => {
        cards.push({ id: `term-${idx}`, pairId: p.id, text: p.term, type: 'term', isFlipped: false, isMatched: false });
        cards.push({ id: `def-${idx}`, pairId: p.id, text: p.definition, type: 'def', isFlipped: false, isMatched: false });
      });
      // Shuffle cards randomly
      setShuffledCards(cards.sort(() => Math.random() - 0.5));
      setFlippedCards([]);
      setMatchedPairsCount(0);
    }

    setViewState('playing');
  };

  // Speed Quiz / Millionaire: Choose an option
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerRevealed || !selectedGame) return;

    setSelectedAnswer(optionId);
    setIsAnswerRevealed(true);

    const question = selectedGame.questions[currentQuestionIndex];
    const isCorrect = optionId === question.correctOptionId;

    if (isCorrect) {
      audioFX.playCorrect();
      const streakMultiplier = streak >= 2 ? 2 : 1;
      const timeBonus = Math.max(10, timerLeft * 10);
      const pointsEarned = selectedGame.mode === 'millionaire' 
        ? Math.pow(2, currentQuestionIndex + 1) * 50000 
        : (100 + timeBonus) * streakMultiplier;

      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
    } else {
      audioFX.playWrong();
      setStreak(0);
    }
  };

  // Next Question or End
  const handleNextQuestion = () => {
    if (!selectedGame) return;

    if (currentQuestionIndex + 1 < selectedGame.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setEliminatedOptions([]);
      setActiveHintMessage(null);
      setAudiencePoll(null);
      setTimerLeft(selectedGame.timePerQuestionSeconds || 15);
    } else {
      setGameFinished(true);
      audioFX.playVictory();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  // Lifelines in Millionaire mode
  const handleUse5050 = () => {
    if (usedLifelines.fiftyFifty || !selectedGame) return;
    const currentQ = selectedGame.questions[currentQuestionIndex];
    const wrongOptions = currentQ.options.filter(o => o.id !== currentQ.correctOptionId);
    // Shuffle and pick 2 wrong options to eliminate
    const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2).map(o => o.id);
    setEliminatedOptions(toEliminate);
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
    audioFX.playFlip();
  };

  const handleUseAiHint = () => {
    if (usedLifelines.aiHint || !selectedGame) return;
    const currentQ = selectedGame.questions[currentQuestionIndex];
    setActiveHintMessage(currentQ.hint || `Trợ lý AI gợi ý: Hãy chú ý các đặc trưng trọng tâm của "${currentQ.knowledgeTag}" trong SGK Kết nối tri thức!`);
    setUsedLifelines(prev => ({ ...prev, aiHint: true }));
    audioFX.playFlip();
  };

  const handleUseAudience = () => {
    if (usedLifelines.audience || !selectedGame) return;
    const currentQ = selectedGame.questions[currentQuestionIndex];
    const poll: Record<string, number> = { A: 10, B: 10, C: 10, D: 10 };
    poll[currentQ.correctOptionId] = 68; // majority vote on correct option
    setAudiencePoll(poll as any);
    setUsedLifelines(prev => ({ ...prev, audience: true }));
    audioFX.playFlip();
  };

  // Card Flip for Match Pairs mode
  const handleCardClick = (cardIndex: number) => {
    if (flippedCards.length === 2 || shuffledCards[cardIndex].isFlipped || shuffledCards[cardIndex].isMatched) {
      return;
    }

    audioFX.playFlip();
    const newCards = [...shuffledCards];
    newCards[cardIndex].isFlipped = true;
    setShuffledCards(newCards);

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = newCards[newFlipped[0]];
      const card2 = newCards[newFlipped[1]];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // MATCH!
        audioFX.playCorrect();
        setTimeout(() => {
          newCards[newFlipped[0]].isMatched = true;
          newCards[newFlipped[1]].isMatched = true;
          setShuffledCards([...newCards]);
          setFlippedCards([]);
          const newMatched = matchedPairsCount + 1;
          setMatchedPairsCount(newMatched);
          setScore(prev => prev + 200);

          if (selectedGame?.matchPairs && newMatched === selectedGame.matchPairs.length) {
            setGameFinished(true);
            audioFX.playVictory();
            try {
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            } catch (e) {}
          }
        }, 400);
      } else {
        // NO MATCH
        audioFX.playWrong();
        setTimeout(() => {
          newCards[newFlipped[0]].isFlipped = false;
          newCards[newFlipped[1]].isFlipped = false;
          setShuffledCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Creator Submit
  const handleCreateGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.title.trim()) return;

    const newGame: ReviewGame = {
      id: `game-${Date.now()}`,
      title: creatorForm.title.trim(),
      description: creatorForm.description.trim() || 'Game ôn tập củng cố kiến thức Tin học',
      grade: creatorForm.grade,
      topicCode: creatorForm.topicCode,
      mode: creatorForm.mode,
      timePerQuestionSeconds: creatorForm.timeLimit,
      createdBy: userRole === 'teacher' ? 'ThS. Nguyễn Văn Hùng' : 'Học sinh khởi tạo',
      createdAt: new Date().toISOString().split('T')[0],
      playCount: 1,
      highScore: 0,
      questions: creatorForm.questions,
    };

    onAddGame(newGame);
    setViewState('lobby');
  };

  // Add Question in Creator
  const handleAddQuestionToCreator = () => {
    const newQ: ReviewGameQuestion = {
      id: `cq-${Date.now()}`,
      text: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctOptionId: 'A',
      explanation: '',
      hint: '',
      knowledgeTag: 'Kiến thức cốt lõi',
    };
    setCreatorForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with View Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-indigo-600" />
              Đấu trường Game Ôn tập Tin học THPT
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ôn luyện kiến thức qua các trò chơi tương tác: Đấu trường Tốc độ, Ai là Triệu phú & Ghép thẻ Thuật ngữ
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl shrink-0 border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <button
              onClick={() => { setViewState('lobby'); setGameFinished(false); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                viewState === 'lobby'
                  ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
                  : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
              }`}
            >
              Sảnh Game
            </button>

            {userRole === 'teacher' && (
              <button
                onClick={() => setViewState('creator')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                  viewState === 'creator'
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tạo Game Mới</span>
              </button>
            )}

            <button
              onClick={() => setViewState('leaderboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                viewState === 'leaderboard'
                  ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
                  : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng Vinh danh</span>
            </button>
          </div>
        </div>

        {/* Grade Filter Pills */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Khối lớp:</span>
            {(['10', '11', '12'] as GradeLevel[]).map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                  selectedGrade === grade
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tin học {grade}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {gradeGames.length} trò chơi có sẵn
          </span>
        </div>
      </div>

      {/* 2. SẢNH GAME (LOBBY VIEW) */}
      {viewState === 'lobby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {gradeGames.map(game => {
            const isSpeed = game.mode === 'speed_quiz';
            const isMillionaire = game.mode === 'millionaire';
            const isMatch = game.mode === 'match_pairs';

            return (
              <div
                key={game.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-600">{game.topicCode}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isSpeed ? 'bg-amber-100 text-amber-800' :
                      isMillionaire ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {isSpeed ? '⚡ Đấu trường Tốc độ' : isMillionaire ? '💰 Ai là Triệu phú' : '🃏 Ghép thẻ Thuật ngữ'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {game.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>
                      {isMatch ? `${game.matchPairs?.length || 6} cặp thẻ` : `${game.questions.length} câu hỏi`}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Trophy className="w-3.5 h-3.5" />
                      Kỷ lục: {game.highScore}đ
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {game.playCount} lượt chơi
                  </span>

                  <button
                    onClick={() => handleStartGame(game)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Bắt đầu chơi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TRÌNH CHƠI GAME TƯƠNG TÁC (ACTIVE PLAY VIEW) */}
      {viewState === 'playing' && selectedGame && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Top HUD Meter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                {selectedGame.mode === 'speed_quiz' ? 'Đấu trường Tốc độ' : selectedGame.mode === 'millionaire' ? 'Ai là Triệu phú' : 'Ghép thẻ Thuật ngữ'}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {selectedGame.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Score HUD */}
              <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-mono text-xs flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Điểm: <strong className="text-amber-400 text-sm">{score}</strong></span>
              </div>

              {/* Combo Streak HUD */}
              {streak >= 2 && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1 shadow-xs animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Combo x{streak}!</span>
                </div>
              )}

              {/* Timer HUD (Speed Quiz & Millionaire) */}
              {selectedGame.mode !== 'match_pairs' && !gameFinished && (
                <div className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 ${
                  timerLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-800'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timerLeft}s</span>
                </div>
              )}

              <button
                onClick={() => setViewState('lobby')}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Thoát Game
              </button>
            </div>
          </div>

          {/* GAME ENGINE: MODE 1 - SPEED QUIZ & MODE 2 - MILLIONAIRE */}
          {(selectedGame.mode === 'speed_quiz' || selectedGame.mode === 'millionaire') && !gameFinished && (
            <div className="space-y-6">
              {/* Millionaire Lifelines Bar */}
              {selectedGame.mode === 'millionaire' && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Quyền Trợ giúp:
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUse5050}
                      disabled={usedLifelines.fiftyFifty || isAnswerRevealed}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      50:50
                    </button>

                    <button
                      onClick={handleUseAiHint}
                      disabled={usedLifelines.aiHint || isAnswerRevealed}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Hỏi Trợ lý AI</span>
                    </button>

                    <button
                      onClick={handleUseAudience}
                      disabled={usedLifelines.audience || isAnswerRevealed}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <Users2 className="w-3.5 h-3.5" />
                      <span>Ý kiến Khán giả</span>
                    </button>
                  </div>
                </div>
              )}

              {/* AI Hint Box if activated */}
              {activeHintMessage && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs flex items-start gap-2 shadow-xs">
                  <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Gợi ý từ Trợ lý AI Tin học:</span>
                    <p className="mt-0.5 text-indigo-800">{activeHintMessage}</p>
                  </div>
                </div>
              )}

              {/* Audience Poll Graphic if activated */}
              {audiencePoll && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Users2 className="w-4 h-4 text-emerald-600" />
                    Kết quả Khảo sát Khán giả:
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => (
                      <div key={opt} className="bg-white p-2 rounded border border-slate-200">
                        <span className="font-bold text-slate-700 block">{opt}</span>
                        <div className="w-full bg-slate-100 rounded-full h-2 my-1 overflow-hidden">
                          <div className="bg-emerald-500 h-2" style={{ width: `${audiencePoll[opt]}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{audiencePoll[opt]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Card */}
              {selectedGame.questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Câu {currentQuestionIndex + 1} / {selectedGame.questions.length}</span>
                    <span className="text-slate-400">
                      Chủ đề: {selectedGame.questions[currentQuestionIndex].knowledgeTag}
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
                    <h3 className="text-base font-bold leading-relaxed">
                      {selectedGame.questions[currentQuestionIndex].text}
                    </h3>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedGame.questions[currentQuestionIndex].options.map(opt => {
                      const isEliminated = eliminatedOptions.includes(opt.id);
                      const isSelected = selectedAnswer === opt.id;
                      const isCorrect = opt.id === selectedGame.questions[currentQuestionIndex].correctOptionId;

                      let btnStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                      if (isAnswerRevealed) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-500/20';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      if (isEliminated) {
                        return (
                          <div
                            key={opt.id}
                            className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-300 text-xs italic text-center"
                          >
                            [Đã loại trừ 50:50]
                          </div>
                        );
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isAnswerRevealed}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 shadow-xs ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                            isAnswerRevealed && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isAnswerRevealed && isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {opt.id}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation Box */}
                  {isAnswerRevealed && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        {selectedAnswer === selectedGame.questions[currentQuestionIndex].correctOptionId ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác! (+Điểm combo)
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Chưa chính xác!
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        <strong>Giải thích:</strong> {selectedGame.questions[currentQuestionIndex].explanation}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center gap-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-colors"
                        >
                          <span>{currentQuestionIndex + 1 < selectedGame.questions.length ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* GAME ENGINE: MODE 3 - MATCH PAIRS (GHÉP THẺ THUẬT NGỮ) */}
          {selectedGame.mode === 'match_pairs' && !gameFinished && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">
                  Ghép đúng: <strong className="font-mono text-emerald-600">{matchedPairsCount}</strong> / {selectedGame.matchPairs?.length} cặp thẻ
                </span>
                <span className="text-slate-400">
                  Lật 1 thẻ thuật ngữ và 1 thẻ định nghĩa tương ứng
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {shuffledCards.map((card, idx) => {
                  const isVisible = card.isFlipped || card.isMatched;
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className={`h-28 rounded-xl p-3 border cursor-pointer select-none transition-all flex flex-col justify-center text-center shadow-xs ${
                        card.isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-60 scale-95'
                          : isVisible
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold scale-102 ring-2 ring-indigo-500/20'
                          : 'bg-gradient-to-br from-slate-900 to-indigo-950 border-slate-800 text-indigo-300 hover:border-indigo-400'
                      }`}
                    >
                      {isVisible ? (
                        <p className={`text-xs leading-snug line-clamp-3 ${card.type === 'term' ? 'font-mono font-bold text-blue-700' : 'text-slate-800 font-medium'}`}>
                          {card.text}
                        </p>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Layers className="w-5 h-5 text-indigo-400 opacity-70 mb-1" />
                          <span className="text-[10px] text-slate-400 font-mono">EduTin 12</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME OVER / VICTORY SUMMARY VIEW */}
          {gameFinished && (
            <div className="p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl text-center space-y-5 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Crown className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Chúc mừng bạn đã hoàn thành thử thách!
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  Tổng điểm: {score}
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                  Bạn đã thể hiện sự nắm bắt kiến thức Tin học rất xuất sắc. Hãy tiếp tục thử thách các chủ đề khác hoặc tạo Game của riêng mình!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => handleStartGame(selectedGame)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Chơi lại lần nữa
                </button>

                <button
                  onClick={() => setViewState('lobby')}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                >
                  Trở về Sảnh Game
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TẠO GAME MỚI (CREATOR VIEW) */}
      {viewState === 'creator' && userRole === 'teacher' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Công cụ Tạo Game Ôn tập Mới (Game Creator)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết kế các trò chơi trắc nghiệm tốc độ hoặc thử thách Triệu phú cho học sinh ôn tập trước bài kiểm tra
            </p>
          </div>

          <form onSubmit={handleCreateGameSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên trò chơi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đấu trường Trí tuệ AI Khối 12"
                  value={creatorForm.title}
                  onChange={(e) => setCreatorForm({ ...creatorForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  placeholder="VD: Trò chơi ôn tập kiến thức bài 1 và bài 2 bộ Kết nối tri thức"
                  value={creatorForm.description}
                  onChange={(e) => setCreatorForm({ ...creatorForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
                <select
                  value={creatorForm.grade}
                  onChange={(e) => setCreatorForm({ ...creatorForm, grade: e.target.value as GradeLevel })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                >
                  <option value="12">Tin học 12</option>
                  <option value="11">Tin học 11</option>
                  <option value="10">Tin học 10</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chế độ chơi</label>
                <select
                  value={creatorForm.mode}
                  onChange={(e) => setCreatorForm({ ...creatorForm, mode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                >
                  <option value="speed_quiz">⚡ Đấu trường Tốc độ (Speed Quiz)</option>
                  <option value="millionaire">💰 Ai là Triệu phú (3 quyền trợ giúp)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian mỗi câu (giây)</label>
                <select
                  value={creatorForm.timeLimit}
                  onChange={(e) => setCreatorForm({ ...creatorForm, timeLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                >
                  <option value={10}>10 giây (Cực nhanh)</option>
                  <option value={15}>15 giây (Tiêu chuẩn)</option>
                  <option value={30}>30 giây (Thoải mái)</option>
                </select>
              </div>
            </div>

            {/* Questions Builder */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">
                  Danh sách câu hỏi trong game ({creatorForm.questions.length})
                </span>

                <button
                  type="button"
                  onClick={handleAddQuestionToCreator}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm câu hỏi</span>
                </button>
              </div>

              {creatorForm.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Câu hỏi #{qIndex + 1}</span>
                    <input
                      type="text"
                      placeholder="Tag kiến thức (VD: CSS Flexbox)"
                      value={q.knowledgeTag}
                      onChange={(e) => {
                        const updated = [...creatorForm.questions];
                        updated[qIndex].knowledgeTag = e.target.value;
                        setCreatorForm({ ...creatorForm, questions: updated });
                      }}
                      className="px-2 py-1 text-[11px] border border-slate-200 rounded bg-white"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Nhập nội dung câu hỏi..."
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...creatorForm.questions];
                      updated[qIndex].text = e.target.value;
                      setCreatorForm({ ...creatorForm, questions: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-200 font-bold text-center leading-6 shrink-0">
                          {opt.id}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Đáp án ${opt.id}...`}
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...creatorForm.questions];
                            updated[qIndex].options[optIdx].text = e.target.value;
                            setCreatorForm({ ...creatorForm, questions: updated });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Đáp án chính xác:</span>
                      <select
                        value={q.correctOptionId}
                        onChange={(e) => {
                          const updated = [...creatorForm.questions];
                          updated[qIndex].correctOptionId = e.target.value as any;
                          setCreatorForm({ ...creatorForm, questions: updated });
                        }}
                        className="px-2 py-1 border border-slate-300 rounded font-bold text-emerald-700 bg-white"
                      >
                        <option value="A">Đáp án A</option>
                        <option value="B">Đáp án B</option>
                        <option value="C">Đáp án C</option>
                        <option value="D">Đáp án D</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Gợi ý trợ lý AI (Hint khi dùng quyền trợ giúp)..."
                        value={q.hint || ''}
                        onChange={(e) => {
                          const updated = [...creatorForm.questions];
                          updated[qIndex].hint = e.target.value;
                          setCreatorForm({ ...creatorForm, questions: updated });
                        }}
                        className="w-full px-2.5 py-1 text-[11px] border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewState('lobby')}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs"
              >
                Lưu và Công bố Game
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. BẢNG VINH DANH (LEADERBOARD VIEW) */}
      {viewState === 'leaderboard' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Bảng Vinh danh Cao thủ Ôn tập Tin học
              </h2>
              <p className="text-xs text-slate-500">
                Thành tích điểm số cao nhất trong các lượt chơi game ôn tập của lớp
              </p>
            </div>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Cập nhật trực tiếp
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { rank: 1, name: 'Nguyễn Văn An', class: '12A1', game: 'Đấu trường AI', score: 1450, badge: '🥇 Huy chương Vàng' },
              { rank: 2, name: 'Trần Thị Bích', class: '12A1', game: 'Thử thách CSS Flexbox', score: 1380, badge: '🥈 Huy chương Bạc' },
              { rank: 3, name: 'Vũ Ngọc Hân', class: '12A1', game: 'Đấu trường AI', score: 1250, badge: '🥉 Huy chương Đồng' },
              { rank: 4, name: 'Lê Hoàng Cường', class: '12A1', game: 'Ai là Triệu phú Python', score: 1000, badge: 'Top 5' },
              { rank: 5, name: 'Đỗ Thảo Giang', class: '12A1', game: 'Ghép thẻ Thuật ngữ', score: 980, badge: 'Top 5' },
            ].map(user => (
              <div key={user.rank} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full font-bold flex items-center justify-center font-mono ${
                    user.rank === 1 ? 'bg-amber-100 text-amber-800' :
                    user.rank === 2 ? 'bg-slate-200 text-slate-700' :
                    user.rank === 3 ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {user.rank}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                    <span className="text-slate-400 ml-2">({user.class}) · {user.game}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-indigo-600 text-sm block">
                    {user.score} pts
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{user.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

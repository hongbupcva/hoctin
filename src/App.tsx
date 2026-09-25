import React, { useState } from 'react';
import { GradeLevel, ClassRoom, Student, Topic, Lesson, Assessment, Submission, DiscussionPost, DiscussionReply, LessonMaterial, ReviewGame, ExamSession, SystemConfig } from './types';
import { 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  INITIAL_TOPICS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_DISCUSSIONS,
  INITIAL_EXAM_SESSIONS
} from './data/mockData';
import { INITIAL_GAMES } from './data/mockGames';
import { Header, TabType } from './components/Header';
import { HBLogo } from './components/HBLogo';
import { ClassManager } from './components/ClassManager';
import { LearningSpace } from './components/LearningSpace';
import { AssessmentModule } from './components/AssessmentModule';
import { ReviewGameModule } from './components/ReviewGameModule';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { SystemSettingsModule } from './components/SystemSettingsModule';
import { TeacherPinModal } from './components/TeacherPinModal';
import { Sparkles, Shield, Cpu, BookOpen, Lock } from 'lucide-react';

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  studentOnlyMode: true,
  requirePinForTeacher: true,
  adminPin: '1234',
  hideRoleSwitcherForStudent: false,
  defaultRoleOnAccess: 'student',
  studentAllowedTabs: {
    learning: true,
    assessment: true,
    games: true,
  },
  examLockdownMode: false,
  schoolName: 'Trường THPT Chuyên',
  systemTitle: 'Hệ thống Giáo dục & Đánh giá Năng lực Tin học HB EduTin',
  allowStudentCodePlayground: true,
  allowStudentLeaderboard: true,
  announcementText: 'Khám phá tri thức Tin học THPT 10 - 11 - 12 (SGK Kết nối tri thức)',
};

const getInitialSystemConfig = (): SystemConfig => {
  try {
    const saved = localStorage.getItem('hb_edutin_system_config');
    if (saved) {
      return { ...DEFAULT_SYSTEM_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading system config from localStorage:', e);
  }
  return DEFAULT_SYSTEM_CONFIG;
};

export default function App() {
  // Navigation & Role State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(getInitialSystemConfig);
  const [activeTab, setActiveTab] = useState<TabType>('learning');
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('12');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-12a1');

  // Teacher PIN Security Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Core Data State
  const [classes, setClasses] = useState<ClassRoom[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [examSessions, setExamSessions] = useState<ExamSession[]>(INITIAL_EXAM_SESSIONS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(INITIAL_DISCUSSIONS);
  const [games, setGames] = useState<ReviewGame[]>(INITIAL_GAMES);

  // Contextual Analytics Student Drill-down
  const [analyticsStudentId, setAnalyticsStudentId] = useState<string | null>(null);

  // Ensure students can only access permitted tabs
  React.useEffect(() => {
    if (userRole === 'student') {
      // Never allow teacher-only tabs in student role
      if (
        activeTab === 'classes' ||
        activeTab === 'analytics' ||
        activeTab === 'schema' ||
        activeTab === 'system'
      ) {
        setActiveTab(systemConfig.examLockdownMode ? 'assessment' : 'learning');
        return;
      }

      // If Exam Lockdown is active, lock student to assessment only
      if (systemConfig.examLockdownMode && activeTab !== 'assessment') {
        setActiveTab('assessment');
        return;
      }

      // Check individual allowed modules
      if (activeTab === 'learning' && !systemConfig.studentAllowedTabs.learning) {
        if (systemConfig.studentAllowedTabs.assessment) setActiveTab('assessment');
        else if (systemConfig.studentAllowedTabs.games) setActiveTab('games');
      } else if (activeTab === 'assessment' && !systemConfig.studentAllowedTabs.assessment) {
        if (systemConfig.studentAllowedTabs.learning) setActiveTab('learning');
        else if (systemConfig.studentAllowedTabs.games) setActiveTab('games');
      } else if (activeTab === 'games' && !systemConfig.studentAllowedTabs.games) {
        if (systemConfig.studentAllowedTabs.learning) setActiveTab('learning');
        else if (systemConfig.studentAllowedTabs.assessment) setActiveTab('assessment');
      }
    }
  }, [userRole, activeTab, systemConfig]);

  // System Config Handlers
  const handleSaveSystemConfig = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
    try {
      localStorage.setItem('hb_edutin_system_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving system config to localStorage:', e);
    }
  };

  const handleResetSystemConfig = () => {
    setSystemConfig(DEFAULT_SYSTEM_CONFIG);
    try {
      localStorage.setItem('hb_edutin_system_config', JSON.stringify(DEFAULT_SYSTEM_CONFIG));
    } catch (e) {
      console.error('Error resetting system config in localStorage:', e);
    }
  };

  const handlePreviewStudentMode = () => {
    setUserRole('student');
    setActiveTab(systemConfig.examLockdownMode ? 'assessment' : 'learning');
  };

  const handleUnlockTeacherSuccess = () => {
    setUserRole('teacher');
    setIsPinModalOpen(false);
  };

  // Flatten all lessons across all topics
  const allLessons = React.useMemo(() => {
    return topics.flatMap(t => t.lessons);
  }, [topics]);

  // Handlers for Student Management
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleImportStudents = (imported: Student[]) => {
    setStudents(prev => [...imported, ...prev]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Handlers for Exam Sessions (Đợt kiểm tra)
  const handleAddExamSession = (newSession: ExamSession) => {
    setExamSessions(prev => [newSession, ...prev]);
  };

  const handleEditExamSession = (updatedSession: ExamSession) => {
    setExamSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleDeleteExamSession = (sessionId: string) => {
    setExamSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Handlers for Assessments (Đề kiểm tra)
  const handleAddAssessment = (newAssessment: Assessment) => {
    setAssessments(prev => [newAssessment, ...prev]);
  };

  const handleEditAssessment = (updatedAssessment: Assessment) => {
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments(prev => prev.filter(a => a.id !== assessmentId));
  };

  // Handler for New Assessment Submission
  const handleNewSubmission = (newSub: Submission) => {
    setSubmissions(prev => [newSub, ...prev]);
  };

  // Handler for New Game Creation
  const handleAddGame = (newGame: ReviewGame) => {
    setGames(prev => [newGame, ...prev]);
  };

  // Handlers for Discussion Forum
  const handleAddPost = (newPost: DiscussionPost) => {
    setDiscussions(prev => [newPost, ...prev]);
  };

  const handleAddReply = (postId: string, newReply: DiscussionReply) => {
    setDiscussions(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    }));
  };

  const handleLikePost = (postId: string) => {
    setDiscussions(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  // Handler for Teacher Material Upload
  const handleAddMaterial = (lessonId: string, material: LessonMaterial) => {
    setTopics(prev => prev.map(topic => ({
      ...topic,
      lessons: topic.lessons.map(lesson => {
        if (lesson.id === lessonId) {
          return {
            ...lesson,
            materials: [material, ...(lesson.materials || [])]
          };
        }
        return lesson;
      })
    })));
  };

  // Handlers for Topic CRUD
  const handleAddTopic = (newTopic: Topic) => {
    setTopics(prev => [...prev, newTopic]);
  };

  const handleEditTopic = (updatedTopic: Topic) => {
    setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
  };

  // Handlers for Lesson CRUD
  const handleAddLesson = (topicId: string, newLesson: Lesson) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lessons: [...t.lessons, newLesson]
        };
      }
      return t;
    }));
  };

  const handleEditLesson = (topicId: string, updatedLesson: Lesson) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lessons: t.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
        };
      }
      return t;
    }));
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          lessons: t.lessons.filter(l => l.id !== lessonId)
        };
      }
      return t;
    }));
  };

  // Cross-module Navigation Helpers
  const handleSelectStudentForAnalytics = (studentId?: string) => {
    if (userRole !== 'teacher') return;
    if (studentId) {
      setAnalyticsStudentId(studentId);
    }
    setActiveTab('analytics');
  };

  const handleNavigateToLesson = (lessonId: string) => {
    const targetLesson = allLessons.find(l => l.id === lessonId);
    if (targetLesson) {
      setSelectedGrade(targetLesson.grade);
      setActiveTab('learning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 tech-grid-bg flex flex-col font-sans text-slate-900 selection:bg-indigo-500/20">
      {/* 1. Universal Top Navigation Bar with HB Logo */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        systemConfig={systemConfig}
        onOpenTeacherPinModal={() => setIsPinModalOpen(true)}
      />

      {/* 2. Dòng chữ chạy nhấp nháy sinh động (Marquee Ticker): Học vui mỗi ngày! */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 text-slate-200 border-b border-indigo-500/30 py-2.5 overflow-hidden shadow-[0_4px_20px_rgba(79,70,229,0.15)] relative select-none">
        <div className="flex items-center">
          {/* Tag cố định góc trái với đèn hiệu nhấp nháy */}
          <div className="shrink-0 z-10 pl-3.5 pr-3 py-1 bg-slate-950/95 border-r border-indigo-500/40 flex items-center gap-2 shadow-[6px_0_15px_rgba(0,0,0,0.6)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
            </span>
            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-amber-300 tracking-wider uppercase font-mono hidden sm:inline">
              HB EDUTIN
            </span>
          </div>

          {/* Khối chữ chạy liên tục nhấp nháy sinh động (Continuous Seamless Marquee) */}
          <div className="overflow-hidden flex-1 relative whitespace-nowrap">
            <div className="animate-marquee flex items-center">
              {/* Chuỗi nội dung 1 */}
              <div className="flex items-center gap-8 pr-8 shrink-0">
                {/* Cụm 1: Vàng kim nhấp nháy */}
                <span className="animate-glow-gold flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  <span className="animate-twinkle text-base">✨</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">⭐</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-cyan-200 text-xs font-semibold tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block shrink-0" />
                  Khám phá tri thức Tin học THPT 10 - 11 - 12 (SGK Kết nối tri thức)
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>

                {/* Cụm 2: Xanh ngọc phát sáng nhấp nháy */}
                <span className="animate-glow-cyan flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  <span className="animate-twinkle text-base">🚀</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-teal-300 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">💫</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-indigo-200 text-xs font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block shrink-0" />
                  Thực hành code trực quan, rèn luyện tư duy sáng tạo
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>

                {/* Cụm 3: Hồng neon rực rỡ nhấp nháy */}
                <span className="animate-glow-rose flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                  <span className="animate-twinkle text-base">🎉</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-300 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">🔥</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-amber-200 text-xs font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                  Đấu trường Game ôn tập & Đánh giá năng lực tự động
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
              </div>

              {/* Chuỗi nội dung 2 (bản sao đối xứng để chạy vòng tròn liên tục không bị đứt đoạn) */}
              <div className="flex items-center gap-8 pr-8 shrink-0">
                {/* Cụm 1: Vàng kim nhấp nháy */}
                <span className="animate-glow-gold flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  <span className="animate-twinkle text-base">✨</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">⭐</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-cyan-200 text-xs font-semibold tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block shrink-0" />
                  Khám phá tri thức Tin học THPT 10 - 11 - 12 (SGK Kết nối tri thức)
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>

                {/* Cụm 2: Xanh ngọc phát sáng nhấp nháy */}
                <span className="animate-glow-cyan flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  <span className="animate-twinkle text-base">🚀</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-teal-300 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">💫</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-indigo-200 text-xs font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block shrink-0" />
                  Thực hành code trực quan, rèn luyện tư duy sáng tạo
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>

                {/* Cụm 3: Hồng neon rực rỡ nhấp nháy */}
                <span className="animate-glow-rose flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                  <span className="animate-twinkle text-base">🎉</span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-300 animate-shimmer-text">
                    Học vui mỗi ngày!
                  </span>
                  <span className="animate-twinkle-delay text-xs">🔥</span>
                </span>

                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
                <span className="text-amber-200 text-xs font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                  Đấu trường Game ôn tập & Đánh giá năng lực tự động
                </span>
                <span className="text-indigo-400/50 font-mono text-xs">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'classes' && userRole === 'teacher' && (
          <ClassManager
            classes={classes}
            students={students}
            submissions={submissions}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            selectedClassId={selectedClassId}
            setSelectedClassId={setSelectedClassId}
            onAddStudent={handleAddStudent}
            onImportStudents={handleImportStudents}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForAnalytics={handleSelectStudentForAnalytics}
          />
        )}

        {activeTab === 'learning' && (
          <LearningSpace
            topics={topics}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            userRole={userRole}
            discussions={discussions}
            onAddPost={handleAddPost}
            onAddReply={handleAddReply}
            onLikePost={handleLikePost}
            onAddMaterial={handleAddMaterial}
            onAddTopic={handleAddTopic}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentModule
            assessments={assessments}
            submissions={submissions}
            classes={classes}
            students={students}
            topics={topics}
            examSessions={examSessions}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            userRole={userRole}
            onNewSubmission={handleNewSubmission}
            onNavigateToAnalytics={handleSelectStudentForAnalytics}
            onAddExamSession={handleAddExamSession}
            onEditExamSession={handleEditExamSession}
            onDeleteExamSession={handleDeleteExamSession}
            onAddAssessment={handleAddAssessment}
            onEditAssessment={handleEditAssessment}
            onDeleteAssessment={handleDeleteAssessment}
          />
        )}

        {activeTab === 'games' && (
          <ReviewGameModule
            games={games}
            topics={topics}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            userRole={userRole}
            onAddGame={handleAddGame}
          />
        )}

        {activeTab === 'analytics' && userRole === 'teacher' && (
          <AnalyticsDashboard
            assessments={assessments}
            submissions={submissions}
            classes={classes}
            students={students}
            allLessons={allLessons}
            selectedStudentIdForDetail={analyticsStudentId}
            onNavigateToLesson={handleNavigateToLesson}
          />
        )}

        {activeTab === 'schema' && userRole === 'teacher' && (
          <DatabaseSchemaView />
        )}

        {activeTab === 'system' && userRole === 'teacher' && (
          <SystemSettingsModule
            config={systemConfig}
            onSaveConfig={handleSaveSystemConfig}
            onResetDefaults={handleResetSystemConfig}
            onPreviewStudentMode={handlePreviewStudentMode}
          />
        )}
      </main>

      {/* 4. Modern High-Tech Educational Footer with HB Logo */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-12 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand column with HB Logo & Creator Attribution */}
            <div className="flex flex-col items-center sm:items-start gap-1.5">
              <HBLogo size="md" subtitle="Hệ thống Giáo dục & Đánh giá Năng lực Tin học THPT" />
              <p className="text-xs font-medium text-slate-600 sm:pl-[52px]">
                Thiết kế bởi <span className="font-bold text-indigo-600">Hồng Búp CVA</span>
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
              {(!systemConfig.examLockdownMode && systemConfig.studentAllowedTabs.learning) && (
                <button
                  onClick={() => setActiveTab('learning')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Không gian Học tập
                </button>
              )}
              {systemConfig.studentAllowedTabs.assessment && (
                <>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Kiểm tra & Đánh giá
                  </button>
                </>
              )}
              {(!systemConfig.examLockdownMode && systemConfig.studentAllowedTabs.games) && (
                <>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('games')}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Game Ôn tập
                  </button>
                </>
              )}

              {userRole === 'teacher' && (
                <>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Quản lý Lớp học
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    AI Analytics
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('schema')}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    CSDL Schema
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('system')}
                    className="hover:text-indigo-600 font-bold text-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <span>Hệ thống</span>
                  </button>
                </>
              )}

              {userRole === 'student' && (
                <>
                  <span>·</span>
                  <button
                    onClick={() => setIsPinModalOpen(true)}
                    className="hover:text-indigo-600 text-slate-400 transition-colors flex items-center gap-1"
                    title="Mở khóa Giáo viên / Quản trị viên"
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Quản trị viên</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} <strong className="text-slate-700">HB EduTin</strong> · Bộ sách giáo khoa "Kết nối tri thức với cuộc sống" Nhà xuất bản Giáo dục Việt Nam.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Thiết kế bởi <strong className="font-bold text-indigo-900">Hồng Búp CVA</strong>
              </span>
              <div className="flex items-center gap-2 font-mono text-slate-400">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold border border-slate-200">
                  HB-v2.6
                </span>
                <span>All rights reserved</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Teacher PIN Security Modal */}
      <TeacherPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleUnlockTeacherSuccess}
        correctPin={systemConfig.adminPin}
      />
    </div>
  );
}

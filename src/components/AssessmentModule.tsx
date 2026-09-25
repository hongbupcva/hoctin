import React, { useState, useEffect } from 'react';
import { 
  Assessment, 
  Submission, 
  ClassRoom, 
  Student, 
  GradeLevel, 
  ExamSession, 
  Topic, 
  Question 
} from '../types';
import { autoGradeAssessment } from '../utils/aiAnalyticsEngine';
import { exportGradebookToExcel } from '../utils/excelParser';
import { parseRawExamText, SAMPLE_RAW_EXAMS } from '../utils/examParser';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  FileSpreadsheet, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  RotateCcw,
  BookOpen,
  Plus,
  UploadCloud,
  Calendar,
  CalendarPlus,
  Edit3,
  Trash2,
  Filter,
  Search,
  FileText,
  Check,
  Layers,
  GraduationCap,
  Download,
  Info
} from 'lucide-react';

interface AssessmentModuleProps {
  assessments: Assessment[];
  submissions: Submission[];
  classes: ClassRoom[];
  students: Student[];
  topics: Topic[];
  examSessions: ExamSession[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  userRole: 'teacher' | 'student';
  onNewSubmission: (submission: Submission) => void;
  onNavigateToAnalytics: (studentId?: string) => void;
  onAddExamSession: (session: ExamSession) => void;
  onEditExamSession: (session: ExamSession) => void;
  onDeleteExamSession: (sessionId: string) => void;
  onAddAssessment: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onDeleteAssessment: (assessmentId: string) => void;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({
  assessments,
  submissions,
  classes,
  students,
  topics,
  examSessions,
  selectedGrade,
  setSelectedGrade,
  userRole,
  onNewSubmission,
  onNavigateToAnalytics,
  onAddExamSession,
  onEditExamSession,
  onDeleteExamSession,
  onAddAssessment,
  onEditAssessment,
  onDeleteAssessment,
}) => {
  // Navigation & View Tabs
  const [activeTab, setActiveTab] = useState<'tests' | 'sessions' | 'gradebook'>('tests');

  // Student sub-view: 'tests' (Làm bài thi) | 'history' (Lịch sử làm bài)
  const [studentView, setStudentView] = useState<'tests' | 'history'>('tests');

  // Ensure student role is strictly kept in tests/taking mode, preventing access to teacher tabs
  useEffect(() => {
    if (userRole === 'student' && activeTab !== 'tests') {
      setActiveTab('tests');
    }
  }, [userRole, activeTab]);

  // Filters for Tests List
  const [filterGrade, setFilterGrade] = useState<string>('ALL'); // 'ALL' | '10' | '11' | '12'
  const [filterSessionId, setFilterSessionId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected assessment for overview or testing
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(assessments[0]?.id || '');

  // Interactive Quiz Taking State
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(15 * 60);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<Submission | null>(null);

  // Gradebook filters
  const [gradebookClassId, setGradebookClassId] = useState<string>(classes[0]?.id || '');

  // ================= MODALS STATE =================
  // 1. Upload Test Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadGrade, setUploadGrade] = useState<GradeLevel>(selectedGrade || '12');
  const [uploadSessionId, setUploadSessionId] = useState<string>(examSessions[0]?.id || '');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTopicCode, setUploadTopicCode] = useState('Chủ đề 1');
  const [uploadTopicTitle, setUploadTopicTitle] = useState('Kiến thức cốt lõi');
  const [uploadDuration, setUploadDuration] = useState<number>(15);
  const [uploadPassScore, setUploadPassScore] = useState<number>(5.0);
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');
  const [uploadRawText, setUploadRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // 2. Exam Session Modal (Create & Edit)
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ExamSession | null>(null);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    grade: 'ALL' as GradeLevel | 'ALL',
    semester: 'Học kỳ 1' as 'Học kỳ 1' | 'Học kỳ 2' | 'Cả năm',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    status: 'active' as 'active' | 'upcoming' | 'completed',
    description: ''
  });

  // 3. Delete Session Confirmation Modal
  const [sessionToDelete, setSessionToDelete] = useState<ExamSession | null>(null);

  // 4. Manual Create/Edit Assessment Modal
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [assessmentFormData, setAssessmentFormData] = useState({
    title: '',
    description: '',
    grade: '12' as GradeLevel,
    sessionId: '',
    topicCode: 'Chủ đề F',
    topicTitle: 'Định hướng nghề nghiệp',
    durationMinutes: 15,
    passScore: 5.0,
    questions: [] as Question[]
  });

  // 5. Delete Assessment Confirmation Modal
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  const currentAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Timer effect when taking test
  useEffect(() => {
    let timer: any;
    if (isTakingTest && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTakingTest, timeLeftSeconds]);

  // Real-time Parser for Upload Modal
  useEffect(() => {
    if (uploadRawText.trim()) {
      const q = parseRawExamText(uploadRawText, {
        grade: uploadGrade,
        assessmentId: `test-up-${Date.now()}`,
        topicTitle: uploadTopicTitle
      });
      setParsedQuestions(q);
      if (q.length === 0) {
        setUploadError('Chưa nhận diện được câu hỏi. Vui lòng kiểm tra định dạng: "Câu 1: ... A. ... B. ... C. ... D. ... Đáp án: A"');
      } else {
        setUploadError(null);
      }
    } else {
      setParsedQuestions([]);
      setUploadError(null);
    }
  }, [uploadRawText, uploadGrade, uploadTopicTitle]);

  // Load sample raw exam for quick testing in upload modal
  const handleLoadSampleExam = (grade: GradeLevel) => {
    const sample = SAMPLE_RAW_EXAMS[grade];
    if (sample) {
      setUploadGrade(grade);
      setUploadTitle(sample.title);
      setUploadTopicCode(sample.topicCode);
      setUploadTopicTitle(sample.topicTitle);
      setUploadRawText(sample.text);
    }
  };

  // Handle File Input in Upload Modal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.title) setUploadTitle(parsed.title);
          if (parsed.grade) setUploadGrade(parsed.grade);
          if (parsed.topicTitle) setUploadTopicTitle(parsed.topicTitle);
          if (parsed.topicCode) setUploadTopicCode(parsed.topicCode);
          if (parsed.durationMinutes) setUploadDuration(parsed.durationMinutes);
          if (Array.isArray(parsed.questions)) {
            setParsedQuestions(parsed.questions);
            setUploadRawText(
              parsed.questions.map((q: Question, idx: number) => 
                `Câu ${idx + 1}: ${q.text}\n` +
                q.options.map(o => `${o.id}. ${o.text}`).join('\n') +
                `\nĐáp án: ${q.correctOptionId}\nGiải thích: ${q.explanation || ''}`
              ).join('\n\n')
            );
          }
        } catch (err) {
          setUploadError('Tệp JSON không hợp lệ. Vui lòng kiểm tra lại cấu trúc.');
        }
      } else {
        // Plain text file (.txt, .docx as text)
        setUploadRawText(content);
        if (!uploadTitle) {
          setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  // Submit Uploaded Exam
  const handleConfirmUploadExam = () => {
    if (!uploadTitle.trim()) {
      setUploadError('Vui lòng nhập tiêu đề cho đề kiểm tra');
      return;
    }
    if (parsedQuestions.length === 0) {
      setUploadError('Chưa có câu hỏi nào được bóc tách thành công. Vui lòng kiểm tra nội dung đề thi.');
      return;
    }

    const sessionObj = examSessions.find(s => s.id === uploadSessionId);
    const newAssessmentId = `test-${uploadGrade}-${Date.now()}`;

    const newAssessment: Assessment = {
      id: newAssessmentId,
      title: uploadTitle.trim(),
      description: `Đề kiểm tra trắc nghiệm ${parsedQuestions.length} câu hỏi môn Tin học lớp ${uploadGrade} - Sách giáo khoa Kết nối tri thức.`,
      grade: uploadGrade,
      sessionId: uploadSessionId || undefined,
      sessionTitle: sessionObj?.title || undefined,
      topicCode: uploadTopicCode || 'Chủ đề chung',
      topicTitle: uploadTopicTitle || 'Kiến thức cốt lõi',
      durationMinutes: uploadDuration,
      totalPoints: 10,
      passScore: uploadPassScore,
      questionCount: parsedQuestions.length,
      questions: parsedQuestions.map((q, idx) => ({
        ...q,
        id: `q-${newAssessmentId}-${idx + 1}`,
        assessmentId: newAssessmentId,
        grade: uploadGrade
      })),
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: true
    };

    onAddAssessment(newAssessment);
    setSelectedAssessmentId(newAssessment.id);
    setUploadSuccessMsg(`Đã tải lên và xuất bản thành công đề kiểm tra cho Khối ${uploadGrade}!`);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccessMsg(null);
      setUploadRawText('');
      setParsedQuestions([]);
      setActiveTab('tests');
      setFilterGrade(uploadGrade);
    }, 900);
  };

  // Handlers for Exam Sessions Modal
  const handleOpenAddSession = () => {
    setEditingSession(null);
    setSessionFormData({
      title: '',
      grade: 'ALL',
      semester: 'Học kỳ 1',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'active',
      description: ''
    });
    setShowSessionModal(true);
  };

  const handleOpenEditSession = (session: ExamSession) => {
    setEditingSession(session);
    setSessionFormData({
      title: session.title,
      grade: session.grade,
      semester: session.semester,
      startDate: session.startDate,
      endDate: session.endDate,
      status: session.status,
      description: session.description
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = () => {
    if (!sessionFormData.title.trim()) return;

    if (editingSession) {
      onEditExamSession({
        ...editingSession,
        ...sessionFormData
      });
    } else {
      const newSession: ExamSession = {
        id: `session-${Date.now()}`,
        ...sessionFormData
      };
      onAddExamSession(newSession);
    }
    setShowSessionModal(false);
  };

  const handleConfirmDeleteSession = () => {
    if (sessionToDelete) {
      onDeleteExamSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  };

  // Handlers for Manual Assessment Modal
  const handleOpenAddAssessment = (targetGrade?: GradeLevel) => {
    const grade = targetGrade || (filterGrade !== 'ALL' ? filterGrade as GradeLevel : '12');
    const matchedTopics = topics.filter(t => t.grade === grade);
    const firstTopic = matchedTopics[0];

    setEditingAssessment(null);
    setAssessmentFormData({
      title: '',
      description: '',
      grade: grade,
      sessionId: examSessions[0]?.id || '',
      topicCode: firstTopic?.code || 'Chủ đề 1',
      topicTitle: firstTopic?.title || 'Kiến thức cốt lõi',
      durationMinutes: 15,
      passScore: 5.0,
      questions: [
        {
          id: `q-init-1`,
          assessmentId: '',
          lessonId: 'lesson-1',
          lessonTitle: 'Bài học 1',
          topicTitle: firstTopic?.title || 'Chủ đề',
          grade: grade,
          text: '',
          options: [
            { id: 'A', text: '' },
            { id: 'B', text: '' },
            { id: 'C', text: '' },
            { id: 'D', text: '' }
          ],
          correctOptionId: 'A',
          explanation: '',
          difficulty: 'Thông hiểu',
          knowledgeTag: 'Kiến thức cốt lõi'
        }
      ]
    });
    setShowAssessmentModal(true);
  };

  const handleOpenEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setAssessmentFormData({
      title: assessment.title,
      description: assessment.description,
      grade: assessment.grade,
      sessionId: assessment.sessionId || '',
      topicCode: assessment.topicCode,
      topicTitle: assessment.topicTitle,
      durationMinutes: assessment.durationMinutes,
      passScore: assessment.passScore,
      questions: [...assessment.questions]
    });
    setShowAssessmentModal(true);
  };

  const handleSaveAssessment = () => {
    if (!assessmentFormData.title.trim()) return;

    const sessionObj = examSessions.find(s => s.id === assessmentFormData.sessionId);

    if (editingAssessment) {
      onEditAssessment({
        ...editingAssessment,
        title: assessmentFormData.title.trim(),
        description: assessmentFormData.description,
        grade: assessmentFormData.grade,
        sessionId: assessmentFormData.sessionId || undefined,
        sessionTitle: sessionObj?.title || undefined,
        topicCode: assessmentFormData.topicCode,
        topicTitle: assessmentFormData.topicTitle,
        durationMinutes: assessmentFormData.durationMinutes,
        passScore: assessmentFormData.passScore,
        questionCount: assessmentFormData.questions.length,
        questions: assessmentFormData.questions.map(q => ({ ...q, grade: assessmentFormData.grade }))
      });
    } else {
      const newId = `test-${assessmentFormData.grade}-${Date.now()}`;
      const newAssessment: Assessment = {
        id: newId,
        title: assessmentFormData.title.trim(),
        description: assessmentFormData.description || `Đề kiểm tra Tin học lớp ${assessmentFormData.grade}`,
        grade: assessmentFormData.grade,
        sessionId: assessmentFormData.sessionId || undefined,
        sessionTitle: sessionObj?.title || undefined,
        topicCode: assessmentFormData.topicCode,
        topicTitle: assessmentFormData.topicTitle,
        durationMinutes: assessmentFormData.durationMinutes,
        totalPoints: 10,
        passScore: assessmentFormData.passScore,
        questionCount: assessmentFormData.questions.length,
        questions: assessmentFormData.questions.map((q, idx) => ({
          ...q,
          id: `q-${newId}-${idx + 1}`,
          assessmentId: newId,
          grade: assessmentFormData.grade
        })),
        createdAt: new Date().toISOString().split('T')[0],
        isPublished: true
      };
      onAddAssessment(newAssessment);
      setSelectedAssessmentId(newId);
    }
    setShowAssessmentModal(false);
  };

  const handleConfirmDeleteAssessment = () => {
    if (assessmentToDelete) {
      onDeleteAssessment(assessmentToDelete.id);
      setAssessmentToDelete(null);
      if (selectedAssessmentId === assessmentToDelete.id) {
        const remaining = assessments.filter(a => a.id !== assessmentToDelete.id);
        setSelectedAssessmentId(remaining[0]?.id || '');
      }
    }
  };

  // Test-taking Handlers
  const handleStartTest = (assessment: Assessment) => {
    setSelectedAssessmentId(assessment.id);
    setSelectedAnswers({});
    setTimeLeftSeconds(assessment.durationMinutes * 60);
    setLastSubmissionResult(null);
    setIsTakingTest(true);
  };

  const handleSelectOption = (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitTest = () => {
    if (!currentAssessment) return;

    const durationSpent = (currentAssessment.durationMinutes * 60) - timeLeftSeconds;
    const submission = autoGradeAssessment(
      currentAssessment,
      selectedAnswers,
      Math.max(15, durationSpent),
      currentStudent?.id || 'hs-demo',
      currentStudent?.fullName || 'Học sinh kiểm tra',
      currentStudent?.classId || 'class-12a1',
      currentStudent?.className || '12A1'
    );

    onNewSubmission(submission);
    setLastSubmissionResult(submission);
    setIsTakingTest(false);

    if (submission.score >= 8) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore in non-browser env
      }
    }
  };

  // Filtered Assessments
  const filteredAssessments = assessments.filter(item => {
    const matchGrade = filterGrade === 'ALL' || item.grade === filterGrade;
    const matchSession = filterSessionId === 'ALL' || item.sessionId === filterSessionId;
    const matchQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topicTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSession && matchQuery;
  });

  // Gradebook Submissions Filter
  const gradebookSubmissions = submissions.filter(s => {
    const matchClass = !gradebookClassId || s.classId === gradebookClassId;
    const matchAssessment = !selectedAssessmentId || s.assessmentId === selectedAssessmentId;
    return matchClass && matchAssessment;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submissions for current student
  const studentSubmissions = submissions.filter(s => s.studentId === currentStudent?.id);

  return (
    <div className="space-y-6">
      {/* 1. Header with Mode Tabs & Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xs">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {userRole === 'student' ? 'Làm bài Kiểm tra & Đánh giá' : 'Kiểm tra, Đánh giá & Khảo sát Năng lực'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {userRole === 'student'
                    ? 'Làm bài kiểm tra trắc nghiệm Tin học theo từng khối lớp và nhận kết quả, phân tích tự động'
                    : 'Đề kiểm tra phân hóa theo từng khối lớp (10 - 11 - 12), quản lý đợt kiểm tra và tự động chấm điểm AI tức thì'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons + Navigation tabs */}
          {userRole === 'teacher' ? (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Action: Upload Exam */}
              <button
                onClick={() => {
                  setUploadGrade(filterGrade !== 'ALL' ? filterGrade as GradeLevel : '12');
                  setShowUploadModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5"
              >
                <UploadCloud className="w-4 h-4 text-violet-200" />
                <span>Upload Đề kiểm tra</span>
              </button>

              {/* Action: Add Exam Session */}
              <button
                onClick={handleOpenAddSession}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-all"
              >
                <CalendarPlus className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Tạo Đợt kiểm tra</span>
              </button>

              {/* Action: Create Test manually */}
              <button
                onClick={() => handleOpenAddAssessment()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Tạo Đề mới</span>
              </button>

              {/* View Mode Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl shrink-0 border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] ml-1">
                <button
                  onClick={() => { setActiveTab('tests'); setIsTakingTest(false); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none ${
                    activeTab === 'tests'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_2px_6px_rgba(79,70,229,0.35)] border border-indigo-400 border-b-[3px] border-b-indigo-950 font-bold translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Đề kiểm tra ({assessments.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('sessions'); setIsTakingTest(false); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none ${
                    activeTab === 'sessions'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_2px_6px_rgba(79,70,229,0.35)] border border-indigo-400 border-b-[3px] border-b-indigo-950 font-bold translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đợt kiểm tra ({examSessions.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('gradebook'); setIsTakingTest(false); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none ${
                    activeTab === 'gradebook'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_2px_6px_rgba(79,70,229,0.35)] border border-indigo-400 border-b-[3px] border-b-indigo-950 font-bold translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Bảng điểm</span>
                </button>
              </div>
            </div>
          ) : (
            /* Student View Controls: Student Profile Badge + Tests / History sub-toggle */
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">Thí sinh:</span>
                <span className="font-bold text-slate-800">{currentStudent?.fullName || 'Học sinh'}</span>
                <span className="text-slate-400">·</span>
                <span className="font-bold text-cyan-700 font-mono bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                  {currentStudent?.className || '12A1'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl shrink-0 border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <button
                  onClick={() => { setStudentView('tests'); setIsTakingTest(false); setLastSubmissionResult(null); }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none ${
                    studentView === 'tests'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_2px_6px_rgba(79,70,229,0.35)] border border-indigo-400 border-b-[3px] border-b-indigo-950 font-bold translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Danh sách Đề thi ({assessments.length})</span>
                </button>

                <button
                  onClick={() => { setStudentView('history'); setIsTakingTest(false); setLastSubmissionResult(null); }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none ${
                    studentView === 'history'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-[0_2px_6px_rgba(79,70,229,0.35)] border border-indigo-400 border-b-[3px] border-b-indigo-950 font-bold translate-y-[1px]'
                      : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lịch sử làm bài ({studentSubmissions.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE: DANH SÁCH ĐỀ KIỂM TRA (TESTS LIST WITH GRADE FILTERS) */}
      {/* ========================================================================= */}
      {activeTab === 'tests' && (
        <>
          {/* 2A. STUDENT DEDICATED HISTORY VIEW */}
          {userRole === 'student' && studentView === 'history' && !isTakingTest && !lastSubmissionResult && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    Lịch sử làm bài thi của em ({studentSubmissions.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Danh sách các bài kiểm tra trắc nghiệm em đã hoàn thành kèm điểm số và lời giải chi tiết
                  </p>
                </div>

                <button
                  onClick={() => setStudentView('tests')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Làm bài kiểm tra mới</span>
                </button>
              </div>

              {studentSubmissions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Em chưa làm bài kiểm tra nào</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hãy chọn một đề thi trong danh sách để bắt đầu làm bài trắc nghiệm và chấm điểm tức thì.
                  </p>
                  <button
                    onClick={() => setStudentView('tests')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Vào danh sách đề thi</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentSubmissions.map((sub, idx) => {
                    const test = assessments.find(a => a.id === sub.assessmentId);
                    return (
                      <div
                        key={sub.id || idx}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                              test?.grade === '10'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                : test?.grade === '11'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              Tin học {test?.grade || '12'}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {sub.submittedAt}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {sub.assessmentTitle}
                          </h3>

                          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-slate-500 block">Điểm số đạt được:</span>
                              <span className={`text-xl font-extrabold font-mono ${
                                sub.score >= 8.0 ? 'text-emerald-600' : sub.score >= 5.0 ? 'text-indigo-600' : 'text-amber-600'
                              }`}>
                                {sub.score.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 10</span>
                              </span>
                            </div>
                            <div className="text-right text-xs text-slate-600 space-y-0.5">
                              <p>Đúng: <strong className="text-emerald-600 font-mono">{sub.correctCount}/{sub.totalQuestions}</strong> câu</p>
                              <p>Thời gian: <strong className="font-mono">{sub.durationSeconds}s</strong></p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setSelectedAssessmentId(sub.assessmentId);
                              setLastSubmissionResult(sub);
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Xem lại lời giải chi tiết</span>
                          </button>

                          {test && (
                            <button
                              onClick={() => handleStartTest(test)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Làm lại</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2B. TESTS LIST (LÀM BÀI CHO HỌC SINH & QUẢN LÝ CHO GIÁO VIÊN) */}
          {(userRole === 'teacher' || studentView === 'tests') && !isTakingTest && !lastSubmissionResult && (
            <div className="space-y-4">
              {/* Grade Filter Bar & Search Tools */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Grade Level Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Khối lớp:
                  </span>
                  {[
                    { id: 'ALL', label: 'Tất cả khối', count: assessments.length },
                    { id: '10', label: 'Tin học 10', count: assessments.filter(a => a.grade === '10').length },
                    { id: '11', label: 'Tin học 11', count: assessments.filter(a => a.grade === '11').length },
                    { id: '12', label: 'Tin học 12', count: assessments.filter(a => a.grade === '12').length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterGrade(tab.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                        filterGrade === tab.id
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        filterGrade === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Session Filter & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Exam Session Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 whitespace-nowrap">Đợt KT:</span>
                    <select
                      value={filterSessionId}
                      onChange={(e) => setFilterSessionId(e.target.value)}
                      className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-700 max-w-[200px] truncate"
                    >
                      <option value="ALL">Tất cả các đợt</option>
                      {examSessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.grade === 'ALL' ? 'Toàn trường' : `Khối ${s.grade}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search box */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm đề thi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 w-44 focus:w-56 transition-all focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment Cards Grid */}
              {filteredAssessments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Chưa có đề kiểm tra nào phù hợp
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {userRole === 'teacher'
                      ? 'Bạn có thể tải lên đề kiểm tra bằng nút "Upload Đề kiểm tra" hoặc tạo đề mới cho khối lớp này.'
                      : 'Hiện chưa có đề kiểm tra nào trong danh mục này. Em hãy chọn khối lớp khác để tìm bài kiểm tra.'}
                  </p>
                  {userRole === 'teacher' && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setUploadGrade(filterGrade !== 'ALL' ? filterGrade as GradeLevel : '12');
                          setShowUploadModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Upload đề kiểm tra ngay
                      </button>
                      <button
                        onClick={() => handleOpenAddAssessment(filterGrade !== 'ALL' ? filterGrade as GradeLevel : '12')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo đề thủ công
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredAssessments.map(item => {
                    const itemSubmissions = submissions.filter(s => s.assessmentId === item.id);
                    const avgScore = itemSubmissions.length > 0
                      ? Math.round((itemSubmissions.reduce((a, c) => a + c.score, 0) / itemSubmissions.length) * 10) / 10
                      : null;

                    // Student-specific metrics
                    const myItemSubmissions = submissions.filter(s => s.assessmentId === item.id && s.studentId === currentStudent?.id);
                    const bestScore = myItemSubmissions.length > 0 ? Math.max(...myItemSubmissions.map(s => s.score)) : null;
                    const latestSub = myItemSubmissions[0];

                    // Linked session
                    const linkedSession = examSessions.find(s => s.id === item.sessionId);

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group relative"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-1.5">
                              {/* Grade badge */}
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                                item.grade === '10'
                                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                  : item.grade === '11'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                Tin học {item.grade}
                              </span>

                              {/* Topic Code */}
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                {item.topicCode}
                              </span>

                              {/* Exam Session Tag if linked */}
                              {linkedSession && (
                                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md max-w-[150px] truncate">
                                  {linkedSession.title}
                                </span>
                              )}
                            </div>

                            <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {item.durationMinutes} phút · {item.questionCount} câu
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Submissions & Stats Bar */}
                          {userRole === 'teacher' ? (
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-500">
                                Đã có <strong className="text-slate-800 font-mono">{itemSubmissions.length}</strong> lượt nộp bài
                              </span>
                              {avgScore !== null ? (
                                <span className="font-semibold text-slate-700">
                                  Điểm TB: <span className="font-bold text-indigo-600 font-mono">{avgScore}/10</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Chưa có lượt thi</span>
                              )}
                            </div>
                          ) : (
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                              {myItemSubmissions.length > 0 ? (
                                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Đã nộp bài · Điểm cao nhất: <strong className="font-mono text-emerald-800">{bestScore}/10</strong> ({myItemSubmissions.length} lần làm)
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[11px] flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  Chưa làm bài thi này
                                </span>
                              )}
                              <span className="text-slate-500 font-medium text-[11px]">
                                {item.durationMinutes} phút làm bài
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions: Teacher sees Edit/Delete/Take; Student only sees Take/Review */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {userRole === 'teacher' ? (
                            <>
                              <div className="flex items-center gap-1">
                                {/* Teacher Edit Test */}
                                <button
                                  onClick={() => handleOpenEditAssessment(item)}
                                  title="Chỉnh sửa đề kiểm tra"
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                {/* Teacher Delete Test */}
                                <button
                                  onClick={() => setAssessmentToDelete(item)}
                                  title="Xóa đề kiểm tra"
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleStartTest(item)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Vào làm bài thi ngay</span>
                              </button>
                            </>
                          ) : (
                            <div className="w-full flex items-center justify-between gap-2">
                              {myItemSubmissions.length > 0 && latestSub ? (
                                <button
                                  onClick={() => {
                                    setSelectedAssessmentId(item.id);
                                    setLastSubmissionResult(latestSub);
                                  }}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Xem lại bài đã nộp</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-medium">Sẵn sàng làm bài</span>
                              )}

                              <button
                                onClick={() => handleStartTest(item)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5 ml-auto"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>{myItemSubmissions.length > 0 ? 'Làm lại bài thi' : 'Vào làm bài thi ngay'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2C. INTERACTIVE TEST TAKING SCREEN */}
          {/* ========================================================================= */}
          {isTakingTest && currentAssessment && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              {/* Test Header & Countdown Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                      Đang làm bài thi trắc nghiệm · Khối {currentAssessment.grade}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {currentAssessment.topicCode}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {currentAssessment.title}
                  </h2>
                  {userRole === 'teacher' ? (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span>Thí sinh:</span>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1"
                      >
                        {students.slice(0, 20).map(s => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.className})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700">
                      <span>Thí sinh: <strong className="text-slate-900 font-bold">{currentStudent?.fullName}</strong></span>
                      <span>·</span>
                      <span>Lớp: <strong className="text-indigo-600 font-mono font-bold">{currentStudent?.className}</strong></span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        Đang thi trực tuyến
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold font-mono">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Thời gian còn: {formatTime(timeLeftSeconds)}</span>
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Nộp bài & Chấm điểm
                  </button>
                </div>
              </div>

              {/* Question list */}
              <div className="space-y-6">
                {currentAssessment.questions.map((q, idx) => {
                  const selectedOpt = selectedAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            [{q.difficulty}] · {q.knowledgeTag}
                          </span>
                        </div>
                        {selectedOpt && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Đã chọn: {selectedOpt}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.text}
                      </p>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map(opt => {
                          const isChecked = selectedOpt === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleSelectOption(q.id, opt.id)}
                              className={`cursor-pointer p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${
                                isChecked
                                  ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs'
                                  : 'bg-white border-slate-200 hover:bg-slate-100/80 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                isChecked
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'border-slate-300 text-slate-500'
                              }`}>
                                {opt.id}
                              </span>
                              <span className="leading-snug pt-0.5">{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Submit Bar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Đã hoàn thành <strong className="font-mono text-slate-800">{Object.keys(selectedAnswers).length}/{currentAssessment.questions.length}</strong> câu hỏi
                </span>

                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Nộp bài & Chấm điểm tức thì
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2B. AUTO-GRADING RESULT VIEW */}
          {/* ========================================================================= */}
          {lastSubmissionResult && currentAssessment && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Kết quả Chấm điểm Tự động
                  </span>
                  <h2 className="text-2xl font-extrabold mt-1">
                    {lastSubmissionResult.studentName} · {lastSubmissionResult.className}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {lastSubmissionResult.assessmentTitle}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium mt-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    {lastSubmissionResult.feedbackNotes}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-xs shrink-0">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {lastSubmissionResult.score}
                    </span>
                    <span className="text-xs text-slate-300 block">/ 10 điểm</span>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div className="text-xs space-y-1 text-slate-200">
                    <p>Đúng: <strong className="text-emerald-400 font-mono">{lastSubmissionResult.correctCount}/{lastSubmissionResult.totalQuestions}</strong> câu</p>
                    <p>Thời gian: <strong className="font-mono">{lastSubmissionResult.durationSeconds}s</strong></p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setLastSubmissionResult(null)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Quay lại danh sách đề thi
                </button>

                <button
                  onClick={() => onNavigateToAnalytics(lastSubmissionResult.studentId)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Xem Lỗ hổng Kiến thức & Gợi ý Ôn tập AI
                </button>
              </div>

              {/* Detailed Breakdown with Explanations */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Chi tiết từng câu hỏi & Lời giải bài học
                </h3>

                <div className="space-y-4">
                  {currentAssessment.questions.map((q, idx) => {
                    const ans = lastSubmissionResult.answers.find(a => a.questionId === q.id);
                    const isCorrect = ans?.isCorrect ?? false;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                          isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            Câu {idx + 1}: {q.text}
                          </span>
                          <span className={`flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {isCorrect ? 'ĐÚNG' : 'SAI'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1">
                          <p>
                            Đáp án bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-red-700 font-bold'}>{ans?.selectedOptionId || 'Chưa chọn'}</strong>
                            {!isCorrect && (
                              <span className="ml-3 text-slate-500">
                                Đáp án chính xác: <strong className="text-emerald-700 font-bold">{q.correctOptionId}</strong>
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Explanation box */}
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 space-y-1">
                          <span className="font-semibold text-slate-900 flex items-center gap-1 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            Lời giải chi tiết ({q.lessonTitle}):
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. MODE: QUẢN LÝ ĐỢT KIỂM TRA (EXAM SESSIONS MANAGEMENT - CRUD) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && activeTab === 'sessions' && (
        <div className="space-y-5">
          {/* Header Stats Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Các Đợt kiểm tra & Khảo sát định kỳ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổ chức các đợt thi giữa kỳ, cuối kỳ, khảo sát năng lực theo năm học và khối lớp
              </p>
            </div>

            <button
              onClick={handleOpenAddSession}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Tạo đợt kiểm tra mới</span>
            </button>
          </div>

          {/* Exam Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examSessions.map(session => {
              const sessionTests = assessments.filter(a => a.sessionId === session.id);
              const sessionSubmissions = submissions.filter(s => {
                const test = assessments.find(a => a.id === s.assessmentId);
                return test?.sessionId === session.id;
              });

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Status badge & Grade */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        session.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : session.status === 'upcoming'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {session.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {session.status === 'active' ? 'Đang diễn ra' : session.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                      </span>

                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-lg">
                        {session.grade === 'ALL' ? 'Toàn trường' : `Khối ${session.grade}`}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {session.title}
                    </h3>

                    {/* Dates & Semester */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{session.startDate} → {session.endDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {session.semester} · Năm học 2026-2027
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {session.description || 'Không có mô tả chi tiết cho đợt kiểm tra này.'}
                    </p>

                    {/* Test and Submission Counts */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Đề kiểm tra: <strong className="text-slate-800 font-mono font-bold">{sessionTests.length}</strong></span>
                      <span>Lượt nộp: <strong className="text-slate-800 font-mono font-bold">{sessionSubmissions.length}</strong></span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setFilterSessionId(session.id);
                        setActiveTab('tests');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Xem {sessionTests.length} đề thi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Edit Session */}
                      <button
                        onClick={() => handleOpenEditSession(session)}
                        title="Sửa đợt kiểm tra"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {/* Delete Session */}
                      <button
                        onClick={() => setSessionToDelete(session)}
                        title="Xóa đợt kiểm tra"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODE: BẢNG ĐIỂM LỚP HỌC (GRADEBOOK VIEW) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && activeTab === 'gradebook' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chọn lớp học:</label>
                <select
                  value={gradebookClassId}
                  onChange={(e) => setGradebookClassId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="">Tất cả các lớp</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      Lớp {c.name} ({c.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chọn bài kiểm tra:</label>
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => setSelectedAssessmentId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 max-w-[280px] truncate"
                >
                  {assessments.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.grade}] {a.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                const targetClassName = classes.find(c => c.id === gradebookClassId)?.name || 'Khoi_12';
                exportGradebookToExcel(gradebookSubmissions, currentAssessment?.title || 'Kiem_tra', targetClassName);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Bảng Điểm Excel (.xlsx)</span>
            </button>
          </div>

          {/* Submissions Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-center w-12">STT</th>
                    <th className="py-2.5 px-3 font-semibold">Họ và tên học sinh</th>
                    <th className="py-2.5 px-3 font-semibold">Lớp</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Số câu đúng</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Điểm số</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Thời gian làm</th>
                    <th className="py-2.5 px-3 font-semibold">Thời điểm nộp</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Phân tích AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradebookSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Chưa có học sinh nào nộp bài kiểm tra này.
                      </td>
                    </tr>
                  ) : (
                    gradebookSubmissions.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {sub.studentName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">
                          {sub.className}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-700 font-mono">
                          {sub.correctCount}/{sub.totalQuestions}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            sub.score >= 8.0 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : sub.score >= 6.5 
                              ? 'bg-blue-50 text-blue-700' 
                              : sub.score >= 5.0 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {sub.score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {sub.durationSeconds}s
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {sub.submittedAt}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onNavigateToAnalytics(sub.studentId)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center justify-end gap-1 ml-auto"
                          >
                            <span>Xem gợi ý ôn tập</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: UPLOAD ĐỀ KIỂM TRA (HIGH-TECH MODAL) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload & Phân tích Đề kiểm tra
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ tải lên file (.txt, .json) hoặc dán văn bản trắc nghiệm tự động nhận diện đáp án
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            {/* Config Fields: Grade, Session, Duration, Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp áp dụng:</label>
                <select
                  value={uploadGrade}
                  onChange={(e) => setUploadGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-indigo-700"
                >
                  <option value="10">Tin học 10</option>
                  <option value="11">Tin học 11</option>
                  <option value="12">Tin học 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đợt kiểm tra:</label>
                <select
                  value={uploadSessionId}
                  onChange={(e) => setUploadSessionId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="">-- Không gắn đợt --</option>
                  {examSessions.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian làm bài:</label>
                <select
                  value={uploadDuration}
                  onChange={(e) => setUploadDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value={15}>15 phút</option>
                  <option value={20}>20 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút (1 tiết)</option>
                  <option value={90}>90 phút (Cuối kỳ)</option>
                </select>
              </div>
            </div>

            {/* Exam Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề đề kiểm tra:</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="VD: Kiểm tra định kỳ: Lập trình Python & Cấu trúc rẽ nhánh"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Upload Method Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUploadMethod('paste')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      uploadMethod === 'paste'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Dán văn bản trắc nghiệm
                  </button>
                  <button
                    onClick={() => setUploadMethod('file')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      uploadMethod === 'file'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tải file (.txt / .json)
                  </button>
                </div>

                {/* Quick Sample Button */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400">Nạp nhanh mẫu:</span>
                  {(['10', '11', '12'] as GradeLevel[]).map(g => (
                    <button
                      key={g}
                      onClick={() => handleLoadSampleExam(g)}
                      className="px-2 py-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200"
                    >
                      Khối {g}
                    </button>
                  ))}
                </div>
              </div>

              {uploadMethod === 'paste' ? (
                <div>
                  <textarea
                    rows={6}
                    value={uploadRawText}
                    onChange={(e) => setUploadRawText(e.target.value)}
                    placeholder={`Câu 1: Câu hỏi kiểm tra ở đây?&#10;A. Phương án 1&#10;B. Phương án 2&#10;C. Phương án 3&#10;D. Phương án 4&#10;Đáp án: A&#10;Giải thích: Lời giải chi tiết tại sao A đúng...`}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hệ thống tự động nhận diện các dòng: <strong>"Câu 1:", "A.", "B.", "C.", "D.", "Đáp án: X", "Giải thích: ..."</strong>
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    id="exam-file-input"
                    accept=".txt,.json,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="exam-file-input" className="cursor-pointer block space-y-2">
                    <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Bấm để chọn tệp đề thi (.txt, .json) từ máy tính
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hỗ trợ tệp văn bản thô UTF-8 hoặc tệp JSON chuẩn của hệ thống
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Realtime Auto-parser Result Preview */}
            {parsedQuestions.length > 0 && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã nhận diện thành công: {parsedQuestions.length} câu hỏi
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Khối {uploadGrade} · {uploadDuration} phút
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {parsedQuestions.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px]">
                      <p className="font-semibold text-slate-900">
                        {idx + 1}. {q.text}
                      </p>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-slate-600">
                        {q.options.map(opt => (
                          <span
                            key={opt.id}
                            className={opt.id === q.correctOptionId ? 'text-emerald-700 font-bold' : ''}
                          >
                            {opt.id}. {opt.text} {opt.id === q.correctOptionId && '✓'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {parsedQuestions.length > 3 && (
                    <p className="text-center text-[10px] text-slate-400 italic">
                      ... và {parsedQuestions.length - 3} câu hỏi khác
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmUploadExam}
                disabled={parsedQuestions.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận Úp load & Lưu đề thi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: TẠO / SỬA ĐỢT KIỂM TRA (SESSION MODAL) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingSession ? 'Chỉnh sửa Đợt kiểm tra' : 'Tạo Đợt kiểm tra mới'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thiết lập đợt kiểm tra định kỳ hoặc khảo sát chất lượng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đợt kiểm tra:</label>
                <input
                  type="text"
                  value={sessionFormData.title}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, title: e.target.value })}
                  placeholder="VD: Kiểm tra Giữa Học kỳ I - Năm học 2026 - 2027"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp áp dụng:</label>
                  <select
                    value={sessionFormData.grade}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, grade: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="ALL">Tất cả các khối (10, 11, 12)</option>
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Học kỳ:</label>
                  <select
                    value={sessionFormData.semester}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, semester: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="Học kỳ 1">Học kỳ 1</option>
                    <option value="Học kỳ 2">Học kỳ 2</option>
                    <option value="Cả năm">Cả năm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Từ ngày:</label>
                  <input
                    type="date"
                    value={sessionFormData.startDate}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đến ngày:</label>
                  <input
                    type="date"
                    value={sessionFormData.endDate}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái:</label>
                <select
                  value={sessionFormData.status}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="active">Đang diễn ra (Active)</option>
                  <option value="upcoming">Sắp diễn ra (Upcoming)</option>
                  <option value="completed">Đã kết thúc (Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả mục đích đợt kiểm tra:</label>
                <textarea
                  rows={2}
                  value={sessionFormData.description}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, description: e.target.value })}
                  placeholder="Ghi chú chi tiết mục đích, ma trận kiến thức kiểm tra..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSessionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSession}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Lưu Đợt kiểm tra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: XÓA ĐỢT KIỂM TRA (DELETE SESSION CONFIRMATION) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && sessionToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa Đợt kiểm tra?</h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa đợt kiểm tra <strong className="text-slate-900">"{sessionToDelete.title}"</strong> không? Các đề kiểm tra thuộc đợt này sẽ chuyển về trạng thái không gắn đợt.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDeleteSession}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: TẠO / SỬA ĐỀ KIỂM TRA THỦ CÔNG */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingAssessment ? 'Chỉnh sửa Đề kiểm tra' : 'Tạo Đề kiểm tra mới'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cấu hình đề trắc nghiệm theo từng khối lớp và chủ đề SGK
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề đề kiểm tra:</label>
                <input
                  type="text"
                  value={assessmentFormData.title}
                  onChange={(e) => setAssessmentFormData({ ...assessmentFormData, title: e.target.value })}
                  placeholder="VD: Kiểm tra 15 phút: Cấu trúc lặp và mảng một chiều"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
                  <select
                    value={assessmentFormData.grade}
                    onChange={(e) => setAssessmentFormData({ ...assessmentFormData, grade: e.target.value as GradeLevel })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-bold text-indigo-700"
                  >
                    <option value="10">Tin học 10</option>
                    <option value="11">Tin học 11</option>
                    <option value="12">Tin học 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đợt kiểm tra:</label>
                  <select
                    value={assessmentFormData.sessionId}
                    onChange={(e) => setAssessmentFormData({ ...assessmentFormData, sessionId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="">-- Không gắn đợt --</option>
                    {examSessions.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian làm bài:</label>
                  <select
                    value={assessmentFormData.durationMinutes}
                    onChange={(e) => setAssessmentFormData({ ...assessmentFormData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value={15}>15 phút</option>
                    <option value={20}>20 phút</option>
                    <option value={30}>30 phút</option>
                    <option value={45}>45 phút</option>
                    <option value={90}>90 phút</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã chủ đề:</label>
                  <input
                    type="text"
                    value={assessmentFormData.topicCode}
                    onChange={(e) => setAssessmentFormData({ ...assessmentFormData, topicCode: e.target.value })}
                    placeholder="VD: Chủ đề 4"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên chủ đề:</label>
                  <input
                    type="text"
                    value={assessmentFormData.topicTitle}
                    onChange={(e) => setAssessmentFormData({ ...assessmentFormData, topicTitle: e.target.value })}
                    placeholder="VD: Lập trình cơ bản"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Questions count info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Danh sách câu hỏi: <strong className="font-mono text-indigo-600">{assessmentFormData.questions.length}</strong> câu
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newQ: Question = {
                      id: `q-manual-${Date.now()}`,
                      assessmentId: '',
                      lessonId: 'lesson-new',
                      lessonTitle: assessmentFormData.topicTitle,
                      topicTitle: assessmentFormData.topicTitle,
                      grade: assessmentFormData.grade,
                      text: `Câu hỏi số ${assessmentFormData.questions.length + 1}?`,
                      options: [
                        { id: 'A', text: 'Phương án A' },
                        { id: 'B', text: 'Phương án B' },
                        { id: 'C', text: 'Phương án C' },
                        { id: 'D', text: 'Phương án D' }
                      ],
                      correctOptionId: 'A',
                      explanation: 'Lời giải chi tiết cho câu hỏi.',
                      difficulty: 'Thông hiểu',
                      knowledgeTag: 'Kiến thức cốt lõi'
                    };
                    setAssessmentFormData({
                      ...assessmentFormData,
                      questions: [...assessmentFormData.questions, newQ]
                    });
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm câu hỏi</span>
                </button>
              </div>

              {/* Questions List preview/edit */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {assessmentFormData.questions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Câu {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAssessmentFormData({
                            ...assessmentFormData,
                            questions: assessmentFormData.questions.filter((_, i) => i !== idx)
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Xóa câu này
                      </button>
                    </div>

                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => {
                        const updated = [...assessmentFormData.questions];
                        updated[idx].text = e.target.value;
                        setAssessmentFormData({ ...assessmentFormData, questions: updated });
                      }}
                      placeholder="Nội dung câu hỏi..."
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={opt.id} className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            q.correctOptionId === opt.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.id}
                          </span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...assessmentFormData.questions];
                              updated[idx].options[optIdx].text = e.target.value;
                              setAssessmentFormData({ ...assessmentFormData, questions: updated });
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-slate-500">
                      <span>Đáp án đúng:</span>
                      {(['A', 'B', 'C', 'D'] as const).map(letter => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => {
                            const updated = [...assessmentFormData.questions];
                            updated[idx].correctOptionId = letter;
                            setAssessmentFormData({ ...assessmentFormData, questions: updated });
                          }}
                          className={`w-6 h-6 rounded-md font-mono text-xs font-bold ${
                            q.correctOptionId === letter
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAssessment}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Lưu Đề kiểm tra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: XÓA ĐỀ KIỂM TRA (DELETE ASSESSMENT CONFIRMATION) */}
      {/* ========================================================================= */}
      {userRole === 'teacher' && assessmentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa Đề kiểm tra?</h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa đề kiểm tra <strong className="text-slate-900">"{assessmentToDelete.title}"</strong> (Khối {assessmentToDelete.grade}) không? Toàn bộ câu hỏi liên kết sẽ bị xóa khỏi hệ thống.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAssessmentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDeleteAssessment}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

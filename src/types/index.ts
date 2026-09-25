export type GradeLevel = '10' | '11' | '12';

export interface ClassRoom {
  id: string;
  name: string; // e.g. "12A1", "12A2", "11A1", "10A2"
  grade: GradeLevel;
  academicYear: string;
  homeroomTeacher: string;
  roomNumber: string;
  studentCount: number;
}

export interface Student {
  id: string;
  stt: number;
  fullName: string;
  birthDate: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  email: string;
  avatar?: string;
  notes?: string;
}

export interface LessonMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'slide' | 'code' | 'video' | 'doc';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl?: string;
  description?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  grade: GradeLevel;
  lessonNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  summary: string;
  objectives: string[];
  keyPoints: string[];
  theoryMarkdown: string;
  codeSnippet?: {
    lang: 'html' | 'css' | 'python' | 'cpp';
    code: string;
    explanation?: string;
    previewType?: 'html_preview' | 'console_output';
  };
  materials: LessonMaterial[];
  videoEmbedUrl?: string;
}

export interface Topic {
  id: string;
  grade: GradeLevel;
  code: string; // e.g., "Chủ đề F", "Chủ đề E"
  title: string; // "Định hướng nghề nghiệp", "Ứng dụng tin học"
  description: string;
  badgeColor?: string;
  lessons: Lesson[];
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  lessonId: string;
  lessonTitle: string;
  topicTitle: string;
  grade: GradeLevel;
  text: string;
  codeBlock?: {
    lang: string;
    code: string;
  };
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  knowledgeTag: string; // e.g. "CSS Pseudo-classes", "Flexbox align-items", "Khái niệm AI hẹp"
}

export interface ExamSession {
  id: string;
  title: string;
  grade: GradeLevel | 'ALL';
  semester: 'Học kỳ 1' | 'Học kỳ 2' | 'Cả năm';
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  description: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  grade: GradeLevel;
  topicCode: string;
  topicTitle: string;
  durationMinutes: number;
  totalPoints: number;
  passScore: number;
  questionCount: number;
  questions: Question[];
  createdAt: string;
  isPublished: boolean;
  sessionId?: string;
  sessionTitle?: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface Submission {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  submittedAt: string;
  score: number; // e.g. 8.0 / 10
  maxScore: number; // 10
  correctCount: number;
  totalQuestions: number;
  answers: StudentAnswer[];
  durationSeconds: number;
  feedbackNotes?: string;
}

export interface DiscussionReply {
  id: string;
  postId: string;
  authorName: string;
  authorRole: 'Giáo viên' | 'Học sinh';
  avatarBg?: string;
  content: string;
  createdAt: string;
  isAcceptedAnswer?: boolean;
}

export interface DiscussionPost {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorName: string;
  authorRole: 'Giáo viên' | 'Học sinh';
  avatarBg?: string;
  title: string;
  content: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
  createdAt: string;
  likes: number;
  replies: DiscussionReply[];
}

export interface KnowledgeGapReport {
  questionId: string;
  questionText: string;
  lessonId: string;
  lessonTitle: string;
  topicTitle: string;
  knowledgeTag: string;
  difficulty: string;
  wrongCount: number;
  totalCount: number;
  errorRate: number; // 0 - 100%
  mostCommonWrongAnswer: string;
  diagnosticAdvice: string;
}

export interface PersonalizedReviewPlan {
  studentId: string;
  studentName: string;
  score: number;
  classRank: string;
  weakTopics: {
    knowledgeTag: string;
    lessonId: string;
    lessonTitle: string;
    questionText: string;
    wrongChoiceText: string;
    correctChoiceText: string;
    explanation: string;
    recommendedActions: string[];
    suggestedMaterialTitle: string;
  }[];
  generalEncouragement: string;
}

export interface TeacherAIReport {
  summary: string;
  strengths: string[];
  keyWeaknesses: string[];
  pedagogicalRecommendations: string[];
  suggestedLabAdjustment: string;
}

export type GameMode = 'speed_quiz' | 'millionaire' | 'match_pairs';

export interface ReviewGameQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  hint?: string;
  knowledgeTag: string;
}

export interface ReviewMatchPair {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export interface ReviewGame {
  id: string;
  title: string;
  description: string;
  grade: GradeLevel;
  topicCode: string;
  mode: GameMode;
  timePerQuestionSeconds: number;
  questions: ReviewGameQuestion[];
  matchPairs?: ReviewMatchPair[];
  createdBy: string;
  createdAt: string;
  playCount: number;
  highScore: number;
}

export interface SystemConfig {
  studentOnlyMode: boolean; // Khóa phân quyền học sinh
  requirePinForTeacher: boolean; // Yêu cầu mã PIN khi chuyển sang quyền Giáo viên
  adminPin: string; // Mã PIN quản trị (mặc định '1234')
  hideRoleSwitcherForStudent: boolean; // Ẩn nút chuyển vai trò khi ở chế độ học sinh
  defaultRoleOnAccess: 'student' | 'teacher'; // Vai trò mặc định khi truy cập
  studentAllowedTabs: {
    learning: boolean; // Không gian Học tập
    assessment: boolean; // Kiểm tra & Đánh giá
    games: boolean; // Game Ôn tập
  };
  examLockdownMode: boolean; // Khóa phòng thi: chỉ cho làm bài kiểm tra
  schoolName: string;
  systemTitle: string;
  allowStudentCodePlayground: boolean;
  allowStudentLeaderboard: boolean;
  announcementText: string;
}


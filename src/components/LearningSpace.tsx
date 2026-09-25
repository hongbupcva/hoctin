import React, { useState } from 'react';
import { GradeLevel, Topic, Lesson, LessonMaterial, DiscussionPost, DiscussionReply } from '../types';
import { DiscussionForum } from './DiscussionForum';
import { 
  BookOpen, 
  Upload, 
  Download, 
  Video, 
  FileText, 
  Code2, 
  Play, 
  Clock, 
  Sparkles, 
  Layers,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  PlusCircle,
  Eye,
  Check
} from 'lucide-react';

interface LearningSpaceProps {
  topics: Topic[];
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  userRole: 'teacher' | 'student';
  discussions: DiscussionPost[];
  onAddPost: (post: DiscussionPost) => void;
  onAddReply: (postId: string, reply: DiscussionReply) => void;
  onLikePost: (postId: string) => void;
  onAddMaterial: (lessonId: string, material: LessonMaterial) => void;
  // Topic CRUD
  onAddTopic?: (topic: Topic) => void;
  onEditTopic?: (topic: Topic) => void;
  onDeleteTopic?: (topicId: string) => void;
  // Lesson CRUD
  onAddLesson?: (topicId: string, lesson: Lesson) => void;
  onEditLesson?: (topicId: string, lesson: Lesson) => void;
  onDeleteLesson?: (topicId: string, lessonId: string) => void;
}

export const LearningSpace: React.FC<LearningSpaceProps> = ({
  topics,
  selectedGrade,
  setSelectedGrade,
  userRole,
  discussions,
  onAddPost,
  onAddReply,
  onLikePost,
  onAddMaterial,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  // Filter topics by grade
  const gradeTopics = topics.filter(t => t.grade === selectedGrade);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(gradeTopics[0]?.id || '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(gradeTopics[0]?.lessons[0]?.id || '');

  // Live code editor simulation state
  const [liveHtmlCode, setLiveHtmlCode] = useState<string>('');
  const [pythonRunResult, setPythonRunResult] = useState<string | null>(null);
  const [isPythonRunning, setIsPythonRunning] = useState<boolean>(false);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<'pdf' | 'slide' | 'video' | 'code'>('pdf');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  // TOPIC MODAL STATE (Add / Edit)
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [topicForm, setTopicForm] = useState({
    code: '',
    title: '',
    description: '',
    grade: selectedGrade,
  });

  // LESSON MODAL STATE (Add / Edit)
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [targetTopicIdForLesson, setTargetTopicIdForLesson] = useState<string>('');
  const [lessonForm, setLessonForm] = useState({
    lessonNumber: 1,
    title: '',
    subtitle: '',
    durationMinutes: 45,
    summary: '',
    objectivesText: '',
    keyPointsText: '',
    theoryMarkdown: '',
    codeLang: 'html' as 'html' | 'css' | 'python' | 'cpp',
    codeSnippet: '',
    codeExplanation: '',
    videoEmbedUrl: '',
  });

  // DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'topic' | 'lesson';
    topicId: string;
    lessonId?: string;
    title: string;
  } | null>(null);

  // Keep topic & lesson in sync when grade changes
  React.useEffect(() => {
    if (gradeTopics.length > 0) {
      const firstTopic = gradeTopics[0];
      setSelectedTopicId(firstTopic.id);
      if (firstTopic.lessons.length > 0) {
        setSelectedLessonId(firstTopic.lessons[0].id);
      } else {
        setSelectedLessonId('');
      }
    }
  }, [selectedGrade]);

  const currentTopic = topics.find(t => t.id === selectedTopicId) || gradeTopics[0];
  const currentLesson = currentTopic?.lessons.find(l => l.id === selectedLessonId) || currentTopic?.lessons[0];

  // Set default code when switching lesson
  React.useEffect(() => {
    if (currentLesson?.codeSnippet) {
      if (currentLesson.codeSnippet.lang === 'html') {
        setLiveHtmlCode(currentLesson.codeSnippet.code);
      } else {
        setPythonRunResult(null);
      }
    }
  }, [currentLesson?.id]);

  // Handle student downloading material
  const handleDownload = (material: LessonMaterial) => {
    const blobContent = `--- TÀI LIỆU HỌC TẬP TIN HỌC ${selectedGrade} ---\nChủ đề: ${currentTopic?.title}\nBài học: ${currentLesson?.title}\nTài liệu: ${material.title}\nNgười đăng: ${material.uploadedBy} (${material.uploadedAt})\n\n[Nội dung tóm tắt & Hướng dẫn ôn tập]\n${currentLesson?.summary}\n\n[Các điểm cốt lõi cần nhớ]:\n${currentLesson?.keyPoints?.map(p => `• ${p}`).join('\n')}\n\nChúc các em học tốt môn Tin học THPT!`;
    const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = material.title.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle teacher upload submission
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !currentLesson) return;

    const newMaterial: LessonMaterial = {
      id: `mat-${Date.now()}`,
      title: uploadTitle.trim(),
      type: uploadType,
      size: uploadType === 'video' ? 'Video liên kết' : '2.1 MB',
      uploadedBy: userRole === 'teacher' ? 'ThS. Nguyễn Văn Hùng' : 'Giáo viên bộ môn',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadUrl: uploadUrl || '#',
      description: `Tài liệu bổ sung cho ${currentLesson.title}`
    };

    onAddMaterial(currentLesson.id, newMaterial);
    setUploadTitle('');
    setUploadUrl('');
    setShowUploadModal(false);
  };

  // Simulate running Python code
  const handleRunPython = () => {
    setIsPythonRunning(true);
    setTimeout(() => {
      setIsPythonRunning(false);
      if (currentLesson?.lessonNumber === 1) {
        setPythonRunResult(">>> Đang nạp tập dữ liệu Iris...\n>>> Huấn luyện cây quyết định DecisionTreeClassifier()...\n>>> Độ chính xác trên tập kiểm tra: 96.7%\n>>> Dự đoán mẫu hoa [5.1, 3.5, 1.4, 0.2]:\n>>> Kết quả: 'setosa' (Hoa diên vĩ Setosa)\n[Hoàn thành trong 0.42s]");
      } else if (currentLesson?.lessonNumber === 16) {
        setPythonRunResult(">>> Gọi hàm đệ quy giai_thua(5):\n  -> 5 * giai_thua(4)\n  -> 4 * giai_thua(3)\n  -> 3 * giai_thua(2)\n  -> 2 * giai_thua(1)\n  -> Base case đạt: trả về 1\n>>> 5! = 120\n[Chương trình kết thúc thành công]");
      } else {
        setPythonRunResult(">>> Chương trình chạy thành công.\n[Output]: Kết quả tính toán chuẩn xác.");
      }
    }, 600);
  };

  // --- TOPIC ACTIONS ---
  const handleOpenAddTopic = () => {
    if (userRole !== 'teacher') return;
    setEditingTopicId(null);
    setTopicForm({
      code: `Chủ đề ${String.fromCharCode(65 + gradeTopics.length)}`,
      title: '',
      description: '',
      grade: selectedGrade,
    });
    setShowTopicModal(true);
  };

  const handleOpenEditTopic = (topic: Topic, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userRole !== 'teacher') return;
    setEditingTopicId(topic.id);
    setTopicForm({
      code: topic.code,
      title: topic.title,
      description: topic.description,
      grade: topic.grade,
    });
    setShowTopicModal(true);
  };

  const handleSaveTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title.trim() || !topicForm.code.trim()) return;

    if (editingTopicId) {
      // Edit existing topic
      const existing = topics.find(t => t.id === editingTopicId);
      if (existing && onEditTopic) {
        onEditTopic({
          ...existing,
          code: topicForm.code.trim(),
          title: topicForm.title.trim(),
          description: topicForm.description.trim(),
          grade: topicForm.grade,
        });
      }
    } else {
      // Add new topic
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        grade: topicForm.grade,
        code: topicForm.code.trim(),
        title: topicForm.title.trim(),
        description: topicForm.description.trim() || 'Chủ đề môn Tin học theo SGK Kết nối tri thức',
        lessons: [],
      };
      if (onAddTopic) onAddTopic(newTopic);
      setSelectedTopicId(newTopic.id);
    }
    setShowTopicModal(false);
  };

  const handleDeleteTopicConfirm = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'topic' && onDeleteTopic) {
      onDeleteTopic(deleteConfirm.topicId);
      // Select another topic if available
      const remaining = gradeTopics.filter(t => t.id !== deleteConfirm.topicId);
      if (remaining.length > 0) {
        setSelectedTopicId(remaining[0].id);
        if (remaining[0].lessons.length > 0) setSelectedLessonId(remaining[0].lessons[0].id);
      }
    }
    setDeleteConfirm(null);
  };

  // --- LESSON ACTIONS ---
  const handleOpenAddLesson = (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (userRole !== 'teacher') return;
    setTargetTopicIdForLesson(topicId);
    setEditingLessonId(null);
    const targetTopic = topics.find(t => t.id === topicId);
    const nextLessonNum = (targetTopic?.lessons.length || 0) + 1;

    setLessonForm({
      lessonNumber: nextLessonNum,
      title: `Bài ${nextLessonNum}: `,
      subtitle: '',
      durationMinutes: 45,
      summary: '',
      objectivesText: 'Hiểu được khái niệm trọng tâm của bài học.\nVận dụng thực hành kiến thức vào giải quyết vấn đề.',
      keyPointsText: 'Kiến thức cốt lõi của bài học theo SGK Kết nối tri thức.',
      theoryMarkdown: '### 1. Khái niệm cơ bản\nNội dung lý thuyết trọng tâm của bài học...',
      codeLang: 'html',
      codeSnippet: '',
      codeExplanation: '',
      videoEmbedUrl: '',
    });
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (lesson: Lesson, topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (userRole !== 'teacher') return;
    setTargetTopicIdForLesson(topicId);
    setEditingLessonId(lesson.id);
    setLessonForm({
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      subtitle: lesson.subtitle || '',
      durationMinutes: lesson.durationMinutes,
      summary: lesson.summary,
      objectivesText: lesson.objectives?.join('\n') || '',
      keyPointsText: lesson.keyPoints?.join('\n') || '',
      theoryMarkdown: lesson.theoryMarkdown || '',
      codeLang: lesson.codeSnippet?.lang || 'html',
      codeSnippet: lesson.codeSnippet?.code || '',
      codeExplanation: lesson.codeSnippet?.explanation || '',
      videoEmbedUrl: lesson.videoEmbedUrl || '',
    });
    setShowLessonModal(true);
  };

  const handleSaveLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    const objectives = lessonForm.objectivesText.split('\n').map(s => s.trim()).filter(Boolean);
    const keyPoints = lessonForm.keyPointsText.split('\n').map(s => s.trim()).filter(Boolean);

    const codeSnippetObj = lessonForm.codeSnippet.trim() ? {
      lang: lessonForm.codeLang,
      code: lessonForm.codeSnippet.trim(),
      explanation: lessonForm.codeExplanation.trim() || undefined,
      previewType: (lessonForm.codeLang === 'html' ? 'html_preview' : 'console_output') as any
    } : undefined;

    if (editingLessonId) {
      // Edit lesson
      const targetTopic = topics.find(t => t.id === targetTopicIdForLesson);
      const existingLesson = targetTopic?.lessons.find(l => l.id === editingLessonId);
      if (existingLesson && onEditLesson) {
        const updated: Lesson = {
          ...existingLesson,
          lessonNumber: Number(lessonForm.lessonNumber),
          title: lessonForm.title.trim(),
          subtitle: lessonForm.subtitle.trim(),
          durationMinutes: Number(lessonForm.durationMinutes),
          summary: lessonForm.summary.trim(),
          objectives,
          keyPoints,
          theoryMarkdown: lessonForm.theoryMarkdown.trim(),
          codeSnippet: codeSnippetObj,
          videoEmbedUrl: lessonForm.videoEmbedUrl.trim() || undefined,
        };
        onEditLesson(targetTopicIdForLesson, updated);
      }
    } else {
      // Add new lesson
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        topicId: targetTopicIdForLesson,
        grade: selectedGrade,
        lessonNumber: Number(lessonForm.lessonNumber),
        title: lessonForm.title.trim(),
        subtitle: lessonForm.subtitle.trim(),
        durationMinutes: Number(lessonForm.durationMinutes),
        summary: lessonForm.summary.trim() || 'Tóm tắt bài học',
        objectives,
        keyPoints,
        theoryMarkdown: lessonForm.theoryMarkdown.trim() || 'Nội dung lý thuyết trọng tâm.',
        codeSnippet: codeSnippetObj,
        materials: [],
        videoEmbedUrl: lessonForm.videoEmbedUrl.trim() || undefined,
      };
      if (onAddLesson) onAddLesson(targetTopicIdForLesson, newLesson);
      setSelectedLessonId(newLesson.id);
    }
    setShowLessonModal(false);
  };

  const handleDeleteLessonConfirm = () => {
    if (!deleteConfirm || !deleteConfirm.lessonId || !onDeleteLesson) return;
    onDeleteLesson(deleteConfirm.topicId, deleteConfirm.lessonId);
    
    // Select remaining lesson
    const parentTopic = topics.find(t => t.id === deleteConfirm.topicId);
    const remainingLessons = parentTopic?.lessons.filter(l => l.id !== deleteConfirm.lessonId) || [];
    if (remainingLessons.length > 0) {
      setSelectedLessonId(remainingLessons[0].id);
    } else {
      setSelectedLessonId('');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Grade Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              {userRole === 'teacher' ? 'Không gian Học tập & Quản trị Bài giảng' : 'Không gian Học tập Tin học THPT'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {userRole === 'teacher'
                ? 'Phân phối chương trình chuẩn SGK "Kết nối tri thức" · Hỗ trợ Thêm, Sửa, Xóa Chủ đề & Bài học'
                : 'Chương trình chuẩn SGK "Kết nối tri thức" · Kích chọn bài học trong danh mục để bắt đầu học tập trực tuyến'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl shrink-0 border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            {(['10', '11', '12'] as GradeLevel[]).map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 select-none cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white font-bold border border-indigo-400 border-b-[3px] border-b-indigo-950 shadow-[0_2px_6px_rgba(79,70,229,0.35)] translate-y-[1px]'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-300/80 border-b-[3px] border-b-slate-400 shadow-2xs hover:from-white hover:to-indigo-50/50 hover:text-indigo-700 hover:border-b-indigo-300 hover:-translate-y-[1px] active:translate-y-[2px] active:border-b-[1px]'
                }`}
              >
                Tin học {grade}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Two-Zone Learning Canvas: Left Sidebar (Topics & Lessons) + Right Content Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Curricular Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            {/* Sidebar Top: Title + Add Topic Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mục lục SGK Tin {selectedGrade}
              </h2>

              {userRole === 'teacher' ? (
                <button
                  onClick={handleOpenAddTopic}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-colors shadow-2xs"
                  title="Thêm Chủ đề mới cho khối lớp này"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Chủ đề</span>
                </button>
              ) : (
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {gradeTopics.length} chủ đề
                </span>
              )}
            </div>

            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              {gradeTopics.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  {userRole === 'teacher'
                    ? `Chưa có chủ đề nào cho khối ${selectedGrade}. Hãy bấm "Thêm Chủ đề" để bắt đầu.`
                    : `Chưa có chủ đề nào cho khối ${selectedGrade}.`}
                </div>
              ) : (
                gradeTopics.map(topic => (
                  <div key={topic.id} className="space-y-2">
                    {/* Topic Header Card */}
                    <div
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        if (topic.lessons.length > 0) setSelectedLessonId(topic.lessons[0].id);
                      }}
                      className={`group cursor-pointer p-2.5 rounded-xl border transition-all ${
                        currentTopic?.id === topic.id
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-indigo-700">{topic.code}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 mr-1">{topic.lessons.length} bài</span>
                          
                          {/* Action buttons on topic */}
                          {userRole === 'teacher' ? (
                            <>
                              <button
                                onClick={(e) => handleOpenAddLesson(topic.id, e)}
                                className="p-1 hover:bg-indigo-200/60 rounded text-indigo-700 transition-colors"
                                title="Thêm bài học vào chủ đề này"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleOpenEditTopic(topic, e)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                                title="Chỉnh sửa Chủ đề này"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm({
                                    type: 'topic',
                                    topicId: topic.id,
                                    title: `${topic.code}: ${topic.title}`
                                  });
                                }}
                                className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 transition-colors"
                                title="Xóa Chủ đề này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${currentTopic?.id === topic.id ? 'text-indigo-600 rotate-90' : 'text-slate-400'}`} />
                          )}
                        </div>
                      </div>
                      <p className="text-xs font-semibold mt-0.5 line-clamp-1">{topic.title}</p>
                    </div>

                    {/* Lessons list under this topic */}
                    <div className="pl-3 space-y-1 border-l-2 border-indigo-200/60 ml-2">
                      {topic.lessons.length === 0 ? (
                        <div className="py-2 px-2 text-[11px] text-slate-400 italic">
                          Chưa có bài học nào.{' '}
                          {userRole === 'teacher' && (
                            <button
                              onClick={() => handleOpenAddLesson(topic.id)}
                              className="text-indigo-600 font-semibold hover:underline"
                            >
                              + Thêm bài ngay
                            </button>
                          )}
                        </div>
                      ) : (
                        topic.lessons.map(lesson => {
                          const isActive = currentLesson?.id === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                setSelectedTopicId(topic.id);
                                setSelectedLessonId(lesson.id);
                              }}
                              className={`group/lesson w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="truncate pr-2 flex items-center gap-1.5">
                                <span className={`font-mono text-[11px] shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                                  B.{lesson.lessonNumber}
                                </span>
                                <span className="truncate">{lesson.title.replace(/^Bài \d+:\s*/, '')}</span>
                              </div>

                              <div className="flex items-center gap-0.5 shrink-0">
                                {userRole === 'teacher' ? (
                                  <>
                                    {/* Edit & Delete Lesson Buttons */}
                                    <button
                                      onClick={(e) => handleOpenEditLesson(lesson, topic.id, e)}
                                      className={`p-1 rounded opacity-70 hover:opacity-100 transition-opacity ${
                                        isActive ? 'hover:bg-blue-700 text-white' : 'hover:bg-slate-200 text-slate-500'
                                      }`}
                                      title="Sửa bài học này"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({
                                          type: 'lesson',
                                          topicId: topic.id,
                                          lessonId: lesson.id,
                                          title: lesson.title
                                        });
                                      }}
                                      className={`p-1 rounded opacity-70 hover:opacity-100 transition-opacity ${
                                        isActive ? 'hover:bg-blue-700 text-white' : 'hover:bg-red-100 text-slate-400 hover:text-red-600'
                                      }`}
                                      title="Xóa bài học này"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  isActive && (
                                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Main Stage: Lesson Detail, Materials & Interactive Playground */}
        <div className="lg:col-span-8 space-y-6">
          {currentLesson && currentTopic ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Lesson Hero Header with Action Buttons */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">{currentTopic.code}</span>
                    <span>·</span>
                    <span>Bài {currentLesson.lessonNumber}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {currentLesson.durationMinutes} phút
                    </span>
                  </div>

                  {/* Header Actions: Sửa bài, Xóa bài, Thêm bài mới, Upload */}
                  {userRole === 'teacher' ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenAddLesson(currentTopic.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        title="Thêm bài học mới vào Chủ đề này"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Thêm bài</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditLesson(currentLesson, currentTopic.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        title="Chỉnh sửa nội dung bài học này"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa bài</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirm({
                          type: 'lesson',
                          topicId: currentTopic.id,
                          lessonId: currentLesson.id,
                          title: currentLesson.title
                        })}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        title="Xóa bài học này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa bài</span>
                      </button>

                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Bài học trực tuyến</span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentLesson.title}
                </h1>
                {currentLesson.subtitle && (
                  <p className="text-sm text-slate-600 mt-1 font-medium">
                    {currentLesson.subtitle}
                  </p>
                )}
              </div>

              {/* Objectives Callout Box */}
              {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Mục tiêu bài học cần đạt
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                    {currentLesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video Embed if available */}
              {currentLesson.videoEmbedUrl && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-red-500" />
                    Video Bài giảng Trực quan
                  </h3>
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <iframe
                      src={currentLesson.videoEmbedUrl}
                      title="Video Bài giảng"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Core Theory Content */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Nội dung trọng tâm (Tóm tắt lý thuyết)
                </h3>
                <div className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {currentLesson.theoryMarkdown || currentLesson.summary}
                </div>
              </div>

              {/* Interactive Code Playground (HTML/CSS Live preview OR Python execution simulator) */}
              {currentLesson.codeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-600" />
                      Thực hành Tương tác trực tiếp ({currentLesson.codeSnippet.lang.toUpperCase()})
                    </h3>

                    {currentLesson.codeSnippet.lang === 'python' && (
                      <button
                        onClick={handleRunPython}
                        disabled={isPythonRunning}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {isPythonRunning ? 'Đang thực thi...' : 'Chạy code Python'}
                      </button>
                    )}
                  </div>

                  {currentLesson.codeSnippet.lang === 'html' ? (
                    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                      {/* Window Header */}
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-[11px] font-mono text-slate-400 ml-2 font-medium">index.html · Live Sandbox</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE SYNC</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                        {/* Editor */}
                        <div className="flex flex-col bg-slate-950">
                          <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="text-blue-400 font-bold">SOURCE CODE</span>
                            <span>Tự do gõ CSS/HTML</span>
                          </div>
                          <textarea
                            rows={11}
                            value={liveHtmlCode}
                            onChange={(e) => setLiveHtmlCode(e.target.value)}
                            className="w-full flex-1 p-3.5 bg-transparent text-emerald-400 font-mono text-xs focus:outline-hidden resize-none leading-relaxed"
                            spellCheck={false}
                          />
                        </div>

                        {/* Live Browser Output */}
                        <div className="flex flex-col bg-slate-900/40">
                          <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="text-slate-300 font-bold flex items-center gap-1.5">
                              <Eye className="w-3 h-3 text-blue-400" />
                              WEB BROWSER VIEWPORT
                            </span>
                            <span className="text-slate-500">100% Scale</span>
                          </div>
                          <div className="p-4 flex-1 bg-white min-h-[180px] flex items-center justify-center">
                            <div
                              className="w-full"
                              dangerouslySetInnerHTML={{ __html: liveHtmlCode }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-[11px] font-mono text-amber-300 ml-2 font-bold">
                            main.py ({currentLesson.codeSnippet.lang.toUpperCase()} 3.11)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">SGK Kết nối tri thức</span>
                      </div>

                      <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed bg-slate-950/90">
                        <code>{currentLesson.codeSnippet.code}</code>
                      </pre>

                      {pythonRunResult && (
                        <div className="p-3.5 border-t border-slate-800 bg-black/80 font-mono text-xs text-slate-200">
                          <span className="text-slate-400 text-[10px] block mb-1 font-bold tracking-wider uppercase text-blue-400">
                            Console Output:
                          </span>
                          <pre className="text-blue-300 whitespace-pre-wrap font-mono text-[11px]">{pythonRunResult}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Lesson Materials & Download Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Tài liệu bài học & Tệp đính kèm ({currentLesson.materials?.length || 0})
                  </h3>
                </div>

                {currentLesson.materials && currentLesson.materials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.materials.map(mat => (
                      <div
                        key={mat.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{mat.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{mat.size} · Đăng bởi {mat.uploadedBy}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(mat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-slate-200 shadow-xs transition-colors shrink-0"
                          title="Tải xuống tài liệu"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Chưa có tài liệu đính kèm nào cho bài học này.</p>
                )}
              </div>

              {/* Integrated Discussion Forum for this lesson */}
              <DiscussionForum
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                posts={discussions}
                userRole={userRole}
                onAddPost={onAddPost}
                onAddReply={onAddReply}
                onLikePost={onLikePost}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Chưa có bài học nào được chọn</p>
              <p className="text-xs text-slate-400">
                {userRole === 'teacher'
                  ? 'Hãy chọn một bài học từ danh mục bên trái, hoặc bấm "+ Thêm bài" để tạo nội dung mới.'
                  : 'Hãy kích chọn một bài học từ danh mục bên trái để bắt đầu học tập.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: THÊM / SỬA CHỦ ĐỀ (TOPIC MODAL) */}
      {userRole === 'teacher' && showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              {editingTopicId ? 'Chỉnh sửa Chủ đề' : 'Thêm Chủ đề Mới'} (Tin học {selectedGrade})
            </h3>

            <form onSubmit={handleSaveTopicSubmit} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mã ký hiệu Chủ đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Chủ đề E, Chủ đề F, Chủ đề 1..."
                  value={topicForm.code}
                  onChange={(e) => setTopicForm({ ...topicForm, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Chủ đề (Theo SGK Kết nối tri thức) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ứng dụng tin học - Thiết kế trang web"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung khái quát của chủ đề..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  {editingTopicId ? 'Lưu thay đổi' : 'Thêm Chủ đề'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM / SỬA BÀI HỌC (LESSON MODAL) */}
      {userRole === 'teacher' && showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingLessonId ? 'Chỉnh sửa Bài học' : 'Thêm Bài học Mới'}
              </h3>
              <button
                onClick={() => setShowLessonModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLessonSubmit} className="space-y-4 py-4 text-xs overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số thứ tự bài <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lessonForm.lessonNumber}
                    onChange={(e) => setLessonForm({ ...lessonForm, lessonNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tên Bài học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bài 12: Thiết kế trang web với CSS Flexbox & Bộ chọn"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tiêu đề phụ / Trọng tâm</label>
                  <input
                    type="text"
                    placeholder="VD: Khái niệm, đặc trưng cơ bản và bài kiểm tra Turing"
                    value={lessonForm.subtitle}
                    onChange={(e) => setLessonForm({ ...lessonForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min={15}
                    value={lessonForm.durationMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tóm tắt ngắn gọn</label>
                <textarea
                  rows={2}
                  placeholder="Khái quát 1-2 câu về nội dung bài học..."
                  value={lessonForm.summary}
                  onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mục tiêu cần đạt (Mỗi dòng một mục tiêu)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mục tiêu 1&#10;Mục tiêu 2"
                  value={lessonForm.objectivesText}
                  onChange={(e) => setLessonForm({ ...lessonForm, objectivesText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung lý thuyết trọng tâm (Markdown / Text)
                </label>
                <textarea
                  rows={5}
                  placeholder="### 1. Khái niệm cốt lõi&#10;Nội dung chi tiết..."
                  value={lessonForm.theoryMarkdown}
                  onChange={(e) => setLessonForm({ ...lessonForm, theoryMarkdown: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              {/* Code Snippet Option */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Ví dụ Code thực hành (Tùy chọn)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Ngôn ngữ:</span>
                    <select
                      value={lessonForm.codeLang}
                      onChange={(e) => setLessonForm({ ...lessonForm, codeLang: e.target.value as any })}
                      className="px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    >
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Nhập mã nguồn mẫu cho học sinh thực hành tương tác..."
                  value={lessonForm.codeSnippet}
                  onChange={(e) => setLessonForm({ ...lessonForm, codeSnippet: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Video Bài giảng Embed (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={lessonForm.videoEmbedUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoEmbedUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  {editingLessonId ? 'Lưu thay đổi bài học' : 'Thêm bài học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XÁC NHẬN XÓA (TOPIC / LESSON) */}
      {userRole === 'teacher' && deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận xóa {deleteConfirm.type === 'topic' ? 'Chủ đề' : 'Bài học'}
                </h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              Bạn có chắc chắn muốn xóa <strong>"{deleteConfirm.title}"</strong>?
              {deleteConfirm.type === 'topic' && (
                <span className="block mt-1 text-red-600 font-medium">
                  Lưu ý: Tất cả các bài học và tài liệu trong chủ đề này cũng sẽ bị xóa.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={deleteConfirm.type === 'topic' ? handleDeleteTopicConfirm : handleDeleteLessonConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: UPLOAD TÀI LIỆU CHO GIÁO VIÊN */}
      {userRole === 'teacher' && showUploadModal && currentLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Upload Tài liệu / Video cho {currentLesson.title}
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loại tài liệu</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                >
                  <option value="pdf">Tài liệu PDF (Slide bài giảng, Giáo trình)</option>
                  <option value="slide">Bản trình chiếu Slide (.pptx)</option>
                  <option value="video">Liên kết Video bài giảng (YouTube, Drive)</option>
                  <option value="code">Tệp mã nguồn bài tập (.zip, .py, .html)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Slide_Chuyen_de_CSS_Flexbox_KNTT12.pdf"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đường dẫn tệp hoặc URL (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Đăng tài liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Assessment, Submission, ClassRoom, Student, Lesson } from '../types';
import { 
  calculateScoreDistribution, 
  analyzeKnowledgeGaps, 
  generatePersonalizedReviewPlan, 
  generateTeacherAIReport 
} from '../utils/aiAnalyticsEngine';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  User, 
  TrendingUp, 
  BrainCircuit, 
  ArrowRight,
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';

interface AnalyticsDashboardProps {
  assessments: Assessment[];
  submissions: Submission[];
  classes: ClassRoom[];
  students: Student[];
  allLessons: Lesson[];
  selectedStudentIdForDetail?: string | null;
  onNavigateToLesson?: (lessonId: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  assessments,
  submissions,
  classes,
  students,
  allLessons,
  selectedStudentIdForDetail,
  onNavigateToLesson,
}) => {
  // Filters
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments[1]?.id || assessments[0]?.id || ''
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    selectedStudentIdForDetail || students[0]?.id || ''
  );

  // Sync if selectedStudentIdForDetail prop updates
  React.useEffect(() => {
    if (selectedStudentIdForDetail) {
      setSelectedStudentId(selectedStudentIdForDetail);
    }
  }, [selectedStudentIdForDetail]);

  // AI Deep Analysis server state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<any>(null);

  const currentAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Filter submissions for this assessment & class
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      const matchAssessment = s.assessmentId === selectedAssessmentId;
      const matchClass = !selectedClassId || s.classId === selectedClassId;
      return matchAssessment && matchClass;
    });
  }, [submissions, selectedAssessmentId, selectedClassId]);

  // Calculations
  const scoreStats = useMemo(() => {
    return calculateScoreDistribution(filteredSubmissions);
  }, [filteredSubmissions]);

  const knowledgeGaps = useMemo(() => {
    if (!currentAssessment) return [];
    return analyzeKnowledgeGaps(currentAssessment, filteredSubmissions);
  }, [currentAssessment, filteredSubmissions]);

  const teacherReport = useMemo(() => {
    if (!currentAssessment) {
      return { summary: '', strengths: [], keyWeaknesses: [], pedagogicalRecommendations: [], suggestedLabAdjustment: '' };
    }
    return generateTeacherAIReport(currentAssessment, filteredSubmissions);
  }, [currentAssessment, filteredSubmissions]);

  // Selected student review plan
  const studentSubmission = useMemo(() => {
    return filteredSubmissions.find(s => s.studentId === selectedStudentId) ||
      submissions.find(s => s.studentId === selectedStudentId && s.assessmentId === selectedAssessmentId);
  }, [filteredSubmissions, submissions, selectedStudentId, selectedAssessmentId]);

  const personalizedPlan = useMemo(() => {
    if (!studentSubmission || !currentAssessment) return null;
    return generatePersonalizedReviewPlan(studentSubmission, currentAssessment, allLessons);
  }, [studentSubmission, currentAssessment, allLessons]);

  // Call Gemini backend deep analysis
  const handleRunGeminiDeepAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentTitle: currentAssessment?.title,
          grade: currentAssessment?.grade,
          className: currentClass?.name,
          errorBreakdown: knowledgeGaps.map(g => ({
            question: g.questionText,
            knowledgeTag: g.knowledgeTag,
            lesson: g.lessonTitle,
            errorRate: `${g.errorRate}%`,
            mostCommonWrong: g.mostCommonWrongAnswer,
          })),
          scoreStats: {
            averageScore: scoreStats.averageScore,
            passRate: scoreStats.passRate,
            totalSubmissions: filteredSubmissions.length,
          }
        })
      });

      const data = await response.json();
      if (data.analysis) {
        setGeminiAnalysis(data.analysis);
      } else if (data.recommendation) {
        setGeminiAnalysis({ summary: data.recommendation });
      }
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Pie chart data
  const pieData = scoreStats.distribution.filter(d => d.count > 0);

  return (
    <div className="space-y-6">
      {/* 1. Header with Assessment & Class Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Analytics Dashboard & Gợi ý Học tập Cá nhân hóa
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phân tích phổ điểm, thống kê tỷ lệ sai từng câu hỏi và tự động đối chiếu bài học SGK Kết nối tri thức
            </p>
          </div>

          {/* Assessment & Class Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-hidden"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedAssessmentId}
                onChange={(e) => {
                  setSelectedAssessmentId(e.target.value);
                  setGeminiAnalysis(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-800 max-w-xs truncate focus:outline-hidden"
              >
                {assessments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key KPI Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Điểm trung bình lớp</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-blue-600 font-mono">
              {scoreStats.averageScore}
            </span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Cao nhất: {scoreStats.maxScore} · Thấp nhất: {scoreStats.minScore}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Tỷ lệ Đạt (≥ 5.0)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {scoreStats.passRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Học sinh</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Đã nộp: {filteredSubmissions.length} bài
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Lỗ hổng lớn nhất</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-red-600 truncate block">
              {knowledgeGaps[0]?.knowledgeTag || 'Không có'}
            </span>
            <span className="text-[11px] text-red-500 font-semibold font-mono">
              {knowledgeGaps[0]?.errorRate}% học sinh làm sai
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Cần phụ đạo thêm</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">
              {filteredSubmissions.filter(s => s.score < 5.0).length}
            </span>
            <span className="text-xs text-slate-400">học sinh (&lt;5đ)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            Có kế hoạch ôn tập riêng
          </p>
        </div>
      </div>

      {/* 3. Phổ Điểm Lớp Học: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phổ điểm Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Phổ điểm Kiểm tra Lớp {currentClass?.name}
              </h2>
              <p className="text-[11px] text-slate-500">
                Phân bố số lượng học sinh theo từng khoảng điểm đánh giá
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Tổng số: {filteredSubmissions.length} học sinh
            </span>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreStats.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  allowDecimals={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-md">
                          <p className="font-bold">{data.range}</p>
                          <p className="text-slate-300 mt-1">
                            Số lượng: <strong className="text-emerald-400 font-mono">{data.count}</strong> học sinh ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreStats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart Phân loại học lực */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Tỷ lệ Xếp loại Học lực
            </h2>
            <p className="text-[11px] text-slate-500">Phân hạng chất lượng tiếp thu</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có dữ liệu</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-md">
                            <span className="font-bold">{data.label}: </span>
                            <span className="font-mono text-emerald-400">{data.count} HS ({data.percentage}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {scoreStats.distribution.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span>{d.label}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900">{d.count} HS ({d.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PHÂN TÍCH LỖ HỔNG KIẾN THỨC THEO TỪNG CÂU HỎI */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Phân tích Lỗ hổng Kiến thức (Tỷ lệ sai đối chiếu Bài học SGK)
            </h2>
            <p className="text-[11px] text-slate-500">
              Hệ thống tự động phát hiện các câu hỏi học sinh làm sai nhiều nhất và ánh xạ trực tiếp đến bài học tương ứng
            </p>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            Sắp xếp theo tỷ lệ sai giảm dần
          </span>
        </div>

        <div className="space-y-3">
          {knowledgeGaps.map((gap, index) => {
            const isHighError = gap.errorRate >= 50;
            return (
              <div
                key={gap.questionId}
                className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                  isHighError
                    ? 'bg-red-50/40 border-red-200'
                    : gap.errorRate >= 30
                    ? 'bg-amber-50/30 border-amber-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                      isHighError ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Câu {index + 1}
                    </span>
                    <span className="font-bold text-slate-900">
                      Chủ đề: {gap.knowledgeTag}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({gap.difficulty})
                    </span>
                  </div>

                  {/* Error Rate Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Tỷ lệ sai:</span>
                    <span className={`font-mono font-extrabold text-sm px-2.5 py-0.5 rounded ${
                      isHighError 
                        ? 'bg-red-600 text-white' 
                        : gap.errorRate >= 30 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {gap.errorRate}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({gap.wrongCount}/{gap.totalCount} HS)
                    </span>
                  </div>
                </div>

                <p className="text-slate-800 font-medium leading-snug">
                  {gap.questionText}
                </p>

                {/* Lesson Mapping & Diagnostic Advice */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-600">
                  <div className="flex items-center gap-2 text-slate-700">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Bài học trong SGK Kết nối tri thức:</span>
                      <strong className="text-blue-700 font-semibold">{gap.lessonTitle}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToLesson?.(gap.lessonId)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md border border-blue-200 transition-colors shrink-0"
                    >
                      <span>Mở bài giảng</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Diagnostic alert message */}
                <p className={`text-[11px] font-medium ${
                  isHighError ? 'text-red-700' : 'text-slate-600'
                }`}>
                  💡 <strong>Chẩn đoán sư phạm:</strong> {gap.diagnosticAdvice}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. GỢI Ý ÔN TẬP CÁ NHÂN HÓA DÀNH CHO TỪNG HỌC SINH */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Gợi ý Ôn tập Cá nhân hóa (Personalized Remedial Learning Plan)
            </h2>
            <p className="text-[11px] text-slate-500">
              Dựa trên câu trả lời sai của từng học sinh, hệ thống tự động sinh danh sách bài học và tài liệu cần ôn tập lại
            </p>
          </div>

          {/* Student Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Chọn học sinh:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
            >
              {filteredSubmissions.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentName} ({s.score} điểm)
                </option>
              ))}
            </select>
          </div>
        </div>

        {personalizedPlan ? (
          <div className="space-y-4">
            {/* Student Header Card */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-indigo-950">
                    {personalizedPlan.studentName}
                  </h3>
                  <span className="text-[11px] font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    {personalizedPlan.classRank}
                  </span>
                </div>
                <p className="text-xs text-indigo-800 mt-1">
                  {personalizedPlan.generalEncouragement}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold text-indigo-700 font-mono">
                  {personalizedPlan.score}
                </span>
                <span className="text-xs text-slate-500 block">/ 10.0 điểm</span>
              </div>
            </div>

            {/* List of Weak Topics to Review */}
            {personalizedPlan.weakTopics.length === 0 ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm">Không phát hiện lỗ hổng kiến thức!</p>
                <p className="mt-1">Học sinh đã trả lời đúng 100% các câu hỏi trong bài kiểm tra này.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Danh sách kiến thức và tài liệu em cần ôn tập lại ngay:
                </h4>

                {personalizedPlan.weakTopics.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-amber-800 font-bold text-sm">
                          {idx + 1}. Chủ đề cần bổ sung: "{item.knowledgeTag}"
                        </span>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          Thuộc: <strong className="text-blue-700">{item.lessonTitle}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => onNavigateToLesson?.(item.lessonId)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Mở bài học để đọc lại</span>
                      </button>
                    </div>

                    {/* Question Mistake Details */}
                    <div className="p-3 bg-white rounded-lg border border-amber-200/80 space-y-1.5">
                      <p className="text-slate-800 font-medium">{item.questionText}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-red-50 text-red-700 border border-red-100">
                          <span className="font-semibold block">❌ Đáp án em đã chọn nhầm:</span>
                          <span>{item.wrongChoiceText}</span>
                        </div>
                        <div className="p-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="font-semibold block">✅ Đáp án chính xác:</span>
                          <span>{item.correctChoiceText}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                        <strong>Giải thích:</strong> {item.explanation}
                      </p>
                    </div>

                    {/* Recommended Actions */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 text-[11px] block">
                        Các bước hành động đề xuất:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                        {item.recommendedActions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Hãy chọn một học sinh trong danh sách trên để xem gợi ý ôn tập cá nhân hóa.
          </div>
        )}
      </div>

      {/* 6. BÁO CÁO TỔNG QUAN AI DÀNH CHO GIÁO VIÊN */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Báo cáo Tổng quan Sư phạm AI dành cho Giáo viên
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Đánh giá tình hình tiếp thu của lớp và đề xuất điều chỉnh bài giảng trong tiết học tiếp theo
            </p>
          </div>

          <button
            onClick={handleRunGeminiDeepAnalysis}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Gemini AI đang phân tích...' : 'AI Phân tích Chuyên sâu'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-200 leading-relaxed space-y-3">
          <p className="bg-white/5 p-3 rounded-lg border border-white/10">
            {teacherReport.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Điểm mạnh của lớp
              </span>
              <ul className="space-y-1 text-slate-300">
                {teacherReport.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-1.5">
              <span className="font-bold text-red-400 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                Lỗ hổng trọng tâm cần bù đắp
              </span>
              <ul className="space-y-1 text-slate-300">
                {teacherReport.keyWeaknesses.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/60 rounded-lg border border-indigo-500/30 space-y-1.5">
            <span className="font-bold text-indigo-300 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Đề xuất điều chỉnh bài giảng tiết tiếp theo:
            </span>
            <ul className="space-y-1 text-slate-300">
              {teacherReport.pedagogicalRecommendations.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
            <p className="text-indigo-200 pt-2 border-t border-indigo-500/20 text-[11px]">
              <strong>Kế hoạch giờ thực hành:</strong> {teacherReport.suggestedLabAdjustment}
            </p>
          </div>

          {/* Gemini AI Live Analysis Output if generated */}
          {geminiAnalysis && (
            <div className="p-4 bg-indigo-900/40 border border-indigo-400/50 rounded-xl space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded">
                  Gemini 3.8 Flash Engine
                </span>
                <span className="text-xs font-bold text-white">Phân tích Sư phạm Bổ sung:</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{geminiAnalysis.summary}</p>
              {geminiAnalysis.rootCause && (
                <p className="text-amber-300 text-[11px]">
                  <strong>Bẫy tư duy học sinh gặp phải:</strong> {geminiAnalysis.rootCause}
                </p>
              )}
              {geminiAnalysis.lessonAdjustment && (
                <p className="text-emerald-300 text-[11px]">
                  <strong>Đề xuất điều chỉnh giáo án:</strong> {geminiAnalysis.lessonAdjustment}
                </p>
              )}
              {geminiAnalysis.labExerciseIdea && (
                <p className="text-blue-300 text-[11px]">
                  <strong>Ý tưởng bài thực hành khắc phục:</strong> {geminiAnalysis.labExerciseIdea}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

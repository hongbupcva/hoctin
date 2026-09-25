import { Assessment, Submission, KnowledgeGapReport, PersonalizedReviewPlan, TeacherAIReport, Lesson } from '../types';

/**
 * Tự động chấm điểm bài kiểm tra ngay khi học sinh nộp
 */
export function autoGradeAssessment(
  assessment: Assessment,
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>,
  durationSeconds: number,
  studentId: string,
  studentName: string,
  classId: string,
  className: string
): Submission {
  let correctCount = 0;
  const totalQuestions = assessment.questions.length;

  const itemDetails = assessment.questions.map(q => {
    const selected = selectedAnswers[q.id];
    const isCorrect = selected === q.correctOptionId;
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      selectedOptionId: selected || ('A' as const),
      isCorrect,
      timeSpentSeconds: Math.round(durationSeconds / Math.max(1, totalQuestions))
    };
  });

  const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;
  const score = Math.round(rawScore * 10) / 10; // Làm tròn 1 chữ số thập phân

  return {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    assessmentId: assessment.id,
    assessmentTitle: assessment.title,
    studentId,
    studentName,
    classId,
    className,
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    score,
    maxScore: 10,
    correctCount,
    totalQuestions,
    answers: itemDetails,
    durationSeconds,
    feedbackNotes: score >= 8.0 
      ? 'Xuất sắc! Nắm rất vững kiến thức lý thuyết và thực hành.' 
      : score >= 6.5 
      ? 'Khá tốt! Cần chú ý kỹ một số câu hỏi vận dụng hoặc phân biệt thuật ngữ.' 
      : 'Cần ôn tập lại các bài học liên quan theo danh sách gợi ý của AI.'
  };
}

/**
 * Tính toán phổ điểm của lớp
 */
export function calculateScoreDistribution(submissions: Submission[]) {
  const distribution = [
    { range: '< 5.0 (Cần cố gắng)', count: 0, percentage: 0, fill: '#ef4444', label: 'Chưa đạt' },
    { range: '5.0 - 6.4 (Trung bình)', count: 0, percentage: 0, fill: '#f59e0b', label: 'Trung bình' },
    { range: '6.5 - 7.9 (Khá)', count: 0, percentage: 0, fill: '#3b82f6', label: 'Khá' },
    { range: '8.0 - 10.0 (Giỏi/Xuất sắc)', count: 0, percentage: 0, fill: '#10b981', label: 'Giỏi' }
  ];

  if (submissions.length === 0) return { distribution, averageScore: 0, maxScore: 0, minScore: 0, passRate: 0 };

  let totalScore = 0;
  let max = -Infinity;
  let min = Infinity;
  let passCount = 0;

  submissions.forEach(sub => {
    totalScore += sub.score;
    if (sub.score > max) max = sub.score;
    if (sub.score < min) min = sub.score;
    if (sub.score >= 5.0) passCount++;

    if (sub.score < 5.0) {
      distribution[0].count++;
    } else if (sub.score < 6.5) {
      distribution[1].count++;
    } else if (sub.score < 8.0) {
      distribution[2].count++;
    } else {
      distribution[3].count++;
    }
  });

  const total = submissions.length;
  distribution.forEach(d => {
    d.percentage = Math.round((d.count / total) * 100);
  });

  return {
    distribution,
    averageScore: Math.round((totalScore / total) * 10) / 10,
    maxScore: max === -Infinity ? 0 : max,
    minScore: min === Infinity ? 0 : min,
    passRate: Math.round((passCount / total) * 100)
  };
}

/**
 * Phân tích lỗ hổng kiến thức theo câu hỏi (Error Rate & Knowledge Gap)
 * Đối chiếu câu hỏi bị sai với bài học tương ứng trong chương trình Kết nối tri thức
 */
export function analyzeKnowledgeGaps(assessment: Assessment, submissions: Submission[]): KnowledgeGapReport[] {
  if (submissions.length === 0) return [];

  const totalSubmissions = submissions.length;

  return assessment.questions.map(q => {
    let wrongCount = 0;
    const wrongOptionsCount: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

    submissions.forEach(sub => {
      const studentAns = sub.answers.find(a => a.questionId === q.id);
      if (!studentAns || !studentAns.isCorrect) {
        wrongCount++;
        if (studentAns?.selectedOptionId) {
          wrongOptionsCount[studentAns.selectedOptionId] = (wrongOptionsCount[studentAns.selectedOptionId] || 0) + 1;
        }
      }
    });

    const errorRate = Math.round((wrongCount / totalSubmissions) * 100);

    // Tìm đáp án sai phổ biến nhất
    let mostCommonWrong = 'B';
    let maxWrong = -1;
    Object.entries(wrongOptionsCount).forEach(([opt, count]) => {
      if (opt !== q.correctOptionId && count > maxWrong) {
        maxWrong = count;
        mostCommonWrong = opt;
      }
    });

    let diagnosticAdvice = `Học sinh nắm khá chắc chủ đề "${q.knowledgeTag}".`;
    if (errorRate >= 60) {
      diagnosticAdvice = `BÁO ĐỘNG ĐỎ (${errorRate}% học sinh làm sai): Có sự nhầm lẫn nghiêm trọng về "${q.knowledgeTag}". Cần giải thích lại trực quan trên bảng hoặc giao thêm bài thực hành.`;
    } else if (errorRate >= 40) {
      diagnosticAdvice = `CẢNH BÁO (${errorRate}% sai): Đa số học sinh chọn nhầm đáp án ${mostCommonWrong}. Cần nhắc lại sự khác biệt cốt lõi trong tiết tiếp theo.`;
    }

    return {
      questionId: q.id,
      questionText: q.text,
      lessonId: q.lessonId,
      lessonTitle: q.lessonTitle,
      topicTitle: q.topicTitle,
      knowledgeTag: q.knowledgeTag,
      difficulty: q.difficulty,
      wrongCount,
      totalCount: totalSubmissions,
      errorRate,
      mostCommonWrongAnswer: mostCommonWrong,
      diagnosticAdvice
    };
  }).sort((a, b) => b.errorRate - a.errorRate);
}

/**
 * Thuật toán sinh gợi ý học tập cá nhân hóa cho từng học sinh
 * Dựa trên ID các câu hỏi làm sai, tự động truy vết bài học và kiến thức trọng tâm
 */
export function generatePersonalizedReviewPlan(
  studentSubmission: Submission,
  assessment: Assessment,
  allLessons: Lesson[]
): PersonalizedReviewPlan {
  const weakTopics: PersonalizedReviewPlan['weakTopics'] = [];

  studentSubmission.answers.forEach(ans => {
    if (!ans.isCorrect) {
      const question = assessment.questions.find(q => q.id === ans.questionId);
      if (question) {
        const lesson = allLessons.find(l => l.id === question.lessonId);
        const wrongChoice = question.options.find(o => o.id === ans.selectedOptionId)?.text || 'Chưa chọn';
        const correctChoice = question.options.find(o => o.id === question.correctOptionId)?.text || '';

        const actions = [
          `Đọc lại mục lý thuyết "${question.knowledgeTag}" trong ${question.lessonTitle}`,
          `Thực hành lại ví dụ code mẫu và sơ đồ minh họa trong SGK Kết nối tri thức`,
          `Làm lại 3 câu trắc nghiệm tương tự trong ngân hàng đề ôn tập`
        ];

        weakTopics.push({
          knowledgeTag: question.knowledgeTag,
          lessonId: question.lessonId,
          lessonTitle: question.lessonTitle,
          questionText: question.text,
          wrongChoiceText: wrongChoice,
          correctChoiceText: correctChoice,
          explanation: question.explanation,
          recommendedActions: actions,
          suggestedMaterialTitle: lesson?.materials[0]?.title || 'Tài liệu hướng dẫn chuyên đề'
        });
      }
    }
  });

  let rank = 'Top 10% của lớp';
  if (studentSubmission.score < 5.0) rank = 'Cần phụ đạo gấp';
  else if (studentSubmission.score < 6.5) rank = 'Nhóm trung bình';
  else if (studentSubmission.score < 8.5) rank = 'Nhóm khá giỏi';

  const encouragement = weakTopics.length === 0
    ? 'Tuyệt vời! Em đã hoàn thành xuất sắc bài kiểm tra mà không mắc bất kỳ sai sót nào. Hãy thử thách bản thân với các bài toán lập trình nâng cao hơn!'
    : `Em đã hoàn thành bài kiểm tra với điểm số ${studentSubmission.score}/10. Hiện tại em còn hổng ${weakTopics.length} điểm kiến thức trọng tâm. Hãy dành khoảng 20 phút xem lại các bài học được gợi ý dưới đây để chuẩn bị tốt cho bài thi học kỳ!`;

  return {
    studentId: studentSubmission.studentId,
    studentName: studentSubmission.studentName,
    score: studentSubmission.score,
    classRank: rank,
    weakTopics,
    generalEncouragement: encouragement
  };
}

/**
 * Thuật toán sinh nhận xét & Đề xuất sư phạm tổng quan cho Giáo viên
 */
export function generateTeacherAIReport(
  assessment: Assessment,
  submissions: Submission[]
): TeacherAIReport {
  if (submissions.length === 0) {
    return {
      summary: 'Chưa có lượt nộp bài nào để phân tích.',
      strengths: [],
      keyWeaknesses: [],
      pedagogicalRecommendations: [],
      suggestedLabAdjustment: 'Chờ học sinh nộp bài để xem báo cáo tự động.'
    };
  }

  const { averageScore, passRate } = calculateScoreDistribution(submissions);
  const gaps = analyzeKnowledgeGaps(assessment, submissions);
  const highestGap = gaps[0];

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  gaps.forEach(g => {
    if (g.errorRate <= 25) {
      strengths.push(`Học sinh nắm vững "${g.knowledgeTag}" (${100 - g.errorRate}% làm đúng).`);
    } else if (g.errorRate >= 50) {
      weaknesses.push(`Tỷ lệ sai cao đột biến tại "${g.knowledgeTag}" (${g.errorRate}% sai) thuộc ${g.lessonTitle}.`);
    }
  });

  if (highestGap && highestGap.errorRate >= 50) {
    recommendations.push(
      `Dành 15 phút đầu tiết tới để ôn tập lại chuyên đề "${highestGap.knowledgeTag}", đặc biệt lưu ý bẫy học sinh hay chọn nhầm đáp án ${highestGap.mostCommonWrongAnswer}.`
    );
  }
  recommendations.push(
    `Giao phiếu bài tập thực hành củng cố cho nhóm học sinh có điểm dưới 6.5 (hiện có ${submissions.filter(s => s.score < 6.5).length} học sinh).`
  );
  recommendations.push(
    `Tận dụng Không gian Thảo luận (Discussion Forum) để khuyến khích học sinh khá giỏi hỗ trợ giải đáp thắc mắc cho các bạn chưa đạt.`
  );

  const summary = `Lớp có điểm trung bình ${averageScore}/10 với tỷ lệ đạt ${passRate}%. Tình hình tiếp thu chung ở mức ${averageScore >= 7.5 ? 'tốt' : averageScore >= 6.0 ? 'khá' : 'cần cải thiện'}. Trọng tâm kiến thức cần bù đắp ngay là: "${highestGap?.knowledgeTag || 'Kiến thức cốt lõi'}" do có ${highestGap?.errorRate || 0}% học sinh chưa phân biệt chính xác.`;

  return {
    summary,
    strengths: strengths.slice(0, 3),
    keyWeaknesses: weaknesses.slice(0, 3),
    pedagogicalRecommendations: recommendations,
    suggestedLabAdjustment: `Trong buổi thực hành tiếp theo, giáo viên nên trình chiếu ví dụ tương tác trực tiếp của ${highestGap?.lessonTitle || 'Bài học'}, cho học sinh thực hiện thử nghiệm trên máy tính để khắc sâu nguyên lý hoạt động.`
  };
}

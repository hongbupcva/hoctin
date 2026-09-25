export const DATABASE_SCHEMA_SQL = `-- ============================================================================
-- EduTin THPT - Kiến trúc Cơ sở Dữ liệu Quan hệ (PostgreSQL / Relational SQL)
-- Thiết kế tối ưu cho E-Learning, Auto-grading & AI Learning Analytics
-- ============================================================================

-- 1. Bảng Khối lớp & Lớp học
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,          -- VD: '12A1', '12A2', '11A1'
    grade VARCHAR(2) NOT NULL CHECK (grade IN ('10', '11', '12')),
    academic_year VARCHAR(10) NOT NULL,        -- VD: '2025-2026'
    homeroom_teacher VARCHAR(100),
    room_number VARCHAR(20),
    student_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Hồ sơ Học sinh
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    stt INT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    birth_date DATE NOT NULL,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ')),
    email VARCHAR(120) UNIQUE,
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_students_class_id ON students(class_id);

-- 3. Bảng Chủ đề học tập (Theo SGK Kết nối tri thức với cuộc sống)
CREATE TABLE topics (
    id VARCHAR(36) PRIMARY KEY,
    grade VARCHAR(2) NOT NULL CHECK (grade IN ('10', '11', '12')),
    code VARCHAR(30) NOT NULL,                 -- VD: 'Chủ đề E', 'Chủ đề F'
    title VARCHAR(200) NOT NULL,               -- VD: 'Ứng dụng tin học - Thiết kế web'
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Bài học chi tiết
CREATE TABLE lessons (
    id VARCHAR(36) PRIMARY KEY,
    topic_id VARCHAR(36) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    grade VARCHAR(2) NOT NULL,
    lesson_number INT NOT NULL,                -- VD: Bài 1, Bài 12
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    duration_minutes INT DEFAULT 45,
    summary TEXT,
    objectives JSONB,                          -- Danh sách mục tiêu cần đạt
    key_points JSONB,                          -- Các điểm kiến thức cốt lõi
    theory_markdown TEXT,                      -- Nội dung lý thuyết định dạng phong phú
    code_snippet JSONB,                        -- Ví dụ code (HTML/CSS/Python)
    video_embed_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id);

-- 5. Bảng Tài liệu & Video đính kèm
CREATE TABLE lesson_materials (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('pdf', 'slide', 'code', 'video', 'doc')),
    size VARCHAR(20),
    file_url TEXT NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng Đề kiểm tra & Đánh giá (Assessments)
CREATE TABLE assessments (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    grade VARCHAR(2) NOT NULL,
    topic_id VARCHAR(36) REFERENCES topics(id),
    lesson_id VARCHAR(36) REFERENCES lessons(id),
    duration_minutes INT NOT NULL DEFAULT 15,
    total_points NUMERIC(4,2) DEFAULT 10.00,
    pass_score NUMERIC(4,2) DEFAULT 5.00,
    is_published BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Ngân hàng Câu hỏi (Có gắn thẻ kiến thức để AI phân tích)
CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY,
    assessment_id VARCHAR(36) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    lesson_id VARCHAR(36) NOT NULL REFERENCES lessons(id),
    text TEXT NOT NULL,
    code_block JSONB,                          -- Code mẫu kèm theo câu hỏi (nếu có)
    options JSONB NOT NULL,                    -- Array: [{"id": "A", "text": "..."}, ...]
    correct_option_id VARCHAR(2) NOT NULL,     -- 'A', 'B', 'C', hoặc 'D'
    explanation TEXT,                          -- Lời giải chi tiết
    difficulty VARCHAR(30) CHECK (difficulty IN ('Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao')),
    knowledge_tag VARCHAR(100) NOT NULL,       -- Tag kiến thức (VD: 'CSS Pseudo-classes', 'Flexbox Justify-Content')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_questions_lesson ON questions(lesson_id);
CREATE INDEX idx_questions_tag ON questions(knowledge_tag);

-- 8. Bảng Lượt Nộp bài (Submissions)
CREATE TABLE submissions (
    id VARCHAR(36) PRIMARY KEY,
    assessment_id VARCHAR(36) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score NUMERIC(4,2) NOT NULL,               -- Điểm thực tế (thang 10)
    max_score NUMERIC(4,2) DEFAULT 10.00,
    correct_count INT NOT NULL,
    total_questions INT NOT NULL,
    duration_seconds INT NOT NULL,
    feedback_notes TEXT
);
CREATE INDEX idx_submissions_assessment_class ON submissions(assessment_id, class_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- 9. BẢNG ĐẶC BIỆT CHO AI ANALYTICS: Lịch sử thao tác & Chi tiết làm bài
-- Lưu vết từng câu hỏi, đáp án chọn, thời gian suy nghĩ, lần đổi đáp án để AI phát hiện bẫy tư duy
CREATE TABLE submission_item_details (
    id VARCHAR(36) PRIMARY KEY,
    submission_id VARCHAR(36) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    question_id VARCHAR(36) NOT NULL REFERENCES questions(id),
    lesson_id VARCHAR(36) NOT NULL REFERENCES lessons(id),
    knowledge_tag VARCHAR(100) NOT NULL,
    selected_option_id VARCHAR(2) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    answer_changed_count INT DEFAULT 0,        -- Số lần học sinh đổi đáp án trước khi nộp
    telemetry_logs JSONB                       -- Dữ liệu hành vi chi tiết hỗ trợ AI Deep Analytics
);
CREATE INDEX idx_item_details_question ON submission_item_details(question_id);
CREATE INDEX idx_item_details_tag ON submission_item_details(knowledge_tag);
CREATE INDEX idx_item_details_student_correct ON submission_item_details(student_id, is_correct);

-- 10. Bảng Thảo luận & Hỏi đáp theo bài học (Discussion Threads)
CREATE TABLE discussion_posts (
    id VARCHAR(36) PRIMARY KEY,
    lesson_id VARCHAR(36) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    author_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(120) NOT NULL,
    author_role VARCHAR(20) CHECK (author_role IN ('Giáo viên', 'Học sinh')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    code_snippet JSONB,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_replies (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
    author_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(120) NOT NULL,
    author_role VARCHAR(20) CHECK (author_role IN ('Giáo viên', 'Học sinh')),
    content TEXT NOT NULL,
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_discussion_lesson ON discussion_posts(lesson_id);
CREATE INDEX idx_discussion_replies_post ON discussion_replies(post_id);
`;

export const JSON_SCHEMA_SAMPLE = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "EduTinAI_LearningRecordStore",
  description: "Chuẩn cấu trúc lưu trữ và đối soát dữ liệu bài làm phục vụ AI Learning Analytics",
  type: "object",
  required: ["submissionId", "studentId", "assessmentId", "score", "itemDetails"],
  properties: {
    submissionId: { type: "string", format: "uuid" },
    studentId: { type: "string" },
    assessmentId: { type: "string" },
    classId: { type: "string" },
    score: { type: "number", minimum: 0, maximum: 10 },
    submittedAt: { type: "string", format: "date-time" },
    itemDetails: {
      type: "array",
      items: {
        type: "object",
        required: ["questionId", "lessonId", "knowledgeTag", "selectedOptionId", "isCorrect"],
        properties: {
          questionId: { type: "string" },
          lessonId: { type: "string" },
          knowledgeTag: { type: "string" },
          selectedOptionId: { type: "string", enum: ["A", "B", "C", "D"] },
          isCorrect: { type: "boolean" },
          timeSpentSeconds: { type: "integer", minimum: 0 },
          cognitiveGapCategory: {
            type: "string",
            enum: ["Khái niệm chưa vững", "Bẫy cú pháp", "Nhầm lẫn thuật ngữ", "Đọc thiếu đề"]
          }
        }
      }
    }
  }
};

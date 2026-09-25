import React, { useState } from 'react';
import { DATABASE_SCHEMA_SQL, JSON_SCHEMA_SAMPLE } from '../data/schemaDocs';
import { Database, Copy, Check, Code2, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'json'>('erd');
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(DATABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaTables = [
    {
      name: 'classes',
      label: 'Lớp học & Khối',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã định danh lớp' },
        { name: 'name', type: 'VARCHAR(20)', key: 'UK', desc: 'Tên lớp (12A1, 12A2...)' },
        { name: 'grade', type: 'VARCHAR(2)', key: '', desc: 'Khối (10, 11, 12)' },
        { name: 'academic_year', type: 'VARCHAR(10)', key: '', desc: 'Năm học (2025-2026)' },
        { name: 'homeroom_teacher', type: 'VARCHAR(100)', key: '', desc: 'Giáo viên chủ nhiệm' },
        { name: 'student_count', type: 'INT', key: '', desc: 'Sĩ số học sinh' },
      ]
    },
    {
      name: 'students',
      label: 'Hồ sơ Học sinh',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã học sinh' },
        { name: 'stt', type: 'INT', key: '', desc: 'Số thứ tự trong lớp' },
        { name: 'full_name', type: 'VARCHAR(120)', key: '', desc: 'Họ và tên' },
        { name: 'birth_date', type: 'DATE', key: '', desc: 'Ngày sinh' },
        { name: 'class_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> classes(id)' },
        { name: 'gender', type: 'VARCHAR(10)', key: '', desc: 'Giới tính (Nam/Nữ)' },
        { name: 'email', type: 'VARCHAR(120)', key: 'UK', desc: 'Email trường cấp' },
      ]
    },
    {
      name: 'topics',
      label: 'Chủ đề SGK Kết nối tri thức',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã chủ đề' },
        { name: 'grade', type: 'VARCHAR(2)', key: '', desc: 'Khối lớp (10, 11, 12)' },
        { name: 'code', type: 'VARCHAR(30)', key: '', desc: 'Mã ký hiệu (Chủ đề E, F...)' },
        { name: 'title', type: 'VARCHAR(200)', key: '', desc: 'Tên chuyên đề SGK' },
      ]
    },
    {
      name: 'lessons',
      label: 'Bài học chi tiết',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã bài học' },
        { name: 'topic_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> topics(id)' },
        { name: 'lesson_number', type: 'INT', key: '', desc: 'Bài số (1, 12, 16...)' },
        { name: 'title', type: 'VARCHAR(255)', key: '', desc: 'Tên bài học' },
        { name: 'objectives', type: 'JSONB', key: '', desc: 'Mục tiêu cần đạt' },
        { name: 'theory_markdown', type: 'TEXT', key: '', desc: 'Nội dung lý thuyết trọng tâm' },
        { name: 'code_snippet', type: 'JSONB', key: '', desc: 'Mã nguồn mẫu thực hành' },
      ]
    },
    {
      name: 'assessments',
      label: 'Đề Kiểm tra & Đánh giá',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã đề thi' },
        { name: 'title', type: 'VARCHAR(255)', key: '', desc: 'Tên đề kiểm tra' },
        { name: 'grade', type: 'VARCHAR(2)', key: '', desc: 'Khối lớp' },
        { name: 'topic_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> topics(id)' },
        { name: 'duration_minutes', type: 'INT', key: '', desc: 'Thời lượng làm bài' },
        { name: 'total_points', type: 'NUMERIC(4,2)', key: '', desc: 'Thang điểm (10.00)' },
      ]
    },
    {
      name: 'questions',
      label: 'Ngân hàng Câu hỏi & Gắn thẻ Kiến thức',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã câu hỏi' },
        { name: 'assessment_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> assessments' },
        { name: 'lesson_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> lessons(id)' },
        { name: 'text', type: 'TEXT', key: '', desc: 'Nội dung câu hỏi trắc nghiệm' },
        { name: 'options', type: 'JSONB', key: '', desc: 'Các lựa chọn [A, B, C, D]' },
        { name: 'correct_option_id', type: 'VARCHAR(2)', key: '', desc: 'Đáp án chính xác' },
        { name: 'knowledge_tag', type: 'VARCHAR(100)', key: 'IDX', desc: 'Thẻ kiến thức cho AI phân tích' },
        { name: 'explanation', type: 'TEXT', key: '', desc: 'Lời giải chi tiết' },
      ]
    },
    {
      name: 'submissions',
      label: 'Lượt nộp bài kiểm tra',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Mã lượt nộp bài' },
        { name: 'student_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> students(id)' },
        { name: 'assessment_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> assessments' },
        { name: 'score', type: 'NUMERIC(4,2)', key: '', desc: 'Điểm tự động chấm' },
        { name: 'correct_count', type: 'INT', key: '', desc: 'Số câu đúng' },
        { name: 'duration_seconds', type: 'INT', key: '', desc: 'Thời gian hoàn thành' },
        { name: 'submitted_at', type: 'TIMESTAMP', key: '', desc: 'Thời điểm nộp' },
      ]
    },
    {
      name: 'submission_item_details',
      label: '⭐ Bảng Telemetry cho AI Analytics',
      columns: [
        { name: 'id', type: 'VARCHAR(36)', key: 'PK', desc: 'Khóa chính bản ghi chi tiết' },
        { name: 'submission_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> submissions' },
        { name: 'question_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> questions' },
        { name: 'lesson_id', type: 'VARCHAR(36)', key: 'FK', desc: 'Khóa ngoại -> lessons' },
        { name: 'knowledge_tag', type: 'VARCHAR(100)', key: 'IDX', desc: 'Tag kiến thức liên quan' },
        { name: 'selected_option_id', type: 'VARCHAR(2)', key: '', desc: 'Đáp án học sinh đã chọn' },
        { name: 'is_correct', type: 'BOOLEAN', key: 'IDX', desc: 'Đúng hay sai' },
        { name: 'time_spent_seconds', type: 'INT', key: '', desc: 'Thời gian suy nghĩ câu này' },
        { name: 'answer_changed_count', type: 'INT', key: '', desc: 'Số lần phân vân đổi đáp án' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
                <Database className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Kiến trúc Cơ sở Dữ liệu Hệ thống (Database Schema)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đề xuất cấu trúc bảng PostgreSQL chuẩn hóa, quan hệ khóa ngoại và trường Telemetry phục vụ AI Learning Analytics
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('erd')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'erd'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sơ đồ Thực thể (ERD)
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'sql'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mã SQL DDL Script
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'json'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON Schema AI Record
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Highlights for AI Analytics */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-2 text-indigo-950">
        <div className="flex items-center gap-2 font-bold text-indigo-900">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>Điểm nổi bật trong thiết kế CSDL phục vụ AI Analytics & Tự động gợi ý:</span>
        </div>
        <p className="leading-relaxed text-indigo-800">
          1. <strong>Bảng <code>submission_item_details</code></strong>: Lưu vết chi tiết từng câu hỏi trong mỗi lần làm bài (thời gian làm bài theo câu, đáp án chọn, đúng/sai, số lần đổi đáp án). Nhờ đó, AI có thể tính toán chính xác <em>tỷ lệ sai theo từng chủ đề kiến thức</em> và phát hiện bẫy học sinh thường nhầm lẫn.
        </p>
        <p className="leading-relaxed text-indigo-800">
          2. <strong>Liên kết ngược trực tiếp <code>questions.lesson_id -&gt; lessons.id</code></strong>: Cho phép thuật toán gợi ý học tập tức thì ánh xạ câu hỏi sai sang đúng bài giảng và tài liệu cần ôn tập lại mà không cần tìm kiếm thủ công.
        </p>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'erd' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemaTables.map((tbl, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-mono font-bold text-xs text-blue-400">{tbl.name}</h3>
                  <p className="text-[10px] text-slate-300">{tbl.label}</p>
                </div>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                  {tbl.columns.length} cols
                </span>
              </div>

              <div className="p-3 space-y-1.5 flex-1 divide-y divide-slate-100 text-[11px]">
                {tbl.columns.map((col, cIdx) => (
                  <div key={cIdx} className="pt-1.5 first:pt-0 flex items-start justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                        {col.key && (
                          <span className={`text-[9px] px-1 rounded font-bold ${
                            col.key === 'PK' ? 'bg-amber-100 text-amber-800' :
                            col.key === 'FK' ? 'bg-blue-100 text-blue-800' :
                            col.key === 'UK' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {col.key}
                          </span>
                        )}
                        <span>{col.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{col.desc}</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sql' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <span className="text-xs font-mono text-emerald-400">PostgreSQL DDL Creation Script (schema.sql)</span>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép SQL'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{DATABASE_SCHEMA_SQL}</code>
          </pre>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <span className="text-xs font-mono text-blue-400">JSON Schema for Learning Record Store (LRS)</span>
          </div>
          <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{JSON.stringify(JSON_SCHEMA_SAMPLE, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

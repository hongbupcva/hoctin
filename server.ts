import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Khởi tạo Google GenAI SDK (User-Agent header required by AI Studio guidelines)
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // API Phân tích sư phạm AI chuyên sâu bằng Gemini
  app.post('/api/ai/deep-analysis', async (req, res) => {
    try {
      const { assessmentTitle, grade, className, errorBreakdown, scoreStats } = req.body;

      if (!ai) {
        // Fallback thông minh nếu chưa có API Key
        return res.json({
          source: 'local-engine',
          recommendation: `Dựa trên kết quả bài kiểm tra "${assessmentTitle}" của lớp ${className}, học sinh có điểm trung bình là ${scoreStats?.averageScore || 7.0}/10. Lỗ hổng lớn nhất nằm ở các câu hỏi về: ${errorBreakdown?.[0]?.knowledgeTag || 'Kiến thức cốt lõi'}. Giáo viên nên tổ chức 1 tiết thực hành trực tiếp giải quyết vấn đề này.`,
        });
      }

      const prompt = `Bạn là một Chuyên gia Giáo dục Tin học THPT & Kiến trúc sư EdTech tại Việt Nam, am hiểu sâu sắc bộ sách "Kết nối tri thức với cuộc sống" (Khối 10, 11, 12).
Hãy phân tích kết quả bài kiểm tra sau và đưa ra nhận xét sư phạm ngắn gọn, súc tích, thực tế:
- Bài kiểm tra: ${assessmentTitle} (Khối ${grade})
- Lớp học: ${className}
- Điểm trung bình: ${scoreStats?.averageScore}/10 (Tỷ lệ đạt: ${scoreStats?.passRate}%)
- Chi tiết tỷ lệ sai của học sinh theo từng kiến thức:
${JSON.stringify(errorBreakdown, null, 2)}

Yêu cầu xuất ra định dạng JSON:
{
  "summary": "Nhận xét tổng quan 2-3 câu về mức độ tiếp thu của học sinh",
  "rootCause": "Nguyên nhân cốt lõi dẫn đến các câu sai nhiều nhất (bẫy tư duy, nhầm lẫn khái niệm)",
  "lessonAdjustment": "Đề xuất cụ thể cho giáo viên để điều chỉnh bài giảng trong tiết học tới",
  "labExerciseIdea": "Gợi ý 1 bài tập thực hành nhỏ (HTML/CSS hoặc Python) để khắc phục lỗ hổng"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        source: 'gemini-3.8-flash',
        analysis: parsed,
      });
    } catch (err: any) {
      console.error('Gemini Analysis Error:', err);
      res.status(500).json({
        error: 'Lỗi phân tích Gemini AI',
        details: err?.message,
      });
    }
  });

  // Tích hợp Vite dev server middleware
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduTin THPT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

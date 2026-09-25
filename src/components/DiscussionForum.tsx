import React, { useState } from 'react';
import { DiscussionPost, DiscussionReply } from '../types';
import { MessageSquare, Send, CheckCircle2, ThumbsUp, Code2, User } from 'lucide-react';

interface DiscussionForumProps {
  lessonId: string;
  lessonTitle: string;
  posts: DiscussionPost[];
  userRole: 'teacher' | 'student';
  onAddPost: (post: DiscussionPost) => void;
  onAddReply: (postId: string, reply: DiscussionReply) => void;
  onLikePost: (postId: string) => void;
}

export const DiscussionForum: React.FC<DiscussionForumProps> = ({
  lessonId,
  lessonTitle,
  posts,
  userRole,
  onAddPost,
  onAddReply,
  onLikePost,
}) => {
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);

  // New post state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [includeCode, setIncludeCode] = useState(false);
  const [codeLang, setCodeLang] = useState<'html' | 'css' | 'python'>('css');
  const [codeText, setCodeText] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  // Filter posts for this lesson
  const lessonPosts = posts.filter(p => p.lessonId === lessonId);

  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      lessonId,
      lessonTitle,
      authorName: userRole === 'teacher' ? 'ThS. Nguyễn Văn Hùng' : 'Học sinh THPT',
      authorRole: userRole === 'teacher' ? 'Giáo viên' : 'Học sinh',
      avatarBg: userRole === 'teacher' ? 'bg-emerald-600' : 'bg-blue-600',
      title: postTitle.trim(),
      content: postContent.trim(),
      codeSnippet: includeCode && codeText.trim() ? { lang: codeLang, code: codeText.trim() } : undefined,
      createdAt: 'Vừa xong',
      likes: 0,
      replies: [],
    };

    onAddPost(newPost);
    setPostTitle('');
    setPostContent('');
    setCodeText('');
    setIncludeCode(false);
    setShowNewPostForm(false);
  };

  const handleSubmitReply = (postId: string) => {
    if (!replyText.trim()) return;

    const newReply: DiscussionReply = {
      id: `rep-${Date.now()}`,
      postId,
      authorName: userRole === 'teacher' ? 'ThS. Nguyễn Văn Hùng' : 'Học sinh THPT',
      authorRole: userRole === 'teacher' ? 'Giáo viên' : 'Học sinh',
      avatarBg: userRole === 'teacher' ? 'bg-emerald-600' : 'bg-purple-600',
      content: replyText.trim(),
      createdAt: 'Vừa xong',
      isAcceptedAnswer: userRole === 'teacher',
    };

    onAddReply(postId, newReply);
    setReplyText('');
    setReplyingToPostId(null);
  };

  return (
    <div className="space-y-4 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Hỏi đáp & Thảo luận ({lessonPosts.length} câu hỏi)
          </h3>
        </div>

        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          {showNewPostForm ? 'Đóng khung hỏi' : '+ Đặt câu hỏi về bài học'}
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <form onSubmit={handleSubmitNewPost} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
          <h4 className="font-bold text-slate-800">
            Đặt câu hỏi hoặc chia sẻ đoạn code thắc mắc
          </h4>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề câu hỏi</label>
            <input
              type="text"
              required
              placeholder="VD: Em thắc mắc về cách căn giữa theo chiều dọc trong Flexbox..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea
              required
              rows={3}
              placeholder="Mô tả cụ thể lỗi gặp phải khi chạy code HTML/CSS hoặc bài tập Python..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeCode}
                onChange={(e) => setIncludeCode(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              Đính kèm đoạn mã nguồn (Code snippet)
            </label>

            {includeCode && (
              <div className="mt-2 space-y-2 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Ngôn ngữ:</span>
                  <select
                    value={codeLang}
                    onChange={(e) => setCodeLang(e.target.value as any)}
                    className="px-2 py-1 border border-slate-200 rounded text-xs"
                  >
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <textarea
                  rows={4}
                  placeholder={`/* Dán mã nguồn ${codeLang.toUpperCase()} của bạn vào đây */`}
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-md focus:outline-hidden"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Gửi câu hỏi
            </button>
          </div>
        </form>
      )}

      {/* Post List */}
      <div className="space-y-4">
        {lessonPosts.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
            Chưa có câu hỏi nào cho bài học này. Hãy là người đầu tiên đặt câu hỏi để thầy cô và các bạn cùng giải đáp!
          </div>
        ) : (
          lessonPosts.map(post => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${post.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{post.authorName}</span>
                      <span className="mx-1.5">·</span>
                      <span className="text-slate-400">{post.createdAt}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onLikePost(post.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                >
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>{post.likes}</span>
                </button>
              </div>

              {/* Question Content */}
              <p className="text-xs text-slate-700 leading-relaxed pl-11">
                {post.content}
              </p>

              {/* Code Snippet if present */}
              {post.codeSnippet && (
                <div className="ml-11 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono uppercase font-bold text-blue-400">
                      {post.codeSnippet.lang}
                    </span>
                    <span>Mã nguồn đính kèm</span>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{post.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Replies Thread */}
              {post.replies.length > 0 && (
                <div className="ml-11 pt-3 border-t border-slate-100 space-y-2.5">
                  {post.replies.map(rep => (
                    <div
                      key={rep.id}
                      className={`p-3 rounded-lg text-xs space-y-1.5 ${
                        rep.isAcceptedAnswer
                          ? 'bg-emerald-50/70 border border-emerald-200'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{rep.authorName}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            rep.authorRole === 'Giáo viên'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {rep.authorRole}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">· {rep.createdAt}</span>
                        </div>

                        {rep.isAcceptedAnswer && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Câu trả lời chuẩn
                          </span>
                        )}
                      </div>

                      <p className="text-slate-800 leading-relaxed">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button & Inline Form */}
              <div className="ml-11 pt-1">
                {replyingToPostId === post.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      placeholder={`Trả lời câu hỏi với tư cách là ${userRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingToPostId(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitReply(post.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingToPostId(post.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    + Viết câu trả lời / trao đổi
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

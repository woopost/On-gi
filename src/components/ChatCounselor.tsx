import React, { useState, useRef, useEffect } from 'react';
import { PERSONAS, QUICK_PROMPTS } from '../data/personas';
import { PersonaId, ChatMessage, SchoolLevel } from '../types';
import {
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Download,
  AlertCircle,
  HelpCircle,
  School,
  Sparkles,
} from 'lucide-react';

export const ChatCounselor: React.FC = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaId>('senior_teacher');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('초등학교');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activePersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  // Conversation history state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: activePersona.greeting,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        personaId: activePersona.id,
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle switching persona
  const handleSelectPersona = (id: PersonaId) => {
    if (id === selectedPersonaId) return;
    const newPersona = PERSONAS.find((p) => p.id === id);
    if (!newPersona) return;

    setSelectedPersonaId(id);
    // Add a transition greeting from the new persona
    const greetingMsg: ChatMessage = {
      id: 'greeting-' + Date.now(),
      role: 'assistant',
      content: `[${newPersona.name} 상담사로 전환되었습니다]\n${newPersona.greeting}`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      personaId: id,
    };
    setMessages((prev) => [...prev, greetingMsg]);
  };

  // Submit message to backend Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation payload for multi-turn history
      // Map to server format
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          persona: selectedPersonaId,
          schoolLevel,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || '상담 서버 응답에 실패했습니다.');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        personaId: selectedPersonaId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || '상담 연결이 원활하지 않습니다. 잠시 후 다시 이야기해주세요.'
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Text-To-Speech with browser API
  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('사용하시는 브라우저에서는 음성 읽어주기 기능을 지원하지 않습니다.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.92; // warm, relaxed pacing
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Bookmark message
  const handleToggleBookmark = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m))
    );
  };

  // Clear chat
  const handleResetChat = () => {
    if (confirm('현재 대화 내용을 비우고 새로운 마음으로 다시 시작할까요?')) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: activePersona.greeting,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          personaId: activePersona.id,
        },
      ]);
    }
  };

  // Export transcript
  const handleExportChat = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'user' ? '선생님' : activePersona.name}:\n${m.content}\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([`[교사 마음 쉼터 (온기) 상담 기록]\n일시: ${new Date().toLocaleDateString('ko-KR')}\n\n` + textContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `교사_마음쉼터_상담기록_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[920px] bg-stone-50/60 rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Top Controller Bar */}
      <div className="bg-white/80 backdrop-blur-xs border-b border-stone-200/80 p-3.5 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Persona selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 shrink-0">상담사 선택:</span>
            {PERSONAS.map((persona) => {
              const isSelected = selectedPersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? `${persona.bgColor} ring-2 ring-amber-400 font-semibold shadow-xs`
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  <span className="text-base">{persona.avatar}</span>
                  <span>{persona.name}</span>
                  <span className="text-[10px] opacity-75 hidden md:inline">({persona.role})</span>
                </button>
              );
            })}
          </div>

          {/* School Level selector & Actions */}
          <div className="flex items-center gap-2 self-end lg:self-auto text-xs">
            <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl px-2.5 py-1 text-stone-700">
              <School className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value as SchoolLevel)}
                className="bg-transparent border-none text-xs font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="초등학교">초등학교</option>
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="유치원">유치원</option>
                <option value="특수학교">특수학교</option>
                <option value="비교과(보건/상담/영양/사서)">비교과 (보건/상담/영양/사서)</option>
              </select>
            </div>

            <button
              onClick={handleExportChat}
              title="상담 내용 텍스트로 보관하기"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-600 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">기록 저장</span>
            </button>

            <button
              onClick={handleResetChat}
              title="대화 초기화"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 hover:text-rose-700 text-stone-600 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 대화</span>
            </button>
          </div>
        </div>

        {/* Current persona detail mini card */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">{activePersona.badge}</span>
            <span>•</span>
            <span className="truncate max-w-xl">{activePersona.description}</span>
          </div>
          <span className="hidden sm:inline text-amber-700 font-medium">안심 비밀 보장 AI 상담</span>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const msgPersona = PERSONAS.find((p) => p.id === message.personaId) || activePersona;

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-4xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Sender Info */}
              <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-stone-500">
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm shadow-2xs">
                    {msgPersona.avatar}
                  </div>
                )}
                <span className="font-medium text-stone-700">
                  {isUser ? '선생님' : msgPersona.name}
                </span>
                <span className="text-[11px] text-stone-400">{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative group max-w-2xl sm:max-w-3xl rounded-3xl p-4 sm:p-5 shadow-xs transition-all ${
                  isUser
                    ? 'bg-amber-600 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
                }`}
              >
                {/* Text Content */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                  {message.content}
                </div>

                {/* Assistant message action controls */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      마음 치유 상담
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Text to Speech */}
                      <button
                        onClick={() => handleToggleSpeak(message.id, message.content)}
                        title={speakingId === message.id ? '음성 멈추기' : '따뜻한 목소리로 듣기'}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          speakingId === message.id
                            ? 'bg-amber-100 text-amber-700 font-medium'
                            : 'hover:bg-stone-100 text-stone-500'
                        }`}
                      >
                        {speakingId === message.id ? (
                          <span className="flex items-center gap-1 text-[11px]">
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                            듣는 중...
                          </span>
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        title="메시지 복사"
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition cursor-pointer"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleBookmark(message.id)}
                        title="마음에 담아두기 (보관)"
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition cursor-pointer"
                      >
                        {message.isBookmarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start mr-auto max-w-xl">
            <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-stone-500">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm">
                {activePersona.avatar}
              </div>
              <span className="font-medium text-stone-700">{activePersona.name}</span>
            </div>
            <div className="bg-white border border-amber-200/60 rounded-3xl rounded-tl-xs p-4 shadow-xs flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {activePersona.name}이 선생님의 마음에 귀 기울이며 정성껏 글을 적고 있습니다...
              </span>
            </div>
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl mx-auto shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => {
                setErrorMessage(null);
                const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUserMsg) {
                  handleSendMessage(lastUserMsg.content);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shrink-0 transition cursor-pointer"
            >
              다시 시도하기
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Starters (선생님들의 실제 아픔을 대변하는 칩) */}
      <div className="bg-amber-50/50 border-t border-amber-100/60 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-semibold text-stone-700">선생님들이 가장 많이 털어놓는 고민:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt.text)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-amber-100/60 text-stone-700 hover:text-stone-900 border border-stone-200/90 rounded-xl px-3 py-1.5 shrink-0 transition shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{prompt.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-stone-200 p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`${activePersona.name}에게 오늘 하루 교실에서 힘들었던 일이나 털어놓고 싶은 마음을 자유롭게 적어보세요... (Shift+Enter 줄바꿈)`}
              rows={2}
              className="w-full resize-none rounded-2xl bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-amber-400 p-3 text-sm text-stone-800 focus:outline-hidden transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="h-12 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-medium flex items-center justify-center gap-1.5 transition shadow-sm shadow-amber-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">보내기</span>
          </button>
        </form>
        <p className="text-[11px] text-stone-400 text-center mt-2">
          선생님의 모든 상담 내용은 안전하게 보호되며, 언제든 상단 '기록 저장'을 통해 나만의 치유 일기로 소장하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};

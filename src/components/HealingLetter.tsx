import React, { useState } from 'react';
import { Send, Heart, Copy, Check, RotateCw, Volume2, VolumeX, Sparkles, Feather } from 'lucide-react';

export const HealingLetter: React.FC = () => {
  const [teacherName, setTeacherName] = useState('김 선생님');
  const [yearsOfTeaching, setYearsOfTeaching] = useState('5년 차 교사');
  const [todayStruggle, setTodayStruggle] = useState('');
  const [hopeWord, setHopeWord] = useState('있는 그대로의 나를 인정받고 편히 쉬고 싶음');
  const [isLoading, setIsLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerateLetter = async () => {
    setIsLoading(true);
    setCopied(false);
    try {
      const res = await fetch('/api/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName,
          yearsOfTeaching,
          todayStruggle: todayStruggle || '보이지 않는 곳에서 홀로 버텨낸 수많은 상처와 무게',
          hopeWord,
        }),
      });

      if (!res.ok) throw new Error('편지 생성 실패');
      const data = await res.json();
      setLetter(data.letter);
    } catch (err) {
      console.error(err);
      setLetter(`존경하는 ${teacherName}께,

오늘도 교탁 앞을 지키며 수많은 아이들의 눈빛과 목소리를 온몸으로 받아내느라 얼마나 고단하셨습니까.
교실 문이 닫히고 홀로 남겨진 교무실 자리에서, 불 꺼진 복도를 걸어 나오며 차마 밖으로 내뱉지 못한 한숨이 얼마나 깊었을지 짐작조차 어렵습니다.

선생님, 세상은 때로 교사라는 이름 뒤에 숨겨진 연약한 한 인간의 눈물을 너무 쉽게 지나칩니다.
누군가의 거친 말 한마디, 섭섭한 학부모의 항의, 내 뜻대로 되지 않는 아이들의 모습에 "내가 부족해서일까" 하고 스스로의 가슴을 찌르지 마세요.
아이들이 오늘 무사히 하루를 보내고 돌아갈 수 있었던 것은, 선생님께서 당신의 마음을 쪼개어 그들의 안전망이 되어주셨기 때문입니다.

선생님이 쏟으신 그 따뜻한 눈길과 침묵 속의 인내는 결코 사라지지 않습니다. 아이들의 마음 깊은 곳에 씨앗처럼 심겨 언젠가 꽃을 피울 것입니다.
하지만 오늘은, 그 어떤 훌륭한 교육자보다 먼저 '선생님 자신'을 가장 귀하게 여겨주세요.
오늘 밤만큼은 모든 짐을 교실에 내려놓고, 온전히 평안하게 숨 쉬시기를 진심으로 기도합니다.

— 당신의 모든 걸음을 묵묵히 응원하는 이로부터 —`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (!letter) return;
    if (!('speechSynthesis' in window)) {
      alert('음성 읽기를 지원하지 않는 브라우저입니다.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = letter.replace(/[*#_~`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              나를 위한 위로의 헌사 편지
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              세상 그 누구도 알아주지 않았던 나의 헌신과 눈물, 오늘 하루 수고한 나 자신에게 바치는 세상에서 가장 따뜻한 편지입니다.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                불리우고 싶은 호칭:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="예: 김민지 선생님, 3반 담임쌤"
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                교직 연차 / 근무 형태:
              </label>
              <input
                type="text"
                value={yearsOfTeaching}
                onChange={(e) => setYearsOfTeaching(e.target.value)}
                placeholder="예: 3년 차 초등 교사, 15년 차 중등 부장교사"
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              오늘 나를 가장 힘들게 했던 보이지 않는 고통이나 삼킨 눈물:
            </label>
            <input
              type="text"
              value={todayStruggle}
              onChange={(e) => setTodayStruggle(e.target.value)}
              placeholder="예: 최선을 다해 가르쳤는데 돌아온 건 학부모의 차가운 불신과 아이들의 냉소였어요..."
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold">바라는 위로의 색채:</span>
              <select
                value={hopeWord}
                onChange={(e) => setHopeWord(e.target.value)}
                className="bg-stone-100 rounded-lg px-2.5 py-1 text-xs border border-stone-200"
              >
                <option value="있는 그대로의 나를 인정받고 푹 쉬고 싶음">따뜻한 인정과 휴식</option>
                <option value="죄책감과 자책감에서 해방되고 싶음">자책감 없는 자유</option>
                <option value="교사로서의 자존감과 용기를 되찾고 싶음">단단한 자존감 회복</option>
                <option value="그저 내 편이 되어 함께 울어주는 위로">깊은 공감과 위로</option>
              </select>
            </div>

            <button
              onClick={handleGenerateLetter}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>편지를 정성껏 쓰고 있습니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>나를 위한 헌사 편지 받기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Letter Display */}
      {letter && (
        <div className="bg-[#fcfaf7] border border-amber-200/90 rounded-3xl p-6 sm:p-10 shadow-md relative">
          {/* Top Actions */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-200/60 mb-6">
            <div className="flex items-center gap-2 text-amber-800 font-serif font-bold text-sm">
              <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
              <span>선생님을 위한 마음의 헌정 서신</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeak}
                className="flex items-center gap-1 text-xs bg-amber-100 hover:bg-amber-200/80 text-amber-900 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>낭독 중지</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>음성으로 듣기</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>편지 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Letter Body */}
          <div className="text-stone-800 leading-loose text-sm sm:text-base font-serif whitespace-pre-wrap px-2 sm:px-4">
            {letter}
          </div>

          <div className="mt-8 pt-6 border-t border-amber-200/60 text-center">
            <p className="text-xs text-stone-500 font-sans">
              "선생님, 오늘 밤은 교실의 모든 문을 단단히 닫고, 온전히 당신의 평온만을 누리세요."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
